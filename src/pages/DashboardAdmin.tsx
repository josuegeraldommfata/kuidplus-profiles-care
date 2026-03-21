import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users, DollarSign, FileText, Activity, TrendingUp, Shield,
  Settings, Eye, Ban, CheckCircle, Search, RefreshCw,
  Palette, Type, Image, Globe, Mail, Phone
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AdminStats {
  total_users: number;
  total_professionals: number;
  total_contractors: number;
  total_services: number;
  total_proposals: number;
  total_contracts: number;
  revenue: number;
  active_trials: number;
  expired_trials: number;
  paid_users: number;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  subscription_status: string;
}

interface SiteSettings {
  site_name: string;
  site_description: string;
  footer_text: string;
  contact_email: string;
  contact_phone: string;
  primary_color: string;
  navbar_links: string;
  footer_links: string;
  hero_title: string;
  hero_subtitle: string;
}

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'KUIDD+',
    site_description: 'KUID+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!',
    footer_text: '© 2025 KUIDD+ - Todos os direitos reservados',
    contact_email: 'contato@kuiddmais.com.br',
    contact_phone: '',
    primary_color: '#0d9488',
    navbar_links: '',
    footer_links: '',
    hero_title: 'Encontre profissionais de saúde qualificados',
    hero_subtitle: 'Conectamos famílias e profissionais de saúde com confiança e segurança',
  });

  // Mock chart data - replaced by real data from /api/stats/admin
  const [usersOverTime, setUsersOverTime] = useState([
    { month: 'Jan', usuarios: 45 }, { month: 'Fev', usuarios: 78 },
    { month: 'Mar', usuarios: 120 }, { month: 'Abr', usuarios: 189 },
    { month: 'Mai', usuarios: 256 }, { month: 'Jun', usuarios: 340 },
  ]);
  const [revenueOverTime, setRevenueOverTime] = useState([
    { month: 'Jan', receita: 2400 }, { month: 'Fev', receita: 4200 },
    { month: 'Mar', receita: 6800 }, { month: 'Abr', receita: 9500 },
    { month: 'Mai', receita: 14200 }, { month: 'Jun', receita: 18900 },
  ]);
  const [usersByRole, setUsersByRole] = useState([
    { name: 'Contratantes', value: 420 }, { name: 'Enfermeiros', value: 180 },
    { name: 'Cuidadores', value: 150 }, { name: 'Técnicos', value: 95 },
    { name: 'Acompanhantes', value: 60 }, { name: 'Fisioterapeutas', value: 40 },
  ]);
  const [servicesByStatus, setServicesByStatus] = useState([
    { status: 'Abertos', total: 45 }, { status: 'Em Negociação', total: 23 },
    { status: 'Contratados', total: 67 }, { status: 'Concluídos', total: 134 },
    { status: 'Cancelados', total: 12 },
  ]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchSiteSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/stats/admin');
      setStats(response.data);
      if (response.data.users_over_time) setUsersOverTime(response.data.users_over_time);
      if (response.data.revenue_over_time) setRevenueOverTime(response.data.revenue_over_time);
      if (response.data.users_by_role) setUsersByRole(response.data.users_by_role);
      if (response.data.services_by_status) setServicesByStatus(response.data.services_by_status);
    } catch (err) {
      console.warn('Usando dados mock para admin stats');
      setStats({
        total_users: 945, total_professionals: 525, total_contractors: 420,
        total_services: 281, total_proposals: 634, total_contracts: 201,
        revenue: 47820, active_trials: 89, expired_trials: 34, paid_users: 312,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.warn('Usando dados mock para usuários');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const response = await api.get('/api/admin/site-settings');
      if (response.data) setSiteSettings(response.data);
    } catch (err) {
      console.warn('Usando configurações padrão do site');
    }
  };

  const handleSaveSiteSettings = async () => {
    try {
      await api.put('/api/admin/site-settings', siteSettings);
      toast({ title: 'Sucesso', description: 'Configurações do site salvas!' });
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao salvar configurações', variant: 'destructive' });
    }
  };

  const handleToggleUser = async (userId: number, action: 'activate' | 'suspend') => {
    try {
      await api.patch(`/api/admin/users/${userId}/${action}`);
      toast({ title: 'Sucesso', description: `Usuário ${action === 'activate' ? 'ativado' : 'suspenso'}!` });
      fetchUsers();
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao atualizar usuário', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleName = (role: string) => {
    const map: Record<string, string> = {
      contratante: 'Contratante', enfermeiro: 'Enfermeiro(a)', tecnico: 'Técnico(a)',
      cuidador: 'Cuidador(a)', acompanhante: 'Acompanhante', fisioterapeuta: 'Fisioterapeuta',
      admin: 'Admin',
    };
    return map[role] || role;
  };

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card><CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-xl font-bold mb-2">Acesso Restrito</p>
            <p className="text-muted-foreground mb-4">Apenas administradores podem acessar esta página.</p>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </CardContent></Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-muted-foreground mt-1">Visão geral e gerenciamento da plataforma KUIDD+</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => { fetchStats(); fetchUsers(); }}>
                <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Usuários', value: stats?.total_users || 0, icon: Users, color: 'bg-primary/10 text-primary' },
              { label: 'Profissionais', value: stats?.total_professionals || 0, icon: Activity, color: 'bg-emerald-500/10 text-emerald-600' },
              { label: 'Contratantes', value: stats?.total_contractors || 0, icon: Users, color: 'bg-blue-500/10 text-blue-600' },
              { label: 'Serviços', value: stats?.total_services || 0, icon: FileText, color: 'bg-purple-500/10 text-purple-600' },
              { label: 'Receita', value: `R$ ${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-amber-500/10 text-amber-600' },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subscription Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats?.paid_users || 0}</p>
                <p className="text-sm text-muted-foreground">Assinantes Pagos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{stats?.active_trials || 0}</p>
                <p className="text-sm text-muted-foreground">Trials Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{stats?.expired_trials || 0}</p>
                <p className="text-sm text-muted-foreground">Trials Expirados</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="charts">
            <TabsList className="mb-6">
              <TabsTrigger value="charts"><TrendingUp className="w-4 h-4 mr-2" /> Gráficos</TabsTrigger>
              <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" /> Usuários</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" /> Configurações do Site</TabsTrigger>
            </TabsList>

            {/* Charts Tab */}
            <TabsContent value="charts">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Crescimento de Usuários</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={usersOverTime}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="usuarios" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">Receita Mensal (R$)</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueOverTime}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString()}`, 'Receita']} />
                        <Bar dataKey="receita" fill="#00C49F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">Usuários por Tipo</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={usersByRole} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {usersByRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">Serviços por Status</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={servicesByStatus} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="status" type="category" width={110} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#8884d8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Gerenciar Usuários</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por nome ou email..."
                          className="pl-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        <option value="contratante">Contratantes</option>
                        <option value="enfermeiro">Enfermeiros</option>
                        <option value="tecnico">Técnicos</option>
                        <option value="cuidador">Cuidadores</option>
                        <option value="acompanhante">Acompanhantes</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{users.length === 0 ? 'Nenhum usuário carregado. Verifique a API /api/admin/users no backend.' : 'Nenhum resultado encontrado.'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Nome</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Tipo</th>
                            <th className="text-left p-3 font-medium">Assinatura</th>
                            <th className="text-left p-3 font-medium">Cadastro</th>
                            <th className="text-left p-3 font-medium">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-3 font-medium">{u.name}</td>
                              <td className="p-3 text-muted-foreground">{u.email}</td>
                              <td className="p-3">
                                <Badge variant="outline">{getRoleName(u.role)}</Badge>
                              </td>
                              <td className="p-3">
                                <Badge variant={u.subscription_status === 'active' ? 'default' : u.subscription_status === 'trial' ? 'secondary' : 'destructive'}>
                                  {u.subscription_status === 'active' ? 'Ativo' : u.subscription_status === 'trial' ? 'Trial' : 'Expirado'}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground">
                                {new Date(u.created_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => navigate(`/profissional/${u.id}`)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {u.status === 'active' ? (
                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleToggleUser(u.id, 'suspend')}>
                                      <Ban className="w-4 h-4" />
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => handleToggleUser(u.id, 'activate')}>
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Site Settings Tab */}
            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" /> Informações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Nome do Site</Label>
                      <Input value={siteSettings.site_name} onChange={(e) => setSiteSettings(s => ({ ...s, site_name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Descrição / Slogan</Label>
                      <Textarea value={siteSettings.site_description} onChange={(e) => setSiteSettings(s => ({ ...s, site_description: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label>Email de Contato</Label>
                      <Input type="email" value={siteSettings.contact_email} onChange={(e) => setSiteSettings(s => ({ ...s, contact_email: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Telefone de Contato</Label>
                      <Input value={siteSettings.contact_phone} onChange={(e) => setSiteSettings(s => ({ ...s, contact_phone: e.target.value }))} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="w-5 h-5" /> Conteúdo da Página Inicial
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título Principal (Hero)</Label>
                      <Input value={siteSettings.hero_title} onChange={(e) => setSiteSettings(s => ({ ...s, hero_title: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Subtítulo (Hero)</Label>
                      <Textarea value={siteSettings.hero_subtitle} onChange={(e) => setSiteSettings(s => ({ ...s, hero_subtitle: e.target.value }))} rows={2} />
                    </div>
                    <div>
                      <Label>Texto do Rodapé</Label>
                      <Input value={siteSettings.footer_text} onChange={(e) => setSiteSettings(s => ({ ...s, footer_text: e.target.value }))} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" /> Aparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Cor Primária</Label>
                      <div className="flex gap-2">
                        <input type="color" value={siteSettings.primary_color} onChange={(e) => setSiteSettings(s => ({ ...s, primary_color: e.target.value }))} className="w-12 h-10 rounded border cursor-pointer" />
                        <Input value={siteSettings.primary_color} onChange={(e) => setSiteSettings(s => ({ ...s, primary_color: e.target.value }))} className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <Label>Links da Navbar (JSON)</Label>
                      <Textarea value={siteSettings.navbar_links} onChange={(e) => setSiteSettings(s => ({ ...s, navbar_links: e.target.value }))} rows={3} placeholder='[{"label":"Sobre","url":"/sobre"}]' />
                    </div>
                    <div>
                      <Label>Links do Rodapé (JSON)</Label>
                      <Textarea value={siteSettings.footer_links} onChange={(e) => setSiteSettings(s => ({ ...s, footer_links: e.target.value }))} rows={3} placeholder='[{"label":"Termos","url":"/termos"}]' />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background">
                      <div className="text-center space-y-2">
                        <h3 className="font-bold text-lg" style={{ color: siteSettings.primary_color }}>{siteSettings.site_name}</h3>
                        <p className="text-sm text-muted-foreground">{siteSettings.site_description}</p>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-xs text-muted-foreground">{siteSettings.footer_text}</p>
                          <p className="text-xs text-muted-foreground">{siteSettings.contact_email}</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleSaveSiteSettings} className="w-full">
                      <Settings className="w-4 h-4 mr-2" /> Salvar Configurações
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      💡 Para aplicar no site, crie as rotas no backend:<br />
                      <code className="bg-muted px-1 rounded">GET /api/admin/site-settings</code><br />
                      <code className="bg-muted px-1 rounded">PUT /api/admin/site-settings</code>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
