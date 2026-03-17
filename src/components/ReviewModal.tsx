import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/StarRating';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Send, X } from 'lucide-react';

interface ReviewModalProps {
  triggerButton: React.ReactNode;
  serviceId: number;
  targetUserId: number;
  targetUserName: string;
  isProfessionalReview: boolean;
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({
  triggerButton,
  serviceId,
  targetUserId,
  targetUserName,
  isProfessionalReview,
  onReviewSubmitted
}: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        service_id: serviceId,
        reviewed_id: targetUserId,
        rating,
        comment: comment.trim() || null,
      };

      await api.post('/api/reviews', payload);

      toast({
        title: 'Avaliação enviada!',
        description: 'Obrigado por sua avaliação.',
      });

      setOpen(false);
      setRating(5);
      setComment('');
      onReviewSubmitted?.();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error || 'Erro ao enviar avaliação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isProfessionalReview ? 'Avaliar Profissional' : 'Avaliar Contratante'}
          </DialogTitle>
          <DialogDescription>
            Deixe sua avaliação para <strong>{targetUserName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nota (1-5)</Label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Comentário (opcional)
            </Label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="O que achou do serviço? Pontualidade, qualidade do atendimento, comunicação..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!rating || loading}
            className="gradient-primary border-0"
          >
            {loading ? 'Enviando...' : (
              <>
                <Send className="w-4 h-4 mr-1" />
                Avaliar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

