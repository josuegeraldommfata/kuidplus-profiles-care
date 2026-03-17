import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/StarRating';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface MatchingProfessional {
  id: number;
  name: string;
  profession: string;
  city: string;
  rating: number;
  review_count: number;
  distance_km: number;
  availability_score: number;
  match_score: number;
  avatar: string;
  subscription_plan: string;
}

export default function MatchingProfissionais() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<MatchingProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    profession: '',
    city: '',
    min_rating: 4.0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatching();
    }
  }, [isAuthenticated, filters]);

  const fetchMatching = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/matching', {
        params: filters
      });
      setProfessionals(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar profissionais',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendAutoProposal = async (professionalId: number, professionalName: string) => {
    try {
      // Cria serviço genérico ou usa último serviço
      const response = await api.post('/api/services/auto-proposal', {
        professional_id: professionalId,
        professional_name: professionalName
      });

      toast({
        title: 'Proposta enviada!',
        description: 'Proposta automática enviada via matching',
      });

      navigate(`/dashboard/contratante/meus-servicos`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar proposta',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Calculando melhor matching...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Matching Automático
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Profissionais perfeitos para você - algoritmo considera localização, avaliação, disponibilidade e especialidade
          </p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-muted rounded-lg">
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              onChange={(e) => setFilters({...filters, profession: e.target.value})}
            >
              <option value="">Todas profissões</option>
              <option value="Fisioterapeuta">Fisioterapeuta</option>
              <option value="Fonoaudiólogo">Fonoaudiólogo</option>
              <option value="Nutricionista">Nutricionista</option>
            </select>
            <input
              type="number"
              placeholder="Rating mínimo"
              className="w-24 px-4 py-2 border rounded-lg"
              min="0" max="5" step="0.5"
              onChange={(e) => setFilters({...filters, min_rating: Number(e.target.value)})}
            />
            <Button onClick={fetchMatching} className="ml-auto">
              Filtrar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <Card key={pro.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-sm">{pro.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{pro.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge>{pro.profession}</Badge>
                        <Badge variant="outline">{pro.city}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold gradient-highlight bg-clip-text text-transparent">
                      {pro.match_score}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={pro.rating} size="sm" />
                  <span className="text-sm font-medium">({pro.review_count})</span>
                  <Badge className="ml-auto text-xs" variant={pro.subscription_plan === 'PREMIUM' ? 'default' : 'secondary'}>
                    {pro.subscription_plan}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Distância</span>
                    <span className="font-medium">{pro.distance_km.toFixed(1)}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disponibilidade</span>
                    <span className="font-medium">{pro.availability_score}%</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/profissional/${pro.id}`)}
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendAutoProposal(pro.id, pro.name)}
                    className="flex-1"
                  >
                    Proposta Rápida
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {professionals.length === 0 && !loading && (
          <Card className="mt-12">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum profissional encontrado com esses filtros
              </p>
              <Button onClick={() => setFilters({ profession: '', city: '', min_rating: 4.0 })}>
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

