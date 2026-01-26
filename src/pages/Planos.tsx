import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Check, Sparkles, Crown } from 'lucide-react';

type Plan = {
  id: number;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  features?: Record<string, unknown>;
};

const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const res = await axios.get('/api/payments/plans');
    // Ensure we always return an array
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};

export default function Planos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plansData, isLoading } = useQuery({ queryKey: ['plans'], queryFn: fetchPlans });

  // Ensure plans is always an array
  const plans = Array.isArray(plansData) ? plansData : [];

  const createPref = useMutation({
    mutationFn: async (vars: { userId: string; planId: number }) => {
      const res = await axios.post('/api/mercadopago/create_preference', vars);
      return res.data;
    },
  });

  // Ensure plans is always an array
  const plansList = Array.isArray(plans) ? plans : [];

  // Find monthly and trimestral plans from database
  const monthlyPlan = plansList.find((p: Plan) =>
    p.name.toLowerCase().includes('mensal') || p.duration_days === 30
  );
  const trimestralPlan = plansList.find((p: Plan) =>
    p.name.toLowerCase().includes('trimestral') || p.duration_days === 90
  );

  // Check if user is a professional
  const isProfessional = user && ['cuidador', 'acompanhante', 'enfermeiro', 'tecnico'].includes(user.role);
  const buttonText = user ? 'Assinar Agora' : 'Fazer Login para Assinar';

  const handlePlanClick = async (planType: 'mensal' | 'anual') => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=/planos');
      return;
    }

    const plan = planType === 'mensal' ? monthlyPlan : trimestralPlan;
    if (!plan) {
      alert('Plano não encontrado. Por favor, tente novamente.');
      return;
    }

    try {
      const result = await createPref.mutateAsync({ userId: user.id, planId: plan.id });
      const url = (result && (result.init_point || result.sandbox_init_point)) || (result?.preference?.response?.init_point);
      if (url) window.location.href = url;
      else alert('Erro ao criar preferência de pagamento.');
    } catch (err) {
      alert('Erro ao iniciar checkout: ' + JSON.stringify(err));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando planos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-highlight text-white text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              PLANOS PARA PROFISSIONAIS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Destaque seu perfil e <span className="text-gradient-highlight">conquiste mais clientes</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Todos os profissionais começam com 7 dias de acesso completo grátis.
              Após o período de trial, escolha o plano ideal para continuar em destaque.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Plano Mensal</h3>
                  <p className="text-muted-foreground text-sm">Flexibilidade total</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gradient-highlight">
                    {monthlyPlan ? `R$ ${monthlyPlan.price.toFixed(2).replace('.', ',')}` : 'R$ 39,90'}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Estatísticas de visualização',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => handlePlanClick('mensal')}
                  disabled={!monthlyPlan}
                >
                  {isProfessional && <Crown className="mr-2 h-4 w-4" />}
                  {buttonText}
                </Button>
              </CardContent>
            </Card>

            {/* Trimestral Plan */}
            <Card className="relative overflow-hidden border-2 border-primary shadow-highlight">
              <div className="absolute top-0 right-0 px-4 py-1 gradient-highlight text-white text-xs font-medium rounded-bl-lg">
                MAIS ECONOMIA
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Plano Trimestral</h3>
                  <p className="text-muted-foreground text-sm">Melhor custo-benefício</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gradient-highlight">
                    {trimestralPlan ? `R$ ${trimestralPlan.price.toFixed(2).replace('.', ',')}` : 'R$ 99,90'}
                  </span>
                  <span className="text-muted-foreground">/trimestre</span>
                  {trimestralPlan && (
                    <p className="text-sm text-primary font-medium mt-1">Economia de R$ 19,80</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Tudo do plano mensal',
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Prioridade máxima no ranking',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => handlePlanClick('anual')}
                  disabled={!trimestralPlan}
                >
                  {isProfessional ? <Crown className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {buttonText}
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            ✨ Todos os planos incluem 7 dias de trial grátis. Após o período, assine para continuar com acesso completo.
          </p>
        </div>
      </section>
    </Layout>
  );
}
