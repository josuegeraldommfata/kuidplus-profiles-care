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
  service_id: number;
  service_title: string;
  status: string;
  proposed_value: number;
  created_at: string;
  contractor_name?: string;
  professional_name?: string;
}

export default function MinhasPropostas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    if (user?.id) {
      fetchProposals();
    }
  }, [user?.id, roleFilter]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const endpoint = roleFilter === 'sent'
        ? `/api/service-proposals/my-proposals`  // Suas propostas enviadas
        : `/api/service-proposals`; // Propostas recebidas

      const response = await api.get(endpoint);
      setProposals(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar propostas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aceita':
        return <Badge variant="default">✅ Aceita</Badge>;
      case 'recusada':
        return <Badge variant="destructive">❌ Recusada</Badge>;
      case 'pendente':
      default:
        return <Badge variant="secondary">⏳ Pendente</Badge>;
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
            <h1 className="text-3xl font-bold">Minhas Propostas</h1>
            <p className="text-muted-foreground mt-2">
              {roleFilter === 'sent' ? 'Propostas que você enviou' : 'Propostas recebidas'}
              ({proposals.length})
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={roleFilter === 'sent' ? 'default' : 'outline'}
              onClick={() => setRoleFilter('sent')}
            >
              Enviadas
            </Button>
            <Button
              variant={roleFilter === 'received' ? 'default' : 'outline'}
              onClick={() => setRoleFilter('received')}
            >
              Recebidas
            </Button>
          </div>
        </div>

        {proposals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-2xl text-muted-foreground mb-4">
                Nenhuma proposta encontrada
              </p>
              <Button onClick={() => navigate('/dashboard/profissional/marketplace')}>
                Ver serviços abertos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{proposal.service_title}</CardTitle>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Valor proposto: R$ {proposal.proposed_value?.toFixed(2)}</span>
                    <span>Enviada em: {new Date(proposal.created_at).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm">
                    {proposal.contractor_name && (
                      <span>Contratante: {proposal.contractor_name}</span>
                    )}
                    {proposal.professional_name && (
                      <span>Profissional: {proposal.professional_name}</span>
                    )}
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

