import { useState, useEffect } from 'react';
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
import { calculateAge } from '@/data/mockData';
import { StarRating } from '@/components/ui/StarRating';
import axios from 'axios';
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

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  profile_image: string | null;
  created_at: string;
}

interface Professional {
  id: string;
  user_id: number;
  name: string;
  birth_date: string;
  sex: string;
  city: string;
  state: string;
  region: string;
  whatsapp: string;
  email: string;
  profession: string;
  profile_image: string | null;
  video_url: string | null;
  bio: string;
  experience_years: number;
  courses: string[];
  certificates: { name: string; file?: string }[];
  service_area: string;
  service_radius: number | null;
  hospitals: string[];
  availability: string;
  price_range: { min: number; max: number } | null;
  rating: number;
  total_ratings: number;
  status: string;
  background_check: boolean;
  whatsapp_clicks: number;
  weekly_views: number;
  created_at: string;
  is_highlighted: boolean;
  highlight_phrase: string | null;
  references: { name: string; phone?: string }[];
  trial_ends_at: string | null;
  corem: string | null;
  background_check_file: string | null;
  background_check_notes: string | null;
}

export default function DashboardProfissional() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  // Estado para o perfil profissional
  const [myProfile, setMyProfile] = useState<Professional | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  // Calcular idade baseada no perfil carregado
  const age = myProfile ? calculateAge(myProfile.birth_date) : 0;

  const [formData, setFormData] = useState({
    bio: myProfile?.bio || '',
    serviceArea: myProfile?.service_area || '',
    serviceRadius: myProfile?.service_radius?.toString() || '10',
    hospitals: myProfile?.hospitals?.join(', ') || '',
    priceMin: myProfile?.price_range?.min?.toString() || '',
    priceMax: myProfile?.price_range?.max?.toString() || '',
    birthDate: myProfile?.birth_date || '',
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [backgroundCheckFile, setBackgroundCheckFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[] | null>(null);

  // useEffect para buscar dados do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me', { withCredentials: true });
        setUserData(response.data.user);
      } catch (error) {
        console.error('Erro ao buscar usuário logado:', error);
        setErrorUser('Erro ao carregar dados do usuário');
      } finally {
        setLoadingUser(false);
      }
    };

    if (user) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [user]);

  // useEffect para buscar o perfil profissional
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoadingProfile(false);
        return;
      }

      try {
        // Usar o endpoint correto que busca pelo user_id do usuário autenticado
        const response = await axios.get('/api/professionals/me/profile', { withCredentials: true });
        setMyProfile(response.data);

        // Inicializar formData com os dados do perfil
        setFormData({
          bio: response.data?.bio || '',
          serviceArea: response.data?.service_area || '',
          serviceRadius: response.data?.service_radius?.toString() || '10',
          hospitals: response.data?.hospitals?.join(', ') || '',
          priceMin: response.data?.price_range?.min?.toString() || '',
          priceMax: response.data?.price_range?.max?.toString() || '',
          birthDate: response.data?.birth_date || '',
        });
      } catch (error) {
        console.error('Erro ao buscar perfil profissional:', error);
        if ((error as any).response?.status === 404) {
          setErrorProfile('Perfil profissional não encontrado. Você precisa completar seu cadastro.');
        } else {
          setErrorProfile('Erro ao carregar perfil profissional');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setProfilePhotoFile(file);
  };

  const handleBackgroundCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setBackgroundCheckFile(file);
  };

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : null;
    setCertificateFiles(files);
  };

  const handleSave = async () => {
    // Build form data to send including files
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== undefined && v !== null) payload.append(k, String(v));
    });
    if (profilePhotoFile) payload.append('profilePhoto', profilePhotoFile);
    if (backgroundCheckFile) payload.append('background_check_file', backgroundCheckFile);
    if (certificateFiles && certificateFiles.length > 0) {
      certificateFiles.forEach((f) => payload.append('certificates', f));
    }

    try {
      const response = await axios.put('/api/professionals/update', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Perfil salvo com sucesso!');
        // Reset file states
        setProfilePhotoFile(null);
        setBackgroundCheckFile(null);
        setCertificateFiles(null);
        // Recarregar o perfil
        window.location.reload();
      } else {
        alert('Erro ao salvar perfil.');
      }
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      if (error.response?.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        navigate('/login');
      } else {
        alert('Erro ao salvar perfil: ' + (error.response?.data?.error || error.message));
      }
    }
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
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">Acesso negado</p>
            <p className="text-muted-foreground text-sm">Você precisa estar logado para acessar esta página.</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Fazer Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Mostrar loading enquanto carrega o perfil
  if (loadingProfile) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando seu perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Mostrar erro se não conseguiu carregar o perfil
  if (errorProfile || !myProfile) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">Perfil profissional não encontrado</p>
            <p className="text-muted-foreground text-sm">
              {errorProfile || 'Você precisa completar seu cadastro profissional para acessar o dashboard.'}
            </p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => navigate('/cadastro')} variant="outline">
                Completar Cadastro
              </Button>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">
                Olá, <span className="text-gradient-highlight">{userData?.name || user?.name}</span>!
              </h1>
              <p className="text-muted-foreground">
                Gerencie seu perfil profissional
              </p>
            </div>
            <div className="flex items-center gap-3">
              {myProfile?.is_highlighted ? (
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
              {myProfile?.status && getStatusBadge(myProfile.status)}
              {myProfile?.id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/profissional/${myProfile.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver meu perfil público
                </Button>
              )}
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
                    <p className="text-2xl font-bold">{myProfile.whatsapp_clicks}</p>
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
                      rating={myProfile?.rating || 0}
                      totalRatings={myProfile?.total_ratings || 0}
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
                    <p className="text-2xl font-bold">{myProfile?.weekly_views || 0}</p>
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
                    <p className="text-2xl font-bold">{myProfile?.experience_years || 0}</p>
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
                        src={myProfile.profile_image || '/placeholder.svg'}
                        alt={myProfile.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold">{myProfile?.name || 'Nome não informado'}</p>
                        <p className="text-sm text-gradient-highlight font-medium">{myProfile?.profession || 'Profissão não informada'}</p>
                        <p className="text-sm text-muted-foreground">
                          {age} anos • {myProfile?.sex || 'Sexo não informado'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                        <p className="font-medium">
                          {myProfile?.birth_date ? new Date(myProfile.birth_date).toLocaleDateString('pt-BR') : 'Data não informada'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Idade</p>
                        <p className="font-medium">{age} anos</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cidade</p>
                        <p className="font-medium">
                          {myProfile?.city || 'Cidade não informada'}, {myProfile?.state || 'Estado não informado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Região</p>
                        <p className="font-medium">{myProfile?.region || 'Região não informada'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                        <p className="font-medium">{myProfile?.whatsapp || 'WhatsApp não informado'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{myProfile?.email || 'Email não informado'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Valor por 12 horas</p>
                        <p className="font-medium text-lg">
                          R$ {myProfile?.price_range?.min ?? '--'} – R$ {myProfile?.price_range?.max ?? '--'}
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
                        <span>{myProfile?.service_area || 'Área não informada'}</span>
                      </div>
                      {myProfile.service_radius && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Raio de atendimento</p>
                          <p className="text-2xl font-bold text-gradient-highlight">{myProfile.service_radius} km</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Disponibilidade</p>
                        <Badge variant="secondary">
                          {myProfile?.availability === 'hospital' && 'Hospitais'}
                          {myProfile?.availability === 'domicilio' && 'Domicílio'}
                          {myProfile?.availability === 'ambos' && 'Hospital e Domicílio'}
                        </Badge>
                      </div>
                      {myProfile.hospitals && myProfile.hospitals.length > 0 && (
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
                        {myProfile?.courses && myProfile.courses.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {myProfile.courses.map((course, i) => (
                              <Badge key={i} variant="secondary">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Certificados
                        </p>
                        {myProfile?.certificates && myProfile.certificates.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {myProfile.certificates.map((cert, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 border rounded-lg">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                  <span className="text-red-600 text-xs font-bold">PDF</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {typeof cert === 'string' ? cert.split('/').pop() : cert.name || 'Certificado'}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const url = typeof cert === 'string' ? cert : cert.file;
                                    if (url) {
                                      window.open(url.startsWith('http') ? url : `https://kuiddmais.com.br${url}`, '_blank');
                                    }
                                  }}
                                >
                                  Ver
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhum certificado cadastrado</p>
                        )}
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
                        src={myProfile.profile_image || '/placeholder.svg'}
                        alt={myProfile.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="hidden"
                          id="profilePhoto"
                        />
                        <Label htmlFor="profilePhoto" className="cursor-pointer">
                          <Button variant="outline" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Alterar foto
                            </span>
                          </Button>
                        </Label>
                        {profilePhotoFile && (
                          <p className="text-sm text-success mt-2">
                            Arquivo selecionado: {profilePhotoFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Background Check Upload */}
                  <div className="space-y-2">
                    <Label>Antecedente Criminal (PDF)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste um arquivo PDF ou clique para selecionar
                      </p>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={handleBackgroundCheckChange}
                        className="cursor-pointer"
                        id="backgroundCheck"
                      />
                      {backgroundCheckFile && (
                        <p className="text-sm text-success mt-2">
                          Arquivo selecionado: {backgroundCheckFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Video Upload - Only for Highlighted */}
                  {myProfile?.is_highlighted && (
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
                      value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, birthDate: e.target.value }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Idade calculada automaticamente: {formData.birthDate ? calculateAge(formData.birthDate) : 0} anos
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
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste arquivos PDF ou clique para selecionar
                      </p>
                      <Input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleCertificatesChange}
                        className="cursor-pointer"
                        id="certificates"
                      />
                      {certificateFiles && certificateFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-success">
                            {certificateFiles.length} arquivo(s) selecionado(s):
                          </p>
                          <ul className="text-xs text-muted-foreground mt-1">
                            {Array.from(certificateFiles).map((file, index) => (
                              <li key={index}>• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
