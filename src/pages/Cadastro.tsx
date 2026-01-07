import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { brazilianStates } from '@/data/mockData';
import { UserPlus, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    city: '',
    state: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Cadastro enviado!',
      description:
        'Seu perfil foi criado e está pendente de aprovação. Você receberá um email quando for aprovado.',
    });

    navigate('/login');
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4 gradient-hero">
        <div className="container max-w-2xl">
          <Card className="animate-fade-in shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Cadastro de Profissional</CardTitle>
              <CardDescription>
                Crie seu perfil e comece a receber contatos
              </CardDescription>
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-16 rounded-full transition-colors ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Idade *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Ex: 30"
                          value={formData.age}
                          onChange={(e) => handleChange('age', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sex">Sexo *</Label>
                        <Select
                          value={formData.sex}
                          onValueChange={(value) => handleChange('sex', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession">Profissão *</Label>
                        <Select
                          value={formData.profession}
                          onValueChange={(value) =>
                            handleChange('profession', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Enfermeiro(a)">
                              Enfermeiro(a)
                            </SelectItem>
                            <SelectItem value="Técnico(a) de Enfermagem">
                              Técnico(a) de Enfermagem
                            </SelectItem>
                            <SelectItem value="Cuidador(a)">
                              Cuidador(a)
                            </SelectItem>
                            <SelectItem value="Acompanhante Hospitalar">
                              Acompanhante Hospitalar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleChange('state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {brazilianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="Sua cidade"
                          value={formData.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full mt-4"
                      onClick={() => setStep(2)}
                      disabled={
                        !formData.name ||
                        !formData.age ||
                        !formData.sex ||
                        !formData.profession ||
                        !formData.state ||
                        !formData.city
                      }
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••"
                          value={formData.password}
                          onChange={(e) =>
                            handleChange('password', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleChange('confirmPassword', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Ao criar sua conta, você concorda com nossos{' '}
                      <a
                        href="/termos-profissionais"
                        className="text-primary hover:underline"
                      >
                        Termos de Uso
                      </a>{' '}
                      e{' '}
                      <a
                        href="/privacidade"
                        className="text-primary hover:underline"
                      >
                        Política de Privacidade
                      </a>
                      .
                    </p>

                    <div className="flex gap-3 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar conta
                      </Button>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
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
