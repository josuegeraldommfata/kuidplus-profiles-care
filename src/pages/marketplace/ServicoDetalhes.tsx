import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProposalCard } from '@/components/marketplace/ProposalCard';
import { ReviewDialog } from '@/components/marketplace/ReviewDialog';
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from '@/types/marketplace';
import {
  ArrowLeft, MapPin, Calendar, Clock, DollarSign, AlertTriangle,
  Play, CheckCircle, XCircle, MessageCircle, Star
} from 'lucide-react';

export default function ServicoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getServiceById, updateProposalStatus, updateServiceStatus, startConversation } = useMarketplace();
  const navigate = useNavigate();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const service = getServiceById(id || '');

  if (!service) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Serviço não encontrado</p>
            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isContractor = user?.id === service.contractorId;
  const acceptedProposal = service.proposals.find(p => p.status === 'aceita');

  const handleAcceptProposal = (proposalId: string) => {
    updateProposalStatus(service.id, proposalId, 'aceita');
    const proposal = service.proposals.find(p => p.id === proposalId);
    if (proposal && user) {
      const conv = startConversation({
        serviceId: service.id,
        serviceTitle: service.title,
        participantId: proposal.professionalId,
        participantName: proposal.professionalName,
        participantImage: proposal.professionalImage,
        participantRole: 'profissional',
      });
      navigate(`/chat/${conv.id}`);
    }
  };

  const handleRejectProposal = (proposalId: string) => {
    updateProposalStatus(service.id, proposalId, 'recusada');
  };

  const handleStartChat = (proposal: typeof service.proposals[0]) => {
    if (!user) return;
    const conv = startConversation({
      serviceId: service.id,
      serviceTitle: service.title,
      participantId: proposal.professionalId,
      participantName: proposal.professionalName,
      participantImage: proposal.professionalImage,
      participantRole: 'profissional',
    });
    navigate(`/chat/${conv.id}`);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          {/* Service details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className={SERVICE_STATUS_COLORS[service.status]}>
                      {SERVICE_STATUS_LABELS[service.status]}
                    </Badge>
                    <Badge variant="outline">{service.professionType}</Badge>
                    {service.urgent && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" /> Urgente
                      </Badge>
                    )}
                  </div>
                </div>

                {isContractor && (
                  <div className="flex gap-2">
                    {service.status === 'profissional_selecionado' && (
                      <Button size="sm" onClick={() => updateServiceStatus(service.id, 'em_andamento')}>
                        <Play className="w-3 h-3 mr-1" /> Iniciar Serviço
                      </Button>
                    )}
                    {service.status === 'em_andamento' && (
                      <Button size="sm" onClick={() => {
                        updateServiceStatus(service.id, 'concluido');
                        if (acceptedProposal) setReviewDialogOpen(true);
                      }} className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> Concluir
                      </Button>
                    )}
                    {['aberto', 'recebendo_propostas'].includes(service.status) && (
                      <Button variant="destructive" size="sm" onClick={() => updateServiceStatus(service.id, 'cancelado')}>
                        <XCircle className="w-3 h-3 mr-1" /> Cancelar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{service.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Localização</p>
                    <p className="font-medium">{service.city}, {service.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Data</p>
                    <p className="font-medium">{new Date(service.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Horário</p>
                    <p className="font-medium">{service.startTime} - {service.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Valor</p>
                    <p className="font-medium">
                      {service.offeredValue ? `R$ ${service.offeredValue.toFixed(2)}` : 'A combinar'}
                      {service.negotiable && ' (negociável)'}
                    </p>
                  </div>
                </div>
              </div>

              {service.location && (
                <p className="text-sm text-muted-foreground">📍 {service.location}</p>
              )}
            </CardContent>
          </Card>

          {/* Proposals */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Propostas ({service.proposals.length})
            </h2>

            {service.proposals.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhuma proposta recebida ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {service.proposals.map(p => (
                  <ProposalCard
                    key={p.id}
                    proposal={p}
                    isContractor={isContractor}
                    onAccept={() => handleAcceptProposal(p.id)}
                    onReject={() => handleRejectProposal(p.id)}
                    onChat={() => handleStartChat(p)}
                    onViewProfile={() => navigate(`/profissional/${p.professionalId}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Review after completion */}
          {service.status === 'concluido' && isContractor && acceptedProposal && (
            <Card className="border-primary/30">
              <CardContent className="py-6 text-center">
                <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="font-medium mb-2">Serviço concluído!</p>
                <p className="text-sm text-muted-foreground mb-4">Avalie o profissional para ajudar outros contratantes</p>
                <Button onClick={() => setReviewDialogOpen(true)} className="gradient-highlight border-0">
                  Avaliar Profissional
                </Button>
              </CardContent>
            </Card>
          )}

          {acceptedProposal && (
            <ReviewDialog
              open={reviewDialogOpen}
              onOpenChange={setReviewDialogOpen}
              serviceId={service.id}
              serviceTitle={service.title}
              professionalId={acceptedProposal.professionalId}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
