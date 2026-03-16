import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ProfessionType } from '@/types/marketplace';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';

const PROFESSION_OPTIONS: ProfessionType[] = [
  'Enfermeiro(a)',
  'Técnico(a) de Enfermagem',
  'Cuidador(a)',
  'Fisioterapeuta',
];

export default function PostarServico() {
  const { user } = useAuth();
  const { addService } = useMarketplace();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    professionType: '' as ProfessionType | '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    city: '',
    state: '',
    offeredValue: '',
    negotiable: false,
    urgent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.professionType || !form.date) return;

    const service = addService({
      title: form.title,
      description: form.description,
      professionType: form.professionType as ProfessionType,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      city: form.city,
      state: form.state,
      offeredValue: form.offeredValue ? parseFloat(form.offeredValue) : undefined,
      negotiable: form.negotiable,
      urgent: form.urgent,
      contractorId: user.id,
      contractorName: user.name,
    });

    navigate('/dashboard/contratante/meus-servicos');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Publicar Novo Serviço</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha os detalhes do serviço que você precisa. Profissionais qualificados poderão enviar propostas.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Serviço *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Cuidador para idoso – turno noturno"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva em detalhes o que o profissional precisará fazer, condições do paciente, etc."
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Profissional Necessário *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFESSION_OPTIONS.map(p => (
                      <Button
                        key={p}
                        type="button"
                        variant={form.professionType === p ? 'default' : 'outline'}
                        className={form.professionType === p ? 'gradient-highlight border-0' : ''}
                        onClick={() => setForm(f => ({ ...f, professionType: p }))}
                        size="sm"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data do Serviço *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Horário Início</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Horário Término</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Endereço / Localização</Label>
                  <Input
                    id="location"
                    placeholder="Rua, número, bairro"
                    value={form.location}
                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={form.state}
                      onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor Oferecido (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Opcional – deixe vazio para 'a combinar'"
                    value={form.offeredValue}
                    onChange={(e) => setForm(f => ({ ...f, offeredValue: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Valor Negociável</Label>
                      <p className="text-xs text-muted-foreground">Aceitar propostas com valores diferentes</p>
                    </div>
                    <Switch
                      checked={form.negotiable}
                      onCheckedChange={(c) => setForm(f => ({ ...f, negotiable: c }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg border-destructive/30">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <div>
                        <Label className="text-sm font-medium">Urgente</Label>
                        <p className="text-xs text-muted-foreground">Marcar como serviço urgente</p>
                      </div>
                    </div>
                    <Switch
                      checked={form.urgent}
                      onCheckedChange={(c) => setForm(f => ({ ...f, urgent: c }))}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-highlight border-0" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Publicar Serviço
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
