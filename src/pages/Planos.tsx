import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

type Plan = {
  id: number;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  features?: Record<string, any>;
};

const fetchPlans = async (): Promise<Plan[]> => {
  const res = await axios.get('/api/payments/plans');
  return res.data;
};

export default function Planos() {
  const { user } = useAuth();
  const { data: plans = [], isLoading } = useQuery({ queryKey: ['plans'], queryFn: fetchPlans });

  const createPref = useMutation({
    mutationFn: async (vars: { userId: string; planId: number }) => {
      const res = await axios.post('/api/mercadopago/create_preference', vars);
      return res.data;
    },
  });

  if (isLoading) return <div>Carregando planos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Planos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p: Plan) => (
          <div key={p.id} className="border rounded p-4">
            <h2 className="font-bold">{p.name}</h2>
            <p>Preço: {p.price} {p.currency}</p>
            <p>Duração: {p.duration_days} dias</p>
            <button
              className="mt-2 btn"
              onClick={async () => {
                if (!user) return alert('Faça login para assinar um plano.');
                try {
                  const result = await createPref.mutateAsync({ userId: user.id, planId: p.id });
                  // redireciona para init_point (sandbox ou produção)
                  // resultado pode ter estrutura diversa; tentamos alguns caminhos
                  const url = (result && (result.init_point || result.sandbox_init_point)) || (result?.preference?.response?.init_point);
                  if (url) window.location.href = url;
                  else alert('Erro ao criar preferência de pagamento.');
                } catch (err) {
                  alert('Erro ao iniciar checkout: ' + JSON.stringify(err));
                }
              }}
            >
              Assinar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
