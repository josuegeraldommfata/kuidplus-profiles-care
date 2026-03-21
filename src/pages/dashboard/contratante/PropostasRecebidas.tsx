import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import ContractorMarketplaceSidebar from '@/components/ContractorMarketplaceSidebar';
import { MessageCircle, CheckCircle, XCircle, User } from 'lucide-react';
import { getFileUrl } from '@/lib/utils';

interface Proposal {
  id: number;
  service_title: string;
  professional_name: string;
  professional_image?: string;
  professional_id?: number;
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
    if (user?.id) fetchProposals();
  }, [user?.id]);

  const fetchProposals = async () => {
    try {
      const response = await api.get('/api/service-proposals');
      setProposals(response.data);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar propostas recebidas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const acceptProposal = async (proposalId: number) => {
    try {
      await api.post(`/api/service-proposals/${proposalId}/accept`);
      toast({ title: 'Sucesso', description: 'Proposta aceita! Uma conversa foi iniciada.' });
      fetchProposals();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao aceitar proposta', variant: 'destructive' });
    }
  };

  const rejectProposal = async (proposalId: number) => {
    try {
      await api.post(`/api/service-proposals/${proposalId}/reject`);
      toast({ title: 'Sucesso', description: 'Proposta rejeitada' });
      fetchProposals();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao rejeitar proposta', variant: 'destructive' });
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
            <ContractorMarketplaceSidebar />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Propostas Recebidas</h1>
                  <p className="text-muted-foreground">{proposals.length} propostas</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : proposals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">Nenhuma proposta recebida ainda</p>
                    <Button onClick={() => navigate('/dashboard/contratante/meus-servicos')}>Ver meus serviços</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <Card key={proposal.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {proposal.professional_image ? (
                                <img src={getFileUrl(proposal.professional_image)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                              ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{proposal.service_title}</CardTitle>
                              <p className="text-sm text-muted-foreground">por {proposal.professional_name}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-bold text-lg text-primary">R$ {proposal.proposed_value?.toFixed(2)}</div>
                            {getStatusBadge(proposal.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {proposal.message && (
                          <p className="text-sm text-muted-foreground mb-3 bg-muted/50 p-3 rounded-lg">"{proposal.message}"</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(proposal.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {proposal.status?.toLowerCase() === 'pendente' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => acceptProposal(proposal.id)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Aceitar
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => rejectProposal(proposal.id)}>
                                <XCircle className="w-4 h-4 mr-1" /> Recusar
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/chat?proposalId=${proposal.id}`)}>
                                <MessageCircle className="w-4 h-4 mr-1" /> Chat
                              </Button>
                            </div>
                          )}
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
