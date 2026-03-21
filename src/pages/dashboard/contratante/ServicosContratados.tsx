import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import ContractorMarketplaceSidebar from '@/components/ContractorMarketplaceSidebar';
import { MessageCircle, CheckCircle, Play, Star } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  status: string;
  professional_name: string;
  created_at: string;
  proposals_count: number;
  value?: number;
}

export default function ServicosContratados() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchServices();
  }, [user?.id]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services/my-services');
      setServices(response.data);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar serviços', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const markAsStarted = async (serviceId: number) => {
    try {
      await api.patch(`/api/services/${serviceId}/status`, { status: 'em_andamento' });
      toast({ title: 'Sucesso', description: 'Serviço marcado como em andamento!' });
      fetchServices();
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

  const markAsCompleted = async (serviceId: number) => {
    try {
      await api.patch(`/api/services/${serviceId}/status`, { status: 'completed' });
      toast({ title: 'Sucesso', description: 'Serviço concluído!' });
      fetchServices();
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao concluir serviço', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      open: { label: 'Aberto', variant: 'secondary' },
      profissional_selecionado: { label: 'Profissional Selecionado', variant: 'default' },
      em_andamento: { label: 'Em Andamento', variant: 'outline' },
      completed: { label: 'Concluído', variant: 'default' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };
    const s = map[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <ContractorMarketplaceSidebar />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Serviços Contratados</h1>
                  <p className="text-muted-foreground">{services.length} serviços</p>
                </div>
                <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>Postar Novo</Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : services.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhum serviço contratado</p>
                    <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>Postar novo serviço</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Profissional: {service.professional_name || 'Aguardando seleção'}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            {getStatusBadge(service.status)}
                            <p className="text-xs text-muted-foreground">{service.proposals_count} propostas</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Criado em {new Date(service.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/contratante/meus-servicos/${service.id}`)}>
                              Ver detalhes
                            </Button>
                            {service.status === 'profissional_selecionado' && (
                              <Button size="sm" onClick={() => markAsStarted(service.id)}>
                                <Play className="w-4 h-4 mr-1" /> Iniciar
                              </Button>
                            )}
                            {service.status === 'em_andamento' && (
                              <Button size="sm" onClick={() => markAsCompleted(service.id)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Concluir
                              </Button>
                            )}
                            {service.professional_name && (
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/mensagens`)}>
                                <MessageCircle className="w-4 h-4 mr-1" /> Chat
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
