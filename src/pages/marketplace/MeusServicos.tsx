import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { NotificationBell } from '@/components/marketplace/NotificationBell';
import { Plus, ClipboardList, Clock, CheckCircle, FileText } from 'lucide-react';

export default function MeusServicos() {
  const { user } = useAuth();
  const { services } = useMarketplace();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const myServices = services.filter(s => s.contractorId === user.id);
  const open = myServices.filter(s => ['aberto', 'recebendo_propostas', 'em_negociacao'].includes(s.status));
  const inProgress = myServices.filter(s => ['profissional_selecionado', 'em_andamento'].includes(s.status));
  const completed = myServices.filter(s => s.status === 'concluido');

  const renderList = (list: typeof myServices, emptyMsg: string) => (
    list.length === 0 ? (
      <div className="text-center py-12">
        <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">{emptyMsg}</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {list.map(s => (
          <ServiceCard
            key={s.id}
            service={s}
            onViewDetails={() => navigate(`/dashboard/contratante/meus-servicos/${s.id}`)}
          />
        ))}
      </div>
    )
  );

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Meus Serviços</h1>
              <p className="text-muted-foreground text-sm">Gerencie os serviços que você publicou</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Button onClick={() => navigate('/dashboard/contratante/postar-servico')} className="gradient-highlight border-0">
                <Plus className="w-4 h-4 mr-2" /> Publicar Serviço
              </Button>
            </div>
          </div>

          <Tabs defaultValue="open">
            <TabsList className="mb-6">
              <TabsTrigger value="open">
                <ClipboardList className="w-4 h-4 mr-2" /> Abertos ({open.length})
              </TabsTrigger>
              <TabsTrigger value="inprogress">
                <Clock className="w-4 h-4 mr-2" /> Em Andamento ({inProgress.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-2" /> Concluídos ({completed.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open">
              {renderList(open, 'Nenhum serviço aberto. Publique um novo serviço!')}
            </TabsContent>
            <TabsContent value="inprogress">
              {renderList(inProgress, 'Nenhum serviço em andamento')}
            </TabsContent>
            <TabsContent value="completed">
              {renderList(completed, 'Nenhum serviço concluído ainda')}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
