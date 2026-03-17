import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { CalendarDays, MapPin, Clock, DollarSign, Send, AlertTriangle, CheckCircle } from 'lucide-react';

interface ServiceForm {
  title: string;
  description: string;
  profession: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  state: string;
  budget_min: number;
  budget_max: number | null;
  negotiable: boolean;
  urgent: boolean;
}

export default function PostarServico() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ServiceForm>({
    title: '',
    description: '',
    profession: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    city: '',
    state: '',
    budget_min: 0,
    budget_max: null,
    negotiable: false,
    urgent: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ServiceForm, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/services', formData);

      toast({
        title: 'Serviço publicado!',
        description: `Seu serviço "${response.data.title}" foi criado com sucesso. Profissionais verão em Procurar Turnos.`,
      });

      setSubmitted(true);
      // Redireciona para meus serviços em 3s
      setTimeout(() => {
        navigate('/dashboard/contratante/meus-servicos');
      }, 3000);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error || 'Erro ao publicar serviço.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Postar Serviço</h1>
          <p>Faça login para postar um serviço.</p>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-2xl mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Serviço publicado!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Profissionais verão seu serviço em "Procurar Turnos". Você será redirecionado para "Meus Serviços".
          </p>
          <Button onClick={() => navigate('/dashboard/contratante/meus-servicos')}>
            Ir para Meus Serviços
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Postar Novo Serviço
            </h1>
            <p className="text-xl text-muted-foreground">
              Crie seu serviço e receba propostas de profissionais qualificados
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Serviço <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    required
                    placeholder="Ex: Plantão 12h UTI Neonatal - Hospital São João"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    required
                    rows={4}
                    placeholder="Descreva as tarefas, equipamentos necessários, público atendido, etc. Seja específico para atrair os profissionais certos."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>

                {/* Profissão */}
                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão Necessária <span className="text-destructive">*</span></Label>
                  <Input
                    id="profession"
                    required
                    list="professions"
                    placeholder="Ex: Enfermeiro(a) UTI Neonatal"
                    value={formData.profession}
                    onChange={(e) => handleChange('profession', e.target.value)}
                  />
                  <datalist id="professions">
                    <option value="Enfermeiro(a)" />
                    <option value="Técnico de Enfermagem" />
                    <option value="Fisioterapeuta" />
                    <option value="Fonoaudiólogo(a)" />
                    <option value="Nutricionista" />
                    <option value="Terapeuta Ocupacional" />
                  </datalist>
                </div>

                {/* Data e Horário */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data <span className="text-destructive">*</span></Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Início <span className="text-destructive">*</span></Label>
                    <Input
                      id="start_time"
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={(e) => handleChange('start_time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">Fim <span className="text-destructive">*</span></Label>
                    <Input
                      id="end_time"
                      type="time"
                      required
                      value={formData.end_time}
                      onChange={(e) => handleChange('end_time', e.target.value)}
                    />
                  </div>
                </div>

                {/* Localização */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Local <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      required
                      placeholder="Ex: Hospital São João, Rua Exemplo 123"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade <span className="text-destructive">*</span></Label>
                    <Input
                      id="city"
                      required
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado <span className="text-destructive">*</span></Label>
                    <Input
                      id="state"
                      required
                      placeholder="SP"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </div>
                </div>

                {/* Orçamento */}
                <div className="space-y-2">
                  <Label>Orçamento (por 12h)</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={formData.budget_min}
                      onChange={(e) => handleChange('budget_min', parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo (opcional)"
                      value={formData.budget_max || ''}
                      onChange={(e) => handleChange('budget_max', parseFloat(e.target.value) || null)}
                    />
                  </div>
                </div>

                {/* Opções */}
                <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) => handleChange('negotiable', !!checked)}
                    />
                    <Label htmlFor="negotiable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Orçamento negociável
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) => handleChange('urgent', !!checked)}
                    />
                    <Label htmlFor="urgent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <AlertTriangle className="w-4 h-4 inline mr-1 text-destructive" />
                      <span className="text-destructive font-semibold">URGENTE</span> - destaque
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary text-white" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Publicando...' : 'Publicar Serviço'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

