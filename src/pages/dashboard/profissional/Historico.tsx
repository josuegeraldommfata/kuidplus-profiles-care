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
    if (user?.id) {
      fetchHistorico();
    }
  }, [user?.id, filter]);

  const fetchHistorico = async () => {
    try {
      setLoading(true);

      // Mock data por enquanto - substituir por APIs reais depois
      const mockData: HistoricoItem[] = [
        {
          id: 1,
          type: 'contrato',
          title: 'Consulta Nutricionista - Plano 3 sessões',
          status: 'completed',
          date: '15/11/2024',
          value: 250,
          partner_name: 'Maria Silva',
          rating: 5
        },
        {
          id: 2,
          type: 'serviço',
          title: 'Fisioterapia esportiva - 2 sessões',
          status: 'cancelled',
          date: '10/11/2024',
          value: 180,
          partner_name: 'João Santos',
          rating: null
        },
        {
          id: 3,
          type: 'conversa',
          title: 'Proposta Enfermagem domiciliar',
          status: 'closed',
          date: '08/11/2024',
          value: null,
          partner_name: 'Ana Oliveira',
          rating: 4
        }
      ];

      // Filtrar por tipo
      let filtered = mockData;
      if (filter === 'contratos') {
        filtered = mockData.filter(item => item.type === 'contrato');
      } else if (filter === 'conversas') {
        filtered = mockData.filter(item => item.type === 'conversa' || item.type === 'serviço');
      }

      setHistorico(filtered);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar histórico',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contrato': return '📋';
      case 'conversa': return '💬';
      case 'serviço': return '🩺';
      default: return '📂';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
          <div>
            <h1 className="text-3xl font-bold">Histórico</h1>
            <p className="text-muted-foreground mt-2">
              Todos seus contratos, serviços e conversas finalizadas
              <span className="ml-4 px-3 py-1 bg-muted rounded-full text-sm">
                {historico.length} registros
              </span>
            </p>
          </div>

          <div className="flex gap-2 bg-muted p-2 rounded-lg">
            <Button
              variant={filter === 'todos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('todos')}
              className="h-9"
            >
              Todos
            </Button>
            <Button
              variant={filter === 'contratos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('contratos')}
              className="h-9"
            >
              Contratos
            </Button>
            <Button
              variant={filter === 'conversas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('conversas')}
              className="h-9"
            >
              Conversas
            </Button>
          </div>
        </div>

        {historico.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Nenhum histórico</h3>
              <p className="text-muted-foreground mb-6">
                Ainda não há registros de contratos ou conversas finalizadas.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/dashboard/profissional/marketplace')}>
                  Buscar serviços
                </Button>
                <Button onClick={() => navigate('/dashboard/mensagens')}>
                  Ver mensagens
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {historico.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      {getTypeIcon(item.type)}
                      <span>{item.title}</span>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'completed' ? 'Concluído' :
                       item.status === 'active' ? 'Ativo' :
                       item.status === 'cancelled' ? 'Cancelado' : 'Fechado'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>{item.date}</span>
                    {item.value && <span>R$ {item.value.toLocaleString()}</span>}
                    <span>Parceiro: {item.partner_name}</span>
                    {item.rating && (
                      <span className="flex items-center gap-1">
                        ⭐ {item.rating}/5
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                    <Button variant="ghost" size="sm">
                      Avaliar
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

