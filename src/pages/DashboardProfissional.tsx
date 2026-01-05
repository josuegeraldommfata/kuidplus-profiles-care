import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockProfessionals, calculateAge } from '@/data/mockData';
import { StarRating } from '@/components/ui/StarRating';
import {
  User,
  FileEdit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Save,
  MessageCircle,
  TrendingUp,
  MapPin,
  Play,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function DashboardProfissional() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find the professional's profile (mock)
  const myProfile = mockProfessionals.find((p) => p.userId === user?.id) || mockProfessionals[0];
  const age = calculateAge(myProfile.birthDate);

  const [formData, setFormData] = useState({
    bio: myProfile.bio,
    serviceArea: myProfile.serviceArea,
    serviceRadius: myProfile.serviceRadius?.toString() || '10',
    hospitals: myProfile.hospitals.join(', '),
    priceMin: myProfile.priceRange.min.toString(),
    priceMax: myProfile.priceRange.max.toString(),
    birthDate: myProfile.birthDate,
  });

  const handleSave = () => {
    // Mock save
    alert('Perfil salvo com sucesso! (Demo)');
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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">
                Olá, <span className="text-gradient-highlight">{user.name}</span>!
              </h1>
              <p className="text-muted-foreground">
                Gerencie seu perfil profissional
              </p>
            </div>
            <div className="flex items-center gap-3">
              {myProfile.isHighlighted ? (
                <Badge className="gradient-highlight text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Perfil Destaque
                </Badge>
              ) : (
                <Button variant="outline" size="sm" className="text-gradient-highlight border-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ativar Destaque
                </Button>
              )}
              {getStatusBadge(myProfile.status)}
              <Button
                variant="outline"
                onClick={() => navigate(`/profissional/${myProfile.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver meu perfil público
              </Button>
            </div>
          </div>

          {/* KUID+ Presentation Video */}
          <Card className="mb-8 overflow-hidden border-2 border-dashed">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full gradient-highlight flex items-center justify-center mx-auto mb-4">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vídeo de apresentação KUID+
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">
                    <span className="text-gradient-highlight">Benefícios KUID+</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      Visibilidade para milhares de famílias
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      Contato direto via WhatsApp
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      Selo de verificação de antecedentes
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                      Perfil Destaque: prioridade na busca + vídeo + referências
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-highlight flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{myProfile.whatsappClicks}</p>
                    <p className="text-sm text-muted-foreground">
                      Cliques no WhatsApp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <StarRating
                      rating={myProfile.rating}
                      totalRatings={myProfile.totalRatings}
                      size="md"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Sua avaliação
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{myProfile.weeklyViews}</p>
                    <p className="text-sm text-muted-foreground">
                      Visualizações (7 dias)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{myProfile.experienceYears}</p>
                    <p className="text-sm text-muted-foreground">
                      Anos de experiência
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="animate-fade-in-up">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="edit">
                <FileEdit className="w-4 h-4 mr-2" />
                Editar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={myProfile.profileImage}
                        alt={myProfile.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold">{myProfile.name}</p>
                        <p className="text-sm text-gradient-highlight font-medium">{myProfile.profession}</p>
                        <p className="text-sm text-muted-foreground">
                          {age} anos • {myProfile.sex}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                        <p className="font-medium">
                          {new Date(myProfile.birthDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Idade</p>
                        <p className="font-medium">{age} anos</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cidade</p>
                        <p className="font-medium">
                          {myProfile.city}, {myProfile.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Região</p>
                        <p className="font-medium">{myProfile.region}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                        <p className="font-medium">{myProfile.whatsapp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{myProfile.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Valor por 12 horas</p>
                        <p className="font-medium text-lg">
                          R$ {myProfile.priceRange.min} – R$ {myProfile.priceRange.max}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Área de Atendimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-gradient-highlight" />
                        <span>{myProfile.serviceArea}</span>
                      </div>
                      {myProfile.serviceRadius && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Raio de atendimento</p>
                          <p className="text-2xl font-bold text-gradient-highlight">{myProfile.serviceRadius} km</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Disponibilidade</p>
                        <Badge variant="secondary">
                          {myProfile.availability === 'hospital' && 'Hospitais'}
                          {myProfile.availability === 'domicilio' && 'Domicílio'}
                          {myProfile.availability === 'ambos' && 'Hospital e Domicílio'}
                        </Badge>
                      </div>
                      {myProfile.hospitals.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Hospitais</p>
                          <div className="flex flex-wrap gap-2">
                            {myProfile.hospitals.map((hospital, i) => (
                              <Badge key={i} variant="outline">
                                {hospital}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Formações e Certificados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Cursos</p>
                        <div className="flex flex-wrap gap-2">
                          {myProfile.courses.map((course, i) => (
                            <Badge key={i} variant="secondary">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Certificados
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {myProfile.certificates.map((cert, i) => (
                            <Badge key={i} variant="outline">
                              {cert.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Editar Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Foto de Perfil</Label>
                    <div className="flex items-center gap-4">
                      <img
                        src={myProfile.profileImage}
                        alt={myProfile.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Alterar foto
                      </Button>
                    </div>
                  </div>

                  {/* Video Upload - Only for Highlighted */}
                  {myProfile.isHighlighted && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-gradient-highlight" />
                        Vídeo de Apresentação (até 60s)
                        <Badge className="gradient-highlight text-white text-[10px] ml-2">Destaque</Badge>
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Arraste um vídeo ou clique para selecionar
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Selecionar vídeo
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, birthDate: e.target.value }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Idade calculada automaticamente: {calculateAge(formData.birthDate)} anos
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Apresentação / Mini currículo</Label>
                    <Textarea
                      id="bio"
                      rows={5}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, bio: e.target.value }))
                      }
                    />
                  </div>

                  {/* Service Area */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceArea">Área de Atendimento</Label>
                      <Input
                        id="serviceArea"
                        value={formData.serviceArea}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, serviceArea: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceRadius" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gradient-highlight" />
                        Raio de Atendimento (km)
                      </Label>
                      <Input
                        id="serviceRadius"
                        type="number"
                        value={formData.serviceRadius}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, serviceRadius: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Hospitals */}
                  <div className="space-y-2">
                    <Label htmlFor="hospitals">
                      Hospitais que pode atender (separados por vírgula)
                    </Label>
                    <Input
                      id="hospitals"
                      value={formData.hospitals}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, hospitals: e.target.value }))
                      }
                    />
                  </div>

                  {/* Price Range */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceMin">Valor mínimo por 12 horas</Label>
                      <Input
                        id="priceMin"
                        type="number"
                        value={formData.priceMin}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, priceMin: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceMax">Valor máximo por 12 horas</Label>
                      <Input
                        id="priceMax"
                        type="number"
                        value={formData.priceMax}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, priceMax: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Certificates Upload */}
                  <div className="space-y-2">
                    <Label>Diplomas e Certificados</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Arraste arquivos ou clique para selecionar
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Selecionar arquivos
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full sm:w-auto gradient-highlight border-0">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
