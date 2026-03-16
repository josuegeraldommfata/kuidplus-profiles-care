import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { NOTIFICATION_TYPE_LABELS } from '@/types/marketplace';

export function NotificationBell() {
  const { notifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } = useMarketplace();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = getUnreadCount();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={markAllNotificationsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">Nenhuma notificação</p>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <button
                key={n.id}
                className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.linkTo) navigate(n.linkTo);
                  setOpen(false);
                }}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">
                      {NOTIFICATION_TYPE_LABELS[n.type]}
                    </Badge>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
