import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { Service, SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from '@/types/marketplace';

interface ServiceCardProps {
  service: Service;
  onViewDetails?: () => void;
  onSendProposal?: () => void;
  showProposalButton?: boolean;
  compact?: boolean;
}

export function ServiceCard({ service, onViewDetails, onSendProposal, showProposalButton = false, compact = false }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className={compact ? 'text-base' : 'text-lg'}>{service.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={SERVICE_STATUS_COLORS[service.status]}>
                {SERVICE_STATUS_LABELS[service.status]}
              </Badge>
              <Badge variant="outline">{service.professionType}</Badge>
              {service.urgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Urgente
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{service.city}, {service.state}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(service.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.startTime} - {service.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span>
              {service.offeredValue ? `R$ ${service.offeredValue.toFixed(2)}` : 'A combinar'}
              {service.negotiable && ' (negociável)'}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Publicado por <span className="font-medium">{service.contractorName}</span>
          {service.proposals.length > 0 && ` • ${service.proposals.length} proposta(s)`}
        </div>

        <div className="flex gap-2 pt-1">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
              Ver Detalhes
            </Button>
          )}
          {showProposalButton && onSendProposal && (service.status === 'aberto' || service.status === 'recebendo_propostas') && (
            <Button size="sm" onClick={onSendProposal} className="flex-1 gradient-highlight border-0">
              Enviar Proposta
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
