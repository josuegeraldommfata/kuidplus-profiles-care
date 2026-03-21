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

interface Proposal {
  id: number;
  service_id: number;
  service_title: string;
  status: string;
  proposed_value: number;
  created_at: string;
  contractor_name?: string;
}

export default function MinhasPropostas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchProposals();
  }, [user?.id]);

  const fetchProposals = async () => {
    try {
      const response = await api.get('/api/service-proposals/my-proposals');
      setProposals(response.data);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar propostas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aceita': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">✅ Aceita</Badge>;
      case 'recusada': return <Badge variant="destructive">❌ Recusada</Badge>;
      default: return <Badge variant="secondary">⏳ Pendente</Badge>;
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
                <h1 className="text-2xl font-bold">Minhas Propostas</h1>
                <p className="text-muted-foreground">{proposals.length} propostas enviadas</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : proposals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhuma proposta enviada</p>
                    <Button onClick={() => navigate('/dashboard/profissional/servicos-disponiveis')}>Ver serviços abertos</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {proposals.map((proposal) => (
                    <Card key={proposal.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{proposal.service_title}</CardTitle>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Valor: R$ {proposal.proposed_value?.toFixed(2)}</span>
                          <span>{new Date(proposal.created_at).toLocaleDateString('pt-BR')}</span>
                          {proposal.contractor_name && <span>Contratante: {proposal.contractor_name}</span>}
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
