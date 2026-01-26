import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Building2, ArrowLeft, UserPlus } from 'lucide-react';
import api from '@/lib/api';

type ContratanteForm = {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  pais: string;
  password: string;
  confirmPassword: string;
};

export default function CadastroContratante() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContratanteForm>({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        name: `${formData.nome} ${formData.sobrenome}`,
        email: formData.email,
        password: formData.password,
        role: 'contratante',
        // Additional fields for contratante
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        cidade: formData.cidade,
        estado: formData.estado,
        pais: formData.pais,
      });

      toast({
        title: 'Cadastro enviado!',
        description:
          'Seu cadastro foi criado! Verifique seu email para confirmar a conta antes de fazer login.',
      });

      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Falha ao enviar cadastro.';
      toast({ 
        title: 'Erro', 
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4 gradient-hero">
        <div className="container max-w-2xl">
          <Card className="animate-fade-in shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-highlight flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Cadastro de Contratante</CardTitle>
              <CardDescription>
                Crie sua conta e encontre profissionais qualificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sobrenome">Sobrenome *</Label>
                    <Input
                      id="sobrenome"
                      placeholder="Seu sobrenome"
                      value={formData.sobrenome}
                      onChange={(e) => handleChange('sobrenome', e.target.value)}
                      required
                    />
                  </div>
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
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleChange('estado', value)}
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
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País *</Label>
                  <Select
                    value={formData.pais}
                    onValueChange={(value) => handleChange('pais', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brasil">Brasil</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                      <SelectItem value="Colômbia">Colômbia</SelectItem>
                      <SelectItem value="Paraguai">Paraguai</SelectItem>
                      <SelectItem value="Uruguai">Uruguai</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
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
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Ao criar sua conta, você concorda com nossos{' '}
                  <a
                    href="/termos-contratantes"
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

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/escolha-tipo-cadastro')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1 gradient-highlight border-0">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar conta
                  </Button>
                </div>
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

