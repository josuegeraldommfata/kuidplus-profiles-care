import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { Eye, EyeOff, LogIn, User, Briefcase, Shield } from 'lucide-react';

// Usuários de demonstração
const DEMO_USERS = [
  { email: 'enfermeiro@kuid.com', password: '123456', name: 'Enfermeiro', role: 'profissional' },
  { email: 'tecnico@kuid.com', password: '123456', name: 'Técnico', role: 'profissional' },
  { email: 'fisioterapeuta@kuid.com', password: '123456', name: 'Fisioterapeuta', role: 'profissional' },
  { email: 'medico@kuid.com', password: '123456', name: 'Médico', role: 'profissional' },
  { email: 'cuidador@kuid.com', password: '123456', name: 'Cuidador', role: 'profissional' },
  { email: 'contratante@kuid.com', password: '123456', name: 'Contratante', role: 'contratante' },
  { email: 'familia@souza.com', password: '123456', name: 'Família Souza', role: 'contratante' },
  { email: 'empresa@exemplo.com', password: '123456', name: 'Empresa', role: 'contratante' },
  { email: 'admin@kuid.com', password: '123456', name: 'Administrador', role: 'admin' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get redirect and plan from URL params
  const redirectUrl = searchParams.get('redirect') || '/';
  const selectedPlan = searchParams.get('plan');

  const handleDemoLogin = (demoUser: typeof DEMO_USERS[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: 'Bem-vindo!',
          description: result.message,
        });

        setTimeout(() => {
          // Se veio de uma página de planos com plano selecionado, volta para lá
          if (redirectUrl === '/planos' && selectedPlan) {
            navigate(`/planos?plan=${selectedPlan}`);
            return;
          }

          const userRole = user?.role || (result as any).user?.role;

          switch (userRole) {
            case 'enfermeiro':
            case 'tecnico':
            case 'profissional':
              navigate('/dashboard-profissional');
              break;
            case 'contratante':
              navigate('/dashboard-contratante');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/');
          }
        }, 100);
      } else {
        toast({
          title: 'Erro no login',
          description: result.message || 'Verifique suas credenciais.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro no login',
        description:
          (error as any)?.response?.data?.error ||
          (error as any)?.message ||
          'Erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 gradient-hero">
        <Card className="w-full max-w-md animate-fade-in shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img
                src="/logo.png"
                alt="KUIDD+ Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <CardTitle className="text-2xl">Entrar no KUIDD+</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="animate-pulse">Entrando...</span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            {/* Seção de usuários de demonstração */}
            <div className="mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowDemoUsers(!showDemoUsers)}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {showDemoUsers ? '▼ Ocultar' : '▶ Ver usuários de demonstração'}
              </button>

              {showDemoUsers && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    Clique em um usuário para preencher automaticamente
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {DEMO_USERS.map((demo) => (
                      <div
                        key={demo.email}
                        onClick={() => handleDemoLogin(demo)}
                        className="flex items-center gap-3 p-2 rounded-lg border hover:bg-accent hover:border-primary cursor-pointer transition-all"
                      >
                        {demo.role === 'profissional' ? (
                          <Briefcase className="h-4 w-4 text-blue-500" />
                        ) : demo.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-red-500" />
                        ) : (
                          <User className="h-4 w-4 text-green-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{demo.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{demo.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                          {demo.role === 'profissional' ? 'Profissional' : demo.role === 'admin' ? 'Admin' : 'Contratante'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Senha para todos: <strong>123456</strong>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
