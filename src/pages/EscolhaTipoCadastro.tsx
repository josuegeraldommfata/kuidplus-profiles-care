import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { UserPlus, Building2, ArrowRight } from 'lucide-react';

export default function EscolhaTipoCadastro() {
  const navigate = useNavigate();

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4 gradient-hero">
        <div className="container max-w-4xl">
          <Card className="animate-fade-in shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl">Escolha seu tipo de cadastro</CardTitle>
              <CardDescription className="text-base">
                Selecione como você deseja se cadastrar na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Profissional */}
                <Card className="relative overflow-hidden border-2 hover:border-primary transition-colors cursor-pointer group"
                  onClick={() => navigate('/cadastro?tipo=profissional')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Sou Profissional</h3>
                    <p className="text-muted-foreground mb-6">
                      Cadastre-se como profissional de saúde (Enfermeiro, Técnico de Enfermagem, Cuidador, etc.) 
                      e comece a receber propostas de trabalho.
                    </p>
                    <Button
                      className="w-full gradient-highlight border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cadastro?tipo=profissional');
                      }}
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Contratante */}
                <Card className="relative overflow-hidden border-2 hover:border-primary transition-colors cursor-pointer group"
                  onClick={() => navigate('/cadastro?tipo=contratante')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full gradient-highlight flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Sou Contratante</h3>
                    <p className="text-muted-foreground mb-6">
                      Cadastre-se como contratante e encontre profissionais qualificados 
                      para cuidar de quem você ama.
                    </p>
                    <Button
                      className="w-full gradient-highlight border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cadastro?tipo=contratante');
                      }}
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <span className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <a
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </a>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

