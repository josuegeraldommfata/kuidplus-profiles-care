import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'proposal' | 'message' | 'accepted' | 'payment' | 'review';
  read: boolean;
  created_at: string;
  data: any;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Poll every 30s or use Socket.IO
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get('/api/notifications', { params: { limit: 10 } });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(nots => nots.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como lida",
        variant: "destructive",
      });
    }
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await api.patch('/api/notifications/read-all');
      setUnreadCount(0);
      setNotifications(nots => nots.map(n => ({ ...n, read: true })));
      toast({ title: "Todas notificações marcadas como lidas!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas como lidas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: Notification['type']) => {
    const icons: Record<string, React.ReactNode> = {
      proposal: '📨',
      message: '💬',
      accepted: '✅',
      payment: '💰',
      review: '⭐',
    };
    return icons[type] || '🔔';
  };

  const getColor = (type: Notification['type']) => {
    const colors: Record<string, string> = {
      proposal: 'default',
      message: 'secondary',
      accepted: 'success',
      payment: 'accent',
      review: 'outline',
    };
    return colors[type] || 'default';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 p-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="h-5 w-5 p-0 text-xs absolute -top-1 -right-1 rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[500px] p-0">
        <div className="p-2 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                disabled={loading}
                className="h-6 px-2 text-xs"
              >
                Marcar todas lidas
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
          {notifications.length === 0 ? (
            <DropdownMenuItem className="justify-center text-muted-foreground text-sm">
              Nenhuma notificação
            </DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer flex gap-3 p-3 hover:bg-accent"
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-destructive ml-2" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

