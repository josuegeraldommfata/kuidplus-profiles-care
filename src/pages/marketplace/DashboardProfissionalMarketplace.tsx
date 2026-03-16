import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { SendProposalDialog } from '@/components/marketplace/SendProposalDialog';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { NotificationBell } from '@/components/marketplace/NotificationBell';
import { PROPOSAL_STATUS_LABELS } from '@/types/marketplace';
import { Service } from '@/types/marketplace';
import {
  Briefcase, Send, CheckCircle, Clock, History, MessageCircle,
  FileText, DollarSign
} from 'lucide-react';

export default function DashboardProfissionalMarketplace() {
  const { user } = useAuth();
  const { getAvailableServices, getProposalsByProfessional, getConversationsByUser, getReviewsByProfessional } = useMarketplace();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const availableServices = getAvailableServices();
  const myProposals = getProposalsByProfessional(user.id);
  const myConversations = getConversationsByUser(user.id);
  const myReviews = getReviewsByProfessional(user.id);

  const sentProposals = myProposals.filter(p => p.proposal.status === 'enviada');
  const acceptedProposals = myProposals.filter(p => p.proposal.status === 'aceita');
  const inProgressServices = myProposals.filter(p =>
    p.proposal.status === 'aceita' && (p.service.status === 'em_andamento' || p.service.status === 'profissional_selecionado')
  );
  const completedServices = myProposals.filter(p =>
    p.proposal.status === 'aceita' && p.service.status === 'concluido'
  );

  const statusColors: Record<string, string> = {
    enviada: 'bg-blue-100 text-blue-800',
    aceita: 'bg-green-100 text-green-800',
    recusada: 'bg-red-100 text-red-800',
    em_negociacao: 'bg-amber-100 text-amber-800',
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground text-sm">Encontre serviços e gerencie suas propostas</p>
            </div>
            <NotificationBell />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{availableServices.length}</p>
                <p className="text-xs text-muted-foreground">Disponíveis</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Send className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{sentProposals.length}</p>
                <p className="text-xs text-muted-foreground">Enviadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <p className="text-2xl font-bold">{acceptedProposals.length}</p>
                <p className="text-xs text-muted-foreground">Aceitas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">{inProgressServices.length}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <History className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{completedServices.length}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="available">
                <Briefcase className="w-4 h-4 mr-1" /> Serviços ({availableServices.length})
              </TabsTrigger>
              <TabsTrigger value="proposals">
                <Send className="w-4 h-4 mr-1" /> Propostas ({myProposals.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                <Clock className="w-4 h-4 mr-1" /> Ativos ({inProgressServices.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-1" /> Histórico ({completedServices.length})
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="w-4 h-4 mr-1" /> Mensagens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              {availableServices.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum serviço disponível</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableServices.map(s => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      showProposalButton
                      onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}
                      onSendProposal={() => {
                        setSelectedService(s);
                        setProposalDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="proposals">
              {myProposals.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma proposta enviada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myProposals.map(({ service, proposal }) => (
                    <Card key={proposal.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/dashboard/contratante/meus-servicos/${service.id}`)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{service.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {service.city}, {service.state} • {new Date(service.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge className={statusColors[proposal.status]}>
                            {PROPOSAL_STATUS_LABELS[proposal.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <DollarSign className="w-3 h-3" /> R$ {proposal.proposedValue.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Enviada em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active">
              {inProgressServices.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum serviço em andamento</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgressServices.map(({ service }) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${service.id}`)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {completedServices.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum serviço concluído</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {completedServices.map(({ service }) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${service.id}`)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages">
              {myConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma conversa</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myConversations.map(c => (
                    <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/chat/${c.id}`)}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{c.participantName}</p>
                          <p className="text-xs text-muted-foreground">{c.serviceTitle}</p>
                          {c.lastMessage && <p className="text-xs text-muted-foreground truncate mt-1">{c.lastMessage}</p>}
                        </div>
                        {c.unreadCount > 0 && (
                          <Badge variant="destructive" className="rounded-full">{c.unreadCount}</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <SendProposalDialog
            service={selectedService}
            open={proposalDialogOpen}
            onOpenChange={setProposalDialogOpen}
          />
        </div>
      </div>
    </Layout>
  );
}
