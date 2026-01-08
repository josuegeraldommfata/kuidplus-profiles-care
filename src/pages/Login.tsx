import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(email, password);

    if (result.success) {
      toast({
        title: 'Bem-vindo!',
        description: result.message,
      });

      // Redirect based on role
      const user = JSON.parse(localStorage.getItem('kuid_user') || '{}');
      switch (user.role) {
        case 'enfermeiro':
        case 'tecnico':
          navigate('/profissional');
          break;
        case 'contratante':
          navigate('/buscar');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      toast({
        title: 'Erro no login',
        description: result.message,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 gradient-hero">
        <Card className="w-full max-w-md animate-fade-in shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary-foreground">K+</span>
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Não tem conta?
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/cadastro')}
              >
                Criar conta
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Contas demo (senha: 123456)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  className="p-2 bg-background rounded hover:bg-accent text-left transition-colors"
                  onClick={() => {
                    setEmail('enfermeiro@kuid.com');
                    setPassword('123456');
                  }}
                >
                  <span className="font-medium text-primary">Enfermeiro</span>
                </button>
                <button
                  type="button"
                  className="p-2 bg-background rounded hover:bg-accent text-left transition-colors"
                  onClick={() => {
                    setEmail('tecnico@kuid.com');
                    setPassword('123456');
                  }}
                >
                  <span className="font-medium text-primary">Técnico</span>
                </button>
                <button
                  type="button"
                  className="p-2 bg-background rounded hover:bg-accent text-left transition-colors"
                  onClick={() => {
                    setEmail('contratante@kuid.com');
                    setPassword('123456');
                  }}
                >
                  <span className="font-medium text-primary">Contratante</span>
                </button>
                <button
                  type="button"
                  className="p-2 bg-background rounded hover:bg-accent text-left transition-colors"
                  onClick={() => {
                    setEmail('admin@kuid.com');
                    setPassword('123456');
                  }}
                >
                  <span className="font-medium text-primary">Admin</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
