import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { SendProposalDialog } from '@/components/marketplace/SendProposalDialog';
import { NotificationBell } from '@/components/marketplace/NotificationBell';
import { Service } from '@/types/marketplace';
import { Search, Filter, Briefcase } from 'lucide-react';

export default function ServicosDisponiveis() {
  const { user } = useAuth();
  const { getAvailableServices } = useMarketplace();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterProfession, setFilterProfession] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);

  const services = getAvailableServices();

  const filteredServices = services.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchProfession = !filterProfession || s.professionType === filterProfession;
    return matchSearch && matchProfession;
  });

  const professions = ['Enfermeiro(a)', 'Técnico(a) de Enfermagem', 'Cuidador(a)', 'Fisioterapeuta'];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Serviços Disponíveis
              </h1>
              <p className="text-muted-foreground text-sm">
                Encontre serviços e envie sua proposta
              </p>
            </div>
            <NotificationBell />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou cidade..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterProfession === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterProfession('')}
              >
                <Filter className="w-3 h-3 mr-1" /> Todos
              </Button>
              {professions.map(p => (
                <Button
                  key={p}
                  variant={filterProfession === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterProfession(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{filteredServices.length} serviço(s)</Badge>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum serviço disponível no momento</p>
              <p className="text-sm text-muted-foreground">Novos serviços aparecerão aqui quando publicados</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map(s => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  showProposalButton
                  onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}
                  onSendProposal={() => {
                    setSelectedService(s);
                    setProposalDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          <SendProposalDialog
            service={selectedService}
            open={proposalDialogOpen}
            onOpenChange={setProposalDialogOpen}
          />
        </div>
      </div>
    </Layout>
  );
}
