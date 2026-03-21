import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface HistoricoItem {
  id: number;
  type: 'contrato' | 'serviço' | 'proposta';
  title: string;
  status: string;
  date: string;
  value?: number;
  partner_name: string;
  rating?: number;
}

export default function HistoricoContratante() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchHistorico();
    }
  }, [user?.id]);

  const fetchHistorico = async () => {
    try {
      // Busca contratos + serviços finalizados
      const [contractsRes, servicesRes] = await Promise.all([
        api.get('/api/contracts'),
        api.get('/api/services/my-services')
      ]);

      const contracts = contractsRes.data.map((c: any) => ({
        id: c.id,
        type: 'contrato' as const,
        title: c.service_title || 'Contrato',
        status: c.status,
        date: new Date(c.created_at).toLocaleDateString(),
        value: c.value,
        partner_name: c.professional_name,
        rating: c.rating
      } as HistoricoItem));

      const services = servicesRes.data
        .filter((s: any) => s.status !== 'open')
        .map((s: any) => ({
          id: s.id,
          type: 'serviço' as const,
          title: s.title,
          status: s.status,
          date: new Date(s.created_at).toLocaleDateString(),
          value: undefined,
          partner_name: s.professional_name || 'Não selecionado',
          rating: undefined
        } as HistoricoItem));

      setHistorico([...contracts, ...services]);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar histórico',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contrato': return '📋';
      case 'serviço': return '🩺';
      case 'proposta': return '📨';
      default: return '📂';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold">Meu Histórico</h1>
          <Badge>{historico.length} registros</Badge>
        </div>

        {historico.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-2xl text-muted-foreground mb-4">Nenhum histórico encontrado</p>
              <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>
                Contratar novo serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {historico.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      {getTypeIcon(item.type)}
                      {item.title}
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'completed' ? 'Concluído' : item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>{item.date}</span>
                    {item.value && <span>R$ {item.value.toLocaleString()}</span>}
                    <span>{item.partner_name}</span>
                    {item.rating && <span>⭐ {item.rating}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

