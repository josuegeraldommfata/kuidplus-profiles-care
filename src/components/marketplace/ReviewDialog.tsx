import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/StarRating';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceTitle: string;
  professionalId: string;
}

export function ReviewDialog({ open, onOpenChange, serviceId, serviceTitle, professionalId }: ReviewDialogProps) {
  const { addReview } = useMarketplace();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!user) return;
    addReview({
      serviceId,
      serviceTitle,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerImage: user.profileImage,
      professionalId,
      rating,
      comment,
    });
    setRating(5);
    setComment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Profissional</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">{serviceTitle}</p>
          </div>

          <div className="space-y-2">
            <Label>Nota (1-5 estrelas)</Label>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" interactive showCount={false} />
          </div>

          <div className="space-y-2">
            <Label>Comentário / Feedback</Label>
            <Textarea
              placeholder="Como foi sua experiência com o profissional?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="gradient-highlight border-0">
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
