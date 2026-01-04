import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { mockProfessionals, Professional } from '@/data/mockData';
import { StarRating } from '@/components/ui/StarRating';
import {
  Users,
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Ban,
  RotateCcw,
  Edit,
  MessageCircle,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [professionals, setProfessionals] = useState(mockProfessionals);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const filteredProfessionals = professionals.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: professionals.length,
    approved: professionals.filter((p) => p.status === 'approved').length,
    pending: professionals.filter((p) => p.status === 'pending').length,
    suspended: professionals.filter((p) => p.status === 'suspended').length,
    totalClicks: professionals.reduce((acc, p) => acc + p.whatsappClicks, 0),
  };

  const handleStatusChange = (
    professionalId: string,
    newStatus: 'approved' | 'pending' | 'suspended'
  ) => {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === professionalId ? { ...p, status: newStatus } : p
      )
    );
    toast({
      title: 'Status atualizado',
      description: `Profissional ${newStatus === 'approved' ? 'aprovado' : newStatus === 'suspended' ? 'suspenso' : 'pendente'}.`,
    });
  };

  const handleResetRating = (professionalId: string) => {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === professionalId
          ? { ...p, rating: 0, totalRatings: 0 }
          : p
      )
    );
    toast({
      title: 'Avaliação resetada',
      description: 'As avaliações foram zeradas.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Suspenso
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Gerencie os profissionais da plataforma
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.suspended}</p>
                    <p className="text-xs text-muted-foreground">Suspensos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalClicks}</p>
                    <p className="text-xs text-muted-foreground">WhatsApp clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Table */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-lg">Profissionais</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou cidade..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="approved">Aprovados</TabsTrigger>
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="suspended">Suspensos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Profissão</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={professional.profileImage}
                              alt={professional.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{professional.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {professional.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{professional.profession}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {professional.city}, {professional.state}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(professional.status)}</TableCell>
                        <TableCell>
                          <StarRating
                            rating={professional.rating}
                            totalRatings={professional.totalRatings}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {professional.whatsappClicks}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/profissional/${professional.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {professional.status !== 'approved' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(professional.id, 'approved')
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-success" />
                                  Aprovar
                                </DropdownMenuItem>
                              )}
                              {professional.status !== 'suspended' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(professional.id, 'suspended')
                                  }
                                  className="text-destructive"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspender
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleResetRating(professional.id)}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Resetar avaliações
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredProfessionals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum profissional encontrado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
