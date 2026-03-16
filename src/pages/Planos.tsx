import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Check, Sparkles, Crown, Heart, Users } from 'lucide-react';

type Plan = {
  id: number;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  slug: string;
  features?: Record<string, unknown>;
};

const PLAN_SLUGS = {
  contratante: 'contratante',
  base: 'basico',
  profissional: 'profissional',
  premium: 'empresa'
};

export function getRequiredPlan(plans: Plan[], role: string) {
  const map: Record<string, string> = {
    contratante: 'family_monthly',
    base: 'basico',
    profissional: 'profissional',
    premium: 'empresa'
  };

  return plans.find(p => p.slug === map[role]);
}

const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const res = await api.get('/api/payments/plans');
    // Ensure we always return an array
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};

export default function Planos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: plansData, isLoading } = useQuery({ queryKey: ['plans'], queryFn: fetchPlans });

  // Ref to track if auto-checkout was attempted (to prevent infinite loops)
  const autoCheckoutAttempted = React.useRef(false);

  // Get selected plan from URL (after login)
  const selectedPlanParam = searchParams.get('plan') as 'base' | 'profissional' | 'premium' | 'contratante' | null;

  // Ensure plans is always an array
  const plans = Array.isArray(plansData) ? plansData : [];

  const createPref = useMutation({
    mutationFn: async (vars: { userId: string; planId: number }) => {
      const res = await api.post('/api/mercadopago/create_preference', vars);
      return res.data;
    },
  });

  // Ensure plans is always an array
  const plansList = Array.isArray(plans) ? plans : [];

  // Debug: log plans to console
  console.log('Planos retornados da API:', plansList);

// Find plans from database by slug (novos planos Kuidd+)
  const basePlan = plansList.find((p: Plan) => p.slug === 'basico');
  const profissionalPlan = plansList.find((p: Plan) => p.slug === 'profissional');
  const premiumPlan = plansList.find((p: Plan) => p.slug === 'empresa');
  const contratantePlanApi = plansList.find((p: Plan) => p.slug === PLAN_SLUGS.contratante);

  // log contratante plan for debugging
  console.log('contratantePlanApi:', contratantePlanApi);

  // Fallback display plan (used only for showing the card when API doesn't provide one)
  const contratantePlanDisplay: Plan = contratantePlanApi || {
    id: -1,
    name: 'Plano Contratante',
    price: 29.9,
    currency: 'BRL',
    duration_days: 30,
    slug: 'family_monthly',
  };

  // Check if user is a professional (incluindo novos tipos)
  const isProfessional = user && ['cuidador', 'acompanhante', 'enfermeiro', 'tecnico', 'psicologo', 'fonoaudiologo', 'fisioterapeuta', 'nutricionista', 'terapeuta'].includes(user.role);
  const isContratante = user && user.role === 'contratante';
  const buttonText = user ? 'Assinar Agora' : 'Fazer Login para Assinar';

  const handleContratanteClick = async () => {
    if (!user) {
      navigate('/login?redirect=/planos');
      return;
    }
    // Only attempt checkout when API returned a real plan
    if (!contratantePlanApi) {
      // Plan not available in API - guide user to contratante signup or show message
      alert('Plano de contratante ainda não disponível para compra. Você pode criar uma conta de contratante.');
      navigate('/cadastro-contratante');
      return;
    }
    try {
      console.log('Starting contratante checkout, plan id:', contratantePlanApi?.id);
      const result = await createPref.mutateAsync({ userId: user.id, planId: contratantePlanApi.id });
      const url = (result && (result.init_point || result.sandbox_init_point)) || (result?.preference?.response?.init_point);
      if (url) window.location.href = url;
      else alert('Erro ao criar preferência para contratante.');
    } catch (err) {
      alert('Erro ao iniciar checkout: ' + JSON.stringify(err));
    }
  };

  const handlePlanClick = async (planType: 'base' | 'profissional' | 'premium' | 'contratante') => {
    if (!user) {
      navigate(`/login?redirect=/planos&plan=${planType}`);
      return;
    }

    let plan;
    if (planType === 'base') plan = basePlan;
    else if (planType === 'profissional') plan = profissionalPlan;
    else if (planType === 'premium') plan = premiumPlan;
    else plan = contratantePlanApi;

    if (!plan) {
      alert('Plano não encontrado. Por favor, tente novamente.');
      return;
    }

    try {
      console.log('Starting checkout for plan id:', plan?.id);
      const result = await createPref.mutateAsync({ userId: user.id, planId: plan.id });
      const url = (result && (result.init_point || result.sandbox_init_point)) || (result?.preference?.response?.init_point);
      if (url) window.location.href = url;
      else alert('Erro ao criar preferência de pagamento.');
    } catch (err) {
      alert('Erro ao iniciar checkout: ' + JSON.stringify(err));
    }
  };

  // Auto-start checkout when user is logged in and has a selected plan from URL
  // This runs after all hooks and functions are defined, but before early return
  const executeAutoCheckout = () => {
    if (user && selectedPlanParam && !isLoading && !autoCheckoutAttempted.current) {
      autoCheckoutAttempted.current = true;
      // Find the plan based on the parameter
      let plan;
      if (selectedPlanParam === 'base') plan = basePlan;
      else if (selectedPlanParam === 'profissional') plan = profissionalPlan;
      else if (selectedPlanParam === 'premium') plan = premiumPlan;
      else if (selectedPlanParam === 'contratante') plan = contratantePlanApi;

      if (plan) {
        // Clean URL first
        navigate('/planos', { replace: true });
        // Then start checkout
        handlePlanClick(selectedPlanParam);
        return true;
      }
    }
    return false;
  };

  // Try auto checkout BEFORE early return
  if (executeAutoCheckout()) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Iniciando checkout...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Blindagem obrigatória - verificar se planos obrigatórios existem
  if (!basePlan || !profissionalPlan || !premiumPlan) {
    console.error('Planos obrigatórios não encontrados', plans);
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
          </div>
        </div>
      </Layout>
    );
  }

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
              NOSSOS PLANOS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Escolha o plano ideal para <span className="text-gradient-highlight">você</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Planos para profissionais e familiares. Todos começam com 7 dias de acesso completo grátis!
            </p>
          </div>

<div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* PLANO BASE */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">PLANO BASE</h3>
                  <p className="text-muted-foreground text-sm">Perfil ativo + calendário + feedbacks</p>
                </div>
                <div className="text-center mb-6">
                  <div className="bg-primary/5 rounded-lg p-3 mb-3">
                    <span className="text-sm text-primary font-medium">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-3xl font-bold text-gradient-highlight">
                    {basePlan ? `R$ ${Number(basePlan.price).toFixed(2).replace('.', ',')}` : 'R$ 49,00'}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Perfil ativo na plataforma',
                    'Calendário de disponibilidade',
                    'Sistema de feedbacks',
                    'Estatísticas de visualização',
                    'Suporte básico',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => isProfessional ? handlePlanClick('base') : navigate('/cadastro?plano=base')}
                >
                  {isProfessional && <Crown className="mr-2 h-4 w-4" />}
                  {isProfessional ? buttonText : 'Começar 7 dias grátis'}
                </Button>
              </CardContent>
            </Card>

            {/* PLANO PROFISSIONAL */}
            <Card className="relative overflow-hidden border-2 border-primary shadow-highlight">
              <div className="absolute top-0 right-0 px-4 py-1 gradient-highlight text-white text-xs font-medium rounded-bl-lg">
                MAIS POPULAR
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">PLANO PROFISSIONAL</h3>
                  <p className="text-muted-foreground text-sm">Tudo do Base + Destaque + Verificado</p>
                </div>
                <div className="text-center mb-6">
                  <div className="bg-primary/5 rounded-lg p-3 mb-3">
                    <span className="text-sm text-primary font-medium">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-3xl font-bold text-gradient-highlight">
                    {profissionalPlan ? `R$ ${Number(profissionalPlan.price).toFixed(2).replace('.', ',')}` : 'R$ 99,00'}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Tudo do plano Base',
                    'Destaque nas buscas',
                    'Selo de profissional verificado',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Prioridade no ranking',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => isProfessional ? handlePlanClick('profissional') : navigate('/cadastro?plano=profissional')}
                  disabled={isProfessional && !profissionalPlan}
                >
                  {isProfessional ? <Crown className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isProfessional ? buttonText : 'Começar 7 dias grátis'}
                </Button>
              </CardContent>
            </Card>

            {/* PLANO PREMIUM */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 px-4 py-1 bg-amber-500 text-white text-xs font-medium rounded-bl-lg">
                TOPO
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">PLANO PREMIUM</h3>
                  <p className="text-muted-foreground text-sm">Tudo + Topo + Especialista</p>
                </div>
                <div className="text-center mb-6">
                  <div className="bg-primary/5 rounded-lg p-3 mb-3">
                    <span className="text-sm text-primary font-medium">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-3xl font-bold text-gradient-highlight">
                    {premiumPlan ? `R$ ${Number(premiumPlan.price).toFixed(2).replace('.', ',')}` : 'R$ 179,00'}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Tudo do plano Profissional',
                    'Aparece no topo das buscas',
                    'Badge de especialista',
                    'Exclusividade total',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 border-0"
                  onClick={() => isProfessional ? handlePlanClick('premium') : navigate('/cadastro?plano=premium')}
                  disabled={isProfessional && !premiumPlan}
                >
                  {isProfessional ? <Crown className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isProfessional ? buttonText : 'Começar 7 dias grátis'}
                </Button>
              </CardContent>
            </Card>



            {/* Contratante / Familiar Plan (third column) */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-xs font-medium rounded-bl-lg">PARA FAMÍLIAS</div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Contratante (Familiar)</h3>
                  <p className="text-muted-foreground text-sm">Para famílias que buscam cuidadores</p>
                </div>
                <div className="text-center mb-6">
                  <div className="bg-primary/5 rounded-lg p-3 mb-3">
                    <span className="text-sm text-primary font-medium">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-3xl font-bold text-family">
                    {`R$ ${Number(contratantePlanDisplay.price).toFixed(2).replace('.', ',')}`}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                  <p className="text-xs text-muted-foreground mt-1">Renovação automática mensal</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Acesso a todos os perfis',
                    'Contato direto via WhatsApp',
                    'Visualizar vídeos de apresentação',
                    'Ver certificados e diplomas',
                    'Filtros avançados de busca',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary gradient-highlight border-0"
                  onClick={() => {
                    // If API has the plan, try checkout (handles login internally). Otherwise guide to contratante signup.
                    if (contratantePlanApi) {
                      handleContratanteClick();
                    } else {
                      // if user is not logged, redirect to login so they can sign up as contratante
                      if (!user) navigate('/cadastro-contratante');
                      else navigate('/cadastro-contratante');
                    }
                  }}
                  data-testid="contratante-plan-button"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isContratante && contratantePlanApi ? buttonText : 'Começar 7 dias grátis'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-muted-foreground text-sm mb-16">
            ✨ Todos os planos incluem 7 dias de trial grátis. Após o período, a cobrança é feita automaticamente.
          </p>
        </div>
      </section>
    </Layout>
  );
}
