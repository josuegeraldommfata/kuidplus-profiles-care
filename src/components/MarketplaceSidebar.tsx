import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Search,
  FileText,
  CheckCircle,
  History,
  MessagesSquare,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface ProposalCount {
  proposals_sent: number;
  proposals_received: number;
  accepted: number;
}

export default function MarketplaceSidebar({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [counts, setCounts] = useState<ProposalCount>({ proposals_sent: 0, proposals_received: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get('/api/proposals/my-counts');
      setCounts(response.data);
    } catch (error) {
      console.error('Erro ao carregar contadores');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => location.pathname.includes(path);

  const menuItems = [
    {
      path: '/dashboard/profissional/procurar-turnos',
      icon: Search,
      label: 'Procurar Turnos',
      badge: null,
    },
    {
      path: '/dashboard/profissional/minhas-propostas',
      icon: FileText,
      label: 'Minhas Propostas',
      badge: counts.proposals_sent > 0 ? counts.proposals_sent.toString() : null,
    },
    {
      path: '/dashboard/profissional/servicos-aceitos',
      icon: CheckCircle,
      label: 'Aceitos',
      badge: counts.accepted > 0 ? counts.accepted.toString() : null,
    },
    {
      path: '/dashboard/profissional/historico',
      icon: History,
      label: 'Histórico',
      badge: null,
    },
    {
      path: '/dashboard/mensagens',
      icon: MessagesSquare,
      label: 'Mensagens',
      badge: null,
    },
    {
      path: '/dashboard/profissional/agenda',
      icon: Calendar,
      label: 'Agenda',
      badge: null,
    },
  ];

  return (
    <Card className={`lg:w-64 lg:min-w-[260px] ${className}`}>
      <CardContent className="p-0 h-full flex flex-col">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg mb-2">Marketplace</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie seus turnos e propostas
          </p>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-auto">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className="w-full justify-start h-12 p-3 gap-3 text-left hover:bg-accent"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto text-xs h-5 px-2">{item.badge}</Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="p-4 border-t bg-muted/50">
          <Button className="w-full gradient-primary">
            <DollarSign className="w-4 h-4 mr-2" />
            Receber Pagamentos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

