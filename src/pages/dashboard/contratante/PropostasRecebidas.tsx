import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Proposal {
  id: number;
  service_title: string;
  professional_name: string;
  status: string;
  proposed_value: number;
  message: string;
  created_at: string;
}

export default function PropostasRecebidas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProposals();
    }
  }, [user?.id]);

  const fetchProposals = async () => {
    try {
      const response = await api.get('/api/service-proposals');
      setProposals(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar propostas recebidas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptProposal = async (proposalId: number) => {
    try {
      await api.post(`/api/service-proposals/${proposalId}/accept`);
      toast({
        title: 'Sucesso',
        description: 'Proposta aceita!',
      });
      fetchProposals();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao aceitar proposta',
        variant: 'destructive',
      });
    }
  };

  const rejectProposal = async (proposalId: number) => {
    try {
      await api.post(`/api/service-proposals/${proposalId}/reject`);
      toast({
        title: 'Sucesso',
        description: 'Proposta rejeitada',
      });
      fetchProposals();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao rejeitar proposta',
        variant: 'destructive',
      });
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
          <h1 className="text-3xl font-bold">Propostas Recebidas</h1>
          <Badge>{proposals.length} propostas</Badge>
        </div>

        {proposals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-2xl text-muted-foreground mb-4">Nenhuma proposta recebida</p>
              <Button onClick={() => navigate('/dashboard/contratante/meus-servicos')}>
                Ver meus serviços
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{proposal.service_title}</CardTitle>
                      <p className="text-muted-foreground">{proposal.message?.substring(0, 100)}...</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">R$ {proposal.proposed_value.toFixed(2)}</div>
                      <Badge variant="secondary">{proposal.created_at}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => acceptProposal(proposal.id)}
                      size="sm"
                    >
                      Aceitar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rejectProposal(proposal.id)}
                      size="sm"
                    >
                      Rejeitar
                    </Button>
                    <Button variant="ghost" size="sm">
                      Mensagem
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

