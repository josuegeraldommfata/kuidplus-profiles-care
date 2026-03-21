import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: number;
  title: string;
  status: string;
  professional_name: string;
  created_at: string;
  proposals_count: number;
}

export default function ServicosContratados() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
        description: 'Não foi possível carregar serviços',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'profissional_selecionado':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Serviços Contratados</h1>
          <Badge>{services.length} serviços</Badge>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-2xl text-muted-foreground mb-4">Nenhum serviço contratado</p>
              <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>
                Postar novo serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === 'open' ? 'Aberto' :
                         service.status === 'profissional_selecionado' ? 'Profissional selecionado' :
                         service.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{service.proposals_count} propostas</div>
                      <div className="text-sm text-muted-foreground">{service.created_at}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span>Profissional: {service.professional_name}</span>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                    <Button size="sm">
                      Iniciar chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

