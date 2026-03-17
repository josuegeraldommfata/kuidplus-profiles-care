import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import ReviewModal from '@/components/ReviewModal';
import ContractorMarketplaceSidebar from '@/components/ContractorMarketplaceSidebar';

interface Service {
  id: number;
  title: string;
  description: string;
  profession: string;
  city: string;
  budget_min: number;
  budget_max: number;
  status: string;
  proposal_id: number | null;
  professional_name: string;
  professional_id: number;
  proposals_count: number;
  created_at: string;
}

interface Proposal {
  id: number;
  professional_name: string;
  message: string;
  expected_budget: number;
  created_at: string;
}

export default function MeusServicos() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchServices();
    }
  }, [user?.id]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services/my-services');
      setServices(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus serviços',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (serviceId: number, proposalId: number, professionalId: number, professionalName: string) => {
    try {
      await api.post(`/api/services/${serviceId}/accept-proposal/${proposalId}`);
      toast({
        title: 'Proposta aceita!',
        description: `Conversa iniciada com ${professionalName}`,
      });
      // Refresh list
      fetchServices();
      navigate(`/chat?serviceId=${serviceId}`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível aceitar a proposta',
        variant: 'destructive',
      });
    }
  };

  const handlePayService = async (serviceId: number) => {
    try {
      const response = await api.post(`/api/payments/service-checkout/${serviceId}`);
      window.location.href = response.data.init_point;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar pagamento',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Aberto</Badge>;
      case 'proposal_accepted':
        return <Badge variant="outline">Proposta Aceita</Badge>;
      case 'paid':
        return <Badge className="bg-success">Pago</Badge>;
      case 'completed':
        return <Badge className="bg-primary">Concluído</Badge>;
      default:
        return <Badge variant="destructive">Erro</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando seus serviços...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <ContractorMarketplaceSidebar />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                  Meus Serviços
                </h1>
                <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>
                  Novo Serviço
                </Button>
              </div>

              {services.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado</p>
                    <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>
                      Criar primeiro serviço
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{service.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge>{service.profession}</Badge>
                              <Badge variant="outline">{service.city}</Badge>
                              {getStatusBadge(service.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              R$ {service.budget_min} - {service.budget_max}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(service.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{service.description}</p>

                        {service.status === 'open' && service.proposals_count > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2">Propostas recebidas ({service.proposals_count})</h4>
                            {/* Aqui lista as propostas ou link para página */}
                            <Button variant="outline" size="sm" className="mr-2">
                              Ver Propostas
                            </Button>
                          </div>
                        )}

                        {service.status === 'proposal_accepted' && !service.payment_id && (
                          <div className="bg-warning/10 border border-warning rounded-lg p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Proposta aceita!
                            </h4>
                            <p className="text-sm text-warning mb-4">
                              Profissional: {service.professional_name}
                            </p>
                            <Button
                              onClick={() => handlePayService(service.id)}
                              className="gradient-primary border-0"
                            >
                              Pagar Serviço
                            </Button>
                          </div>
                        )}

                        {service.status === 'paid' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-success">✅ Pago</Badge>
                              <span>Aguardando conclusão do serviço</span>
                            </div>
                            <Button variant="outline" size="sm" className="mr-2">
                              Ver Recibo
                            </Button>
                            <ReviewModal
                              triggerButton={<Button size="sm" variant="outline">Avaliar</Button>}
                              serviceId={service.id}
                              targetUserId={service.professional_id}
                              targetUserName={service.professional_name}
                              isProfessionalReview={true}
                            />
                          </div>
                        )}

                        {service.status === 'completed' && (
                          <div className="flex gap-2">
                            <Badge className="bg-primary">Concluído</Badge>
                            <ReviewModal
                              triggerButton={<Button size="sm" variant="outline">Deixar Avaliação</Button>}
                              serviceId={service.id}
                              targetUserId={service.professional_id}
                              targetUserName={service.professional_name}
                              isProfessionalReview={true}
                            />
                          </div>
                        )}
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

