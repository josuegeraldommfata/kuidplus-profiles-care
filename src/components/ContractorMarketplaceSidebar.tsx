import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  FileText,
  ClipboardList,
  CheckCircle,
  History,
  MessagesSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Counts {
  services_open: number;
  proposals_received: number;
  accepted: number;
}

export default function ContractorMarketplaceSidebar({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts>({ services_open: 0, proposals_received: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get('/api/services/my-counts');
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
      path: '/dashboard/contratante/postar-servico',
      icon: Plus,
      label: 'Postar Serviço',
      badge: null,
    },
    {
      path: '/dashboard/contratante/meus-servicos',
      icon: ClipboardList,
      label: 'Meus Serviços',
      badge: counts.services_open > 0 ? counts.services_open.toString() : null,
    },
    {
      path: '/dashboard/contratante/propostas-recebidas',
      icon: FileText,
      label: 'Propostas Recebidas',
      badge: counts.proposals_received > 0 ? counts.proposals_received.toString() : null,
    },
    {
      path: '/dashboard/contratante/servicos-contratados',
      icon: CheckCircle,
      label: 'Contratados',
      badge: counts.accepted > 0 ? counts.accepted.toString() : null,
    },
    {
      path: '/dashboard/contratante/historico',
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
  ];

  return (
    <Card className={`lg:w-64 lg:min-w-[260px] ${className}`}>
      <CardContent className="p-0 h-full flex flex-col">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg mb-2">Marketplace</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie seus serviços e propostas
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
      </CardContent>
    </Card>
  );
}

