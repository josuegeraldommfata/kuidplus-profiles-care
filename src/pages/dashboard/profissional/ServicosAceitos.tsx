import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import { MessageCircle, CheckCircle } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  status: string;
  contractor_name: string;
  created_at: string;
  value?: number;
}

export default function ServicosAceitos() {
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
      const response = await api.get('/api/service-proposals/my-proposals');
      setServices(response.data.filter((s: any) => s.status?.toLowerCase() === 'aceita'));
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar serviços aceitos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <MarketplaceSidebar />
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Serviços Aceitos</h1>
                <p className="text-muted-foreground">{services.length} serviços</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : services.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhum serviço aceito</p>
                    <Button onClick={() => navigate('/dashboard/profissional/servicos-disponiveis')}>Buscar novos serviços</Button>
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
                            <p className="text-sm text-muted-foreground">Contratante: {service.contractor_name}</p>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-600">Aceito</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(service.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/mensagens')}>
                              <MessageCircle className="w-4 h-4 mr-1" /> Chat
                            </Button>
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
