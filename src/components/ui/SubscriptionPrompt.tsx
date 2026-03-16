import React, { useEffect, useState } from 'react';
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

export function SubscriptionPrompt() {
  const { user, checkSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const [showPrompt, setShowPrompt] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);

  // Determina qual plano o usuário deve ver baseado no role
  const getPlanType = () => {
    if (!user) return 'contratante';

    // Se é contratante, vai para plano contratante
    if (user.role === 'contratante') return 'contratante';

    // Se é profissional, vai para profissional (plano pago)
    return 'profissional';
  };

  useEffect(() => {
    if (!user || !checkSubscriptionStatus) {
      setShowPrompt(false);
      setStatus(null);
      return;
    }

    const result = checkSubscriptionStatus();
    if (!result) {
      setShowPrompt(false);
      setStatus(null);
      return;
    }

    setStatus(result);
    setShowPrompt(result.needsUpgrade === true);
  }, [user, checkSubscriptionStatus]);

  if (!showPrompt || !status) return null;

  const { daysLeft, planRequired } = status;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">
            {daysLeft <= 0
              ? 'Período Gratuito Expirou'
              : 'Período Gratuito Acabando'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {daysLeft > 0 && (
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {daysLeft} dia{daysLeft !== 1 ? 's' : ''} restante
                {daysLeft !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <p className="text-gray-600">
            {daysLeft <= 0
              ? 'Seu período gratuito terminou. Para continuar usando a plataforma, assine um plano.'
              : 'Seu período gratuito está acabando. Assine um plano para continuar usando todos os recursos.'}
          </p>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
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
              onClick={() => setShowPrompt(false)}
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
