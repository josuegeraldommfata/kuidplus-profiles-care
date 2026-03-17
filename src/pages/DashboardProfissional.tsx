import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/DashboardStats';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardProfissional() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <MarketplaceSidebar />

            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gradient-highlight">
                  Olá, <span className="text-primary">{user?.name}</span>!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Dashboard do Profissional - Serviços, Agenda e Propostas
                </p>
              </div>

              <DashboardStats type="professional" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all group" onClick={() => navigate('/dashboard/profissional/marketplace')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl flex items-center gap-3 group-hover:text-primary transition-colors">
                      Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Veja serviços disponíveis e envie propostas
                    </p>
                    <Button className="w-full" variant="outline" size="sm">
                      Ver serviços abertos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all group" onClick={() => navigate('/dashboard/profissional/agenda')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl flex items-center gap-3 group-hover:text-primary transition-colors">
                      Minha Agenda
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Gerencie sua disponibilidade e agendamentos
                    </p>
                    <Button className="w-full" variant="outline" size="sm">
                      Ver agenda
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all group" onClick={() => navigate('/profissional/me')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl flex items-center gap-3 group-hover:text-primary transition-colors">
                      Meu Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Atualize certificados, foto e dados
                    </p>
                    <Button className="w-full" variant="outline" size="sm">
                      Editar perfil
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

