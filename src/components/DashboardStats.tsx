import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '@/lib/api';
import {
  MessageCircle,
  TrendingUp,
  Eye,
  Calendar,
  Star,
  Users,
  DollarSign,
  Activity,
  FileText,
  Heart
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface StatsData {
  profile: {
    whatsapp_clicks: number;
    weekly_views: number;
    rating: number;
    total_ratings: number;
  };
  reviews: {
    total: number;
    avg_rating: number;
  };
  contracts: {
    total: number;
    active: number;
    completed: number;
  };
  schedules: {
    upcoming: number;
  };
  views_history: { date: string; views: number }[];
  whatsapp_clicks_history: { date: string; clicks: number }[];
  city_ranking: { city: string; total: number }[];
  profession_ranking: { profession: string; total: number }[];
}

interface ContractorStatsData {
  contracts: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  reviews_given: number;
  reviews_received: {
    total: number;
    avg_rating: number;
  };
  favorites: number;
  spending_history: { month: string; total: number }[];
  hired_by_profession: { profession: string; total: number }[];
}

interface DashboardStatsProps {
  type: 'professional' | 'contractor' | 'admin';
}

export default function DashboardStats({ type }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | ContractorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/stats/';

        if (type === 'professional') {
          endpoint += 'professional';
        } else if (type === 'contractor') {
          endpoint += 'contractor';
        } else {
          endpoint += 'admin';
        }

        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [type]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-12 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          {error || 'Dados não disponíveis'}
        </CardContent>
      </Card>
    );
  }

  // Formatar dados para os gráficos
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const viewsChartData = (stats as StatsData).views_history?.map(item => ({
    date: formatDate(item.date),
    visualizações: item.views
  })) || [];

  const whatsappChartData = (stats as StatsData).whatsapp_clicks_history?.map(item => ({
    date: formatDate(item.date),
    cliques: item.clicks
  })) || [];

  const cityRankingData = (stats as StatsData).city_ranking?.map(item => ({
    name: item.city,
    value: item.total
  })) || [];

  const professionRankingData = (stats as StatsData).profession_ranking?.map(item => ({
    name: item.profession,
    value: item.total
  })) || [];

  const spendingData = (stats as ContractorStatsData).spending_history?.map(item => ({
    month: new Date(item.month).toLocaleDateString('pt-BR', { month: 'short' }),
    valor: Number(item.total)
  })) || [];

  const hiredProfessionData = (stats as ContractorStatsData).hired_by_profession?.map(item => ({
    name: item.profession,
    value: item.total
  })) || [];

  if (type === 'professional') {
    const s = stats as StatsData;
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-highlight flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.profile?.whatsapp_clicks || 0}</p>
                  <p className="text-xs text-muted-foreground">Cliques WhatsApp</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.profile?.rating?.toFixed(1) || '0.0'}</p>
                  <p className="text-xs text-muted-foreground">Nota ({s.profile?.total_ratings || 0} avaliações)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.profile?.weekly_views || 0}</p>
                  <p className="text-xs text-muted-foreground">Visualizações (7 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.schedules?.upcoming || 0}</p>
                  <p className="text-xs text-muted-foreground">Agendamentos (7 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gradient-highlight">{s.contracts?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Total Contratos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{s.contracts?.active || 0}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{s.contracts?.completed || 0}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visualizações Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visualizações (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              {viewsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={viewsChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12 }}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visualizações"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhuma visualização registrada
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Clicks Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cliques no WhatsApp (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              {whatsappChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={whatsappChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12 }}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="cliques" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum clique registrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* City Ranking */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profissionais por Cidade</CardTitle>
            </CardHeader>
            <CardContent>
              {cityRankingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={cityRankingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cityRankingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Dados não disponíveis
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {cityRankingData.slice(0, 5).map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.name}: {item.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profession Ranking */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profissionais por Especialidade</CardTitle>
            </CardHeader>
            <CardContent>
              {professionRankingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={professionRankingData.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12 }}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Dados não disponíveis
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === 'contractor') {
    const s = stats as ContractorStatsData;
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-highlight flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.contracts?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Contratos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.contracts?.active || 0}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.reviews_given || 0}</p>
                  <p className="text-xs text-muted-foreground">Avaliações Feitas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.favorites || 0}</p>
                  <p className="text-xs text-muted-foreground">Favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Spending History */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gastos por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              {spendingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12 }}
                      labelStyle={{ fontSize: 12 }}
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                    />
                    <Bar dataKey="valor" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum gasto registrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hired by Profession */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profissionais por Especialidade</CardTitle>
            </CardHeader>
            <CardContent>
              {hiredProfessionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={hiredProfessionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {hiredProfessionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum profissional contratado
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {hiredProfessionData.slice(0, 5).map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.name}: {item.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
