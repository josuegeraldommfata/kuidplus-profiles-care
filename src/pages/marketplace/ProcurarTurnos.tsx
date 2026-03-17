import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface Service {
  id: number;
  title: string;
  description: string;
  profession: string;
  city: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  contractor_name: string;
  proposals_count: number;
  created_at: string;
}

export default function ProcurarTurnos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    profession: '',
    budgetMax: 500,
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [proposalData, setProposalData] = useState({
    amount: '',
    message: '',
  });
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/services/open', { params: filters });
      setServices(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar serviços',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openProposalModal = (service: Service) => {
    setSelectedService(service);
    setProposalData({ amount: '', message: '' });
    setProposalOpen(true);
  };

  const submitProposal = async () => {
    if (!selectedService || !proposalData.amount || !proposalData.message) return;

    try {
      await api.post('/api/service-proposals', {
        service_id: selectedService.id,
        amount: Number(proposalData.amount),
        message: proposalData.message,
      });

      toast({
        title: 'Proposta enviada!',
        description: `R$ ${proposalData.amount} para ${selectedService.title}`,
      });

      setProposalOpen(false);
      fetchServices();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar proposta',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando turnos disponíveis...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Procurar Turnos</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Serviços abertos para profissionais - envie sua proposta
          </p>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-6">
            <Input
              placeholder="Cidade"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
            />
            <Input
              placeholder="Profissão"
              value={filters.profession}
              onChange={(e) => setFilters({...filters, profession: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Orçamento máx (R$)"
              value={filters.budgetMax}
              onChange={(e) => setFilters({...filters, budgetMax: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className="mr-2">{service.profession}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {service.proposals_count} propostas
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  📍 {service.city}
                  <span>•</span>
                  {new Date(service.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-6">
                <p className="text-sm line-clamp-3 text-muted-foreground h-16">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">
                      R$ {service.budget_min.toFixed(0)} - {service.budget_max.toFixed(0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Orçamento</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      Prazo: {service.deadline}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => openProposalModal(service)}
                >
                  Enviar Proposta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal Proposta */}
        <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar Proposta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Serviço</Label>
                <p className="font-medium">{selectedService?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedService?.contractor_name} • {selectedService?.city}
                </p>
              </div>

              <div>
                <Label>Seu Valor (R$)</Label>
                <Input
                  type="number"
                  value={proposalData.amount}
                  onChange={(e) => setProposalData({...proposalData, amount: e.target.value})}
                  placeholder="150"
                />
              </div>

              <div>
                <Label>Mensagem (opcional)</Label>
                <Textarea
                  value={proposalData.message}
                  onChange={(e) => setProposalData({...proposalData, message: e.target.value})}
                  placeholder="Olá! Tenho disponibilidade e experiência em..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setProposalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={submitProposal}>
                  Enviar Proposta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

