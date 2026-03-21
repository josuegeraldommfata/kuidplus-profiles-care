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
  contractor_name: string;
  created_at: string;
}

export default function ServicosAceitos() {
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
      const response = await api.get('/api/service-proposals/my-proposals');
      setServices(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar serviços aceitos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">Serviços Aceitos</h1>
          <Badge>{services.length} serviços</Badge>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-2xl text-muted-foreground mb-4">Nenhum serviço aceito</p>
              <Button onClick={() => navigate('/dashboard/profissional/marketplace')}>
                Buscar novos serviços
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <Badge>{service.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Contratante: {service.contractor_name}</span>
                    <span>{service.created_at}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Ver detalhes</Button>
                    <Button variant="outline" size="sm">Chat</Button>
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

