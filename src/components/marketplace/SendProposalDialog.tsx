import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Service } from '@/types/marketplace';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';

interface SendProposalDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendProposalDialog({ service, open, onOpenChange }: SendProposalDialogProps) {
  const { addProposal } = useMarketplace();
  const { user } = useAuth();
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [available, setAvailable] = useState(true);

  const handleSubmit = () => {
    if (!service || !user || !value) return;

    addProposal(service.id, {
      serviceId: service.id,
      professionalId: user.id,
      professionalName: user.name,
      professionalImage: user.profileImage,
      profession: (user as any).profession || 'Profissional',
      rating: 4.5,
      totalRatings: 0,
      proposedValue: parseFloat(value),
      message,
      available,
    });

    setValue('');
    setMessage('');
    setAvailable(true);
    onOpenChange(false);
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="font-medium text-sm">{service.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {service.offeredValue ? `Valor oferecido: R$ ${service.offeredValue.toFixed(2)}` : 'Valor a combinar'}
              {service.negotiable && ' (negociável)'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Valor Proposto (R$)</Label>
            <Input
              type="number"
              placeholder="Ex: 200.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mensagem para o Contratante</Label>
            <Textarea
              placeholder="Descreva sua experiência, qualificações e por que é o melhor profissional para este serviço..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="available"
              checked={available}
              onCheckedChange={(c) => setAvailable(c === true)}
            />
            <Label htmlFor="available" className="text-sm">
              Confirmo que estou disponível na data e horário informados
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!value || !available} className="gradient-highlight border-0">
              <Send className="w-4 h-4 mr-2" />
              Enviar Proposta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
