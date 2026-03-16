import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  ThumbsUp,
  Flag,
  Send,
} from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  contractor_name: string;
  contractor_image: string;
}

interface ReviewsTimelineProps {
  professionalId: string;
}

export function ReviewsTimeline({ professionalId }: ReviewsTimelineProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [professionalId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/professionals/${professionalId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      await api.post(`/api/professionals/${professionalId}/reviews`, {
        rating: newRating,
        comment: newComment.trim() || null,
      });

      setNewRating(5);
      setNewComment('');
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const hasUserReviewed = reviews.some(review =>
    review.contractor_name === user?.name
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gradient-highlight" />
            Avaliações ({reviews.length})
          </h2>

          {user && !hasUserReviewed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              <Star className="w-4 h-4 mr-2" />
              Avaliar
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <Card className="mb-6 border-dashed">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Deixe sua avaliação</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nota (1-5 estrelas)
                  </label>
                  <StarRating
                    rating={newRating}
                    onRatingChange={setNewRating}
                    size="lg"
                    interactive
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Comentário (opcional)
                  </label>
                  <Textarea
                    placeholder="Conte sua experiência com este profissional..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={submitReview}
                    disabled={submitting}
                    className="gradient-highlight border-0"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ainda não há avaliações para este profissional.</p>
            {user && !hasUserReviewed && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowReviewForm(true)}
              >
                Seja o primeiro a avaliar
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id} className="relative">
                {/* Timeline line */}
                {index < reviews.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-border"></div>
                )}

                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {review.contractor_image ? (
                        <img
                          src={review.contractor_image}
                          alt={review.contractor_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.contractor_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            Contratante
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
