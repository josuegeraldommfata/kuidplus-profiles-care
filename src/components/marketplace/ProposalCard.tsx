import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { MessageCircle, Check, X, User } from 'lucide-react';
import { Proposal, PROPOSAL_STATUS_LABELS } from '@/types/marketplace';

interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
  onViewProfile?: () => void;
  isContractor?: boolean;
}

export function ProposalCard({ proposal, onAccept, onReject, onChat, onViewProfile, isContractor = false }: ProposalCardProps) {
  const statusColors: Record<string, string> = {
    enviada: 'bg-blue-100 text-blue-800',
    aceita: 'bg-green-100 text-green-800',
    recusada: 'bg-red-100 text-red-800',
    em_negociacao: 'bg-amber-100 text-amber-800',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {proposal.professionalImage ? (
              <img src={proposal.professionalImage} alt={proposal.professionalName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm truncate">{proposal.professionalName}</h4>
              <Badge className={statusColors[proposal.status] || 'bg-muted text-muted-foreground'}>
                {PROPOSAL_STATUS_LABELS[proposal.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{proposal.profession}</p>
            <StarRating rating={proposal.rating} totalRatings={proposal.totalRatings} size="sm" className="mt-1" />

            <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
              <p className="font-medium text-primary">R$ {proposal.proposedValue.toFixed(2)}</p>
              <p className="text-muted-foreground text-xs mt-1">{proposal.message}</p>
            </div>

            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(proposal.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>

            {isContractor && proposal.status === 'enviada' && (
              <div className="flex gap-2 mt-3">
                {onViewProfile && (
                  <Button variant="outline" size="sm" onClick={onViewProfile} className="text-xs">
                    <User className="w-3 h-3 mr-1" /> Ver Perfil
                  </Button>
                )}
                {onAccept && (
                  <Button size="sm" onClick={onAccept} className="text-xs bg-emerald-600 hover:bg-emerald-700">
                    <Check className="w-3 h-3 mr-1" /> Aceitar
                  </Button>
                )}
                {onReject && (
                  <Button variant="destructive" size="sm" onClick={onReject} className="text-xs">
                    <X className="w-3 h-3 mr-1" /> Recusar
                  </Button>
                )}
                {onChat && (
                  <Button variant="secondary" size="sm" onClick={onChat} className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" /> Chat
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
