import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import ContractorMarketplaceSidebar from '@/components/ContractorMarketplaceSidebar';

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
    if (user?.id) fetchHistorico();
  }, [user?.id]);

  const fetchHistorico = async () => {
    try {
      const [contractsRes, servicesRes] = await Promise.all([
        api.get('/api/contracts'),
        api.get('/api/services/my-services')
      ]);

      const contracts = contractsRes.data.map((c: any) => ({
        id: c.id, type: 'contrato' as const, title: c.service_title || 'Contrato',
        status: c.status, date: new Date(c.created_at).toLocaleDateString('pt-BR'),
        value: c.value, partner_name: c.professional_name, rating: c.rating
      }));

      const services = servicesRes.data
        .filter((s: any) => s.status !== 'open')
        .map((s: any) => ({
          id: s.id, type: 'serviço' as const, title: s.title,
          status: s.status, date: new Date(s.created_at).toLocaleDateString('pt-BR'),
          partner_name: s.professional_name || 'Não selecionado',
        }));

      setHistorico([...contracts, ...services]);
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar histórico', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, string> = { contrato: '📋', serviço: '🩺', proposta: '📨' };
    return map[type] || '📂';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      completed: 'Concluído', active: 'Ativo', cancelled: 'Cancelado',
      profissional_selecionado: 'Selecionado', em_andamento: 'Em Andamento',
    };
    return map[status] || status;
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <ContractorMarketplaceSidebar />
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Meu Histórico</h1>
                <p className="text-muted-foreground">{historico.length} registros</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : historico.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhum histórico encontrado</p>
                    <Button onClick={() => navigate('/dashboard/contratante/postar-servico')}>Contratar serviço</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {historico.map((item) => (
                    <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            {getTypeIcon(item.type)} {item.title}
                          </div>
                          <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{item.date}</span>
                          {item.value && <span>R$ {item.value.toLocaleString()}</span>}
                          <span>{item.partner_name}</span>
                          {item.rating && <span>⭐ {item.rating}</span>}
                        </div>
                      </CardHeader>
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
