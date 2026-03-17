import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SubscriptionStatus = {
  needsUpgrade: boolean;
  daysLeft: number;
  planRequired: string;
};

const DISMISS_KEY = 'kuid_subscription_dismissed_at';
const DISMISS_COOLDOWN_HOURS = 24; // Só mostra novamente após 24h do dismiss

export function SubscriptionPrompt() {
  const { user, checkSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const [showPrompt, setShowPrompt] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);

  const getPlanType = () => {
    if (!user) return 'contratante';
    if (user.role === 'contratante') return 'contratante';
    return 'profissional';
  };

  const wasDismissedRecently = useCallback(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) return false;

    const dismissedTime = new Date(dismissedAt).getTime();
    const now = Date.now();
    const hoursSinceDismiss = (now - dismissedTime) / (1000 * 60 * 60);

    return hoursSinceDismiss < DISMISS_COOLDOWN_HOURS;
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setShowPrompt(false);
  };

  useEffect(() => {
    if (!user || !checkSubscriptionStatus) {
      setShowPrompt(false);
      setStatus(null);
      return;
    }

    const result = checkSubscriptionStatus();
    if (!result || !result.needsUpgrade) {
      setShowPrompt(false);
      setStatus(null);
      return;
    }

    // Se o usuário fechou recentemente, não mostra de novo
    if (wasDismissedRecently()) {
      setStatus(result);
      setShowPrompt(false);
      return;
    }

    setStatus(result);
    setShowPrompt(true);
  }, [user, checkSubscriptionStatus, wasDismissedRecently]);

  if (!showPrompt || !status) return null;

  const { daysLeft, planRequired } = status;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">
            Período Gratuito Expirou
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu período gratuito de 7 dias terminou. Para continuar usando a plataforma, assine um plano.
          </p>

          <div className="bg-accent p-3 rounded-lg">
            <p className="text-sm text-accent-foreground font-medium">
              Plano necessário:{' '}
              <span className="font-bold">{planRequired}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/planos?plan=${getPlanType()}`)}
              className="flex-1"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar Agora
            </Button>

            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubscriptionPrompt;
