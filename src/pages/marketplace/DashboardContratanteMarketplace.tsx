import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { NotificationBell } from '@/components/marketplace/NotificationBell';
import {
  Plus, ClipboardList, Clock, CheckCircle, MessageCircle, Users, FileText, Briefcase
} from 'lucide-react';

export default function DashboardContratanteMarketplace() {
  const { user } = useAuth();
  const { services, getConversationsByUser } = useMarketplace();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const myServices = services.filter(s => s.contractorId === user.id);
  const open = myServices.filter(s => ['aberto', 'recebendo_propostas', 'em_negociacao'].includes(s.status));
  const inProgress = myServices.filter(s => ['profissional_selecionado', 'em_andamento'].includes(s.status));
  const completed = myServices.filter(s => s.status === 'concluido');
  const totalProposals = myServices.reduce((acc, s) => acc + s.proposals.length, 0);
  const myConversations = getConversationsByUser(user.id);

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground text-sm">Publique serviços e encontre profissionais</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Button onClick={() => navigate('/dashboard/contratante/postar-servico')} className="gradient-highlight border-0">
                <Plus className="w-4 h-4 mr-2" /> Publicar Serviço
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{myServices.length}</p>
                <p className="text-xs text-muted-foreground">Publicados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{totalProposals}</p>
                <p className="text-xs text-muted-foreground">Propostas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <p className="text-2xl font-bold">{inProgress.length}</p>
                <p className="text-xs text-muted-foreground">Contratados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">{open.length}</p>
                <p className="text-xs text-muted-foreground">Abertos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="services">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="services">
                <ClipboardList className="w-4 h-4 mr-1" /> Meus Serviços
              </TabsTrigger>
              <TabsTrigger value="proposals">
                <FileText className="w-4 h-4 mr-1" /> Propostas ({totalProposals})
              </TabsTrigger>
              <TabsTrigger value="contracted">
                <Users className="w-4 h-4 mr-1" /> Contratados
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="w-4 h-4 mr-1" /> Mensagens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              {myServices.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">Nenhum serviço publicado</p>
                  <Button onClick={() => navigate('/dashboard/contratante/postar-servico')} className="gradient-highlight border-0">
                    <Plus className="w-4 h-4 mr-2" /> Publicar Primeiro Serviço
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myServices.map(s => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="proposals">
              {myServices.filter(s => s.proposals.length > 0).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma proposta recebida</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myServices.filter(s => s.proposals.length > 0).map(s => (
                    <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{s.title}</h3>
                            <p className="text-xs text-muted-foreground">{s.proposals.length} proposta(s)</p>
                          </div>
                          <Button size="sm" variant="outline">Ver Propostas</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contracted">
              {inProgress.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum profissional contratado</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgress.map(s => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
