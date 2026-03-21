import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';

interface HistoricoItem {
  id: number;
  type: 'contrato' | 'conversa' | 'serviço';
  title: string;
  status: string;
  date: string;
  value?: number;
  partner_name: string;
  rating?: number;
}

export default function Historico() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'contratos' | 'conversas'>('todos');

  useEffect(() => {
    if (user?.id) fetchHistorico();
  }, [user?.id, filter]);

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      // Mock data - substituir por APIs reais
      const mockData: HistoricoItem[] = [
        { id: 1, type: 'contrato', title: 'Cuidado domiciliar - 3 diárias', status: 'completed', date: '15/11/2024', value: 750, partner_name: 'Maria Silva', rating: 5 },
        { id: 2, type: 'serviço', title: 'Fisioterapia esportiva', status: 'cancelled', date: '10/11/2024', value: 180, partner_name: 'João Santos' },
        { id: 3, type: 'conversa', title: 'Proposta enfermagem noturna', status: 'closed', date: '08/11/2024', partner_name: 'Ana Oliveira', rating: 4 },
      ];
      let filtered = mockData;
      if (filter === 'contratos') filtered = mockData.filter(i => i.type === 'contrato');
      else if (filter === 'conversas') filtered = mockData.filter(i => i.type === 'conversa' || i.type === 'serviço');
      setHistorico(filtered);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar histórico', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, string> = { contrato: '📋', conversa: '💬', serviço: '🩺' };
    return map[type] || '📂';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { completed: 'Concluído', active: 'Ativo', cancelled: 'Cancelado', closed: 'Fechado' };
    return map[status] || status;
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <MarketplaceSidebar />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Histórico</h1>
                  <p className="text-muted-foreground">{historico.length} registros</p>
                </div>
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                  {(['todos', 'contratos', 'conversas'] as const).map(f => (
                    <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)} className="capitalize">
                      {f}
                    </Button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : historico.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhum histórico encontrado</p>
                    <Button onClick={() => navigate('/dashboard/profissional/servicos-disponiveis')}>Buscar serviços</Button>
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
                          {item.rating && <span>⭐ {item.rating}/5</span>}
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
