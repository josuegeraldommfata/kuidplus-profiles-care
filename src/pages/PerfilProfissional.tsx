import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewsTimeline } from '@/components/ui/ReviewsTimeline';
import api from '@/lib/api';
import { getFileUrl } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Helper functions
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const getDisplayName = (name, isHighlighted) => {
  return name;
};
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  Award,
  Building2,
  FileCheck,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Play,
  Eye,
  Phone,
  User,
} from 'lucide-react';

// Normaliza dados do backend (snake_case) para frontend (camelCase)
const normalizeProfessional = (p: any) => {
  if (!p) return null;

  return {
    ...p,
    id: p.id,
    userId: p.user_id || p.userId,
    name: p.name,
    birthDate: p.birth_date || p.birthDate,
    sex: p.sex,
    city: p.city,
    state: p.state,
    region: p.region,
    whatsapp: p.whatsapp,
    email: p.email,
    profession: p.profession,
    profileImage: getFileUrl(p.profile_image || p.profileImage),
    videoUrl: p.video_url || p.videoUrl ? getFileUrl(p.video_url || p.videoUrl) : undefined,
    bio: p.bio || '',
    experienceYears: p.experience_years || p.experienceYears || 0,
    courses: p.courses || [],
    certificates: (p.certificates || []).map((c: any) => ({
      ...c,
      file: c.file ? getFileUrl(c.file) : undefined,
    })),
    serviceArea: p.service_area || p.serviceArea,
    serviceRadius: p.service_radius || p.serviceRadius,
    hospitals: p.hospitals || [],
    availability: p.availability,
    priceRange: p.price_range || p.priceRange || { min: 0, max: 0 },
    rating: p.rating || 0,
    totalRatings: p.total_ratings || p.totalRatings || 0,
    status: p.status,
    backgroundCheck: p.background_check || p.backgroundCheck,
    whatsappClicks: p.whatsapp_clicks || p.whatsappClicks || 0,
    weeklyViews: p.weekly_views || p.weeklyViews || 0,
    createdAt: p.created_at || p.createdAt,
    isHighlighted: p.is_highlighted || p.isHighlighted || false,
    highlightPhrase: p.highlight_phrase || p.highlightPhrase,
    references: p.references || [],
    trialEndsAt: p.trial_ends_at || p.trialEndsAt,
    corem: p.corem,
    backgroundCheckFile: p.background_check_file || p.backgroundCheckFile ? getFileUrl(p.background_check_file || p.backgroundCheckFile) : undefined,
    backgroundCheckNotes: p.background_check_notes || p.backgroundCheckNotes,
  };
};

export default function PerfilProfissional() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id) {
        setError('ID do profissional não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = id === 'me' ? '/api/professionals/me/profile' : `/api/professionals/${id}`;
        console.log('Fetching professional from:', endpoint);
        const response = await api.get(endpoint);
        console.log('Professional data:', response.data);

        if (!response.data) {
          setError('Profissional não encontrado');
          return;
        }

        setProfessional(normalizeProfessional(response.data));
      } catch (err: any) {
        console.error('Error fetching professional:', err);
        if (err.response?.status === 404) {
          setError('Profissional não encontrado');
        } else {
          setError('Erro ao carregar perfil do profissional');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (error || !professional) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Profissional não encontrado'}</h1>
          <Button onClick={() => navigate('/buscar')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para busca
          </Button>
        </div>
      </Layout>
    );
  }

  const age = calculateAge(professional.birthDate);
  const displayName = getDisplayName(professional.name, professional.isHighlighted);

  const handleWhatsAppClick = () => {
    const hasSeenDisclaimer = localStorage.getItem('kuid_whatsapp_disclaimer');
    if (hasSeenDisclaimer) {
      openWhatsApp();
    } else {
      setShowWhatsAppModal(true);
    }
  };

  const handleChatClick = () => {
    // Por enquanto, apenas abre WhatsApp como fallback
    handleWhatsAppClick();
  };

  const openWhatsApp = () => {
    localStorage.setItem('kuid_whatsapp_disclaimer', 'true');
    const message = encodeURIComponent(
      `Olá ${professional.name}! Encontrei seu perfil no KUID+ e gostaria de saber mais sobre seus serviços.`
    );
    window.open(`https://wa.me/${professional.whatsapp}?text=${message}`, '_blank');
    setShowWhatsAppModal(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-background border-b border-border">
          <div className="container py-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card className={`overflow-hidden animate-fade-in ${professional.isHighlighted ? 'card-highlighted' : ''}`}>
                <div className="md:flex">
                  <div className="md:w-64 md:shrink-0 relative">
                    <img
                      src={professional.profileImage || '/placeholder.svg'}
                      alt={displayName}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    {professional.isHighlighted && (
                      <div className="absolute top-3 left-3">
                        <Badge className="gradient-highlight text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl font-bold">{displayName}</h1>
                        <p className={`font-medium ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`}>
                          {professional.profession}
                        </p>
                        {professional.isHighlighted && professional.highlightPhrase && (
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            {professional.highlightPhrase}
                          </p>
                        )}
                        {professional.corem && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <strong>Registro profissional:</strong> {professional.corem}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {professional.backgroundCheck && professional.isHighlighted && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Antecedentes Verificados
                          </Badge>
                        )}
                        {!professional.isHighlighted && (
                          <Badge variant="secondary">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Perfil verificado pela KUID+
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {professional.city}{professional.state ? `, ${professional.state}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {professional.experienceYears} anos de experiência
                      </span>
                      {professional.isHighlighted && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {age} anos, {professional.sex}
                        </span>
                      )}
                    </div>

                    <StarRating
                      rating={professional.rating}
                      totalRatings={professional.totalRatings}
                      size="lg"
                      className="mb-4"
                    />

                    {professional.isHighlighted && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {professional.weeklyViews} acessos nos últimos 7 dias
                      </div>
                    )}

                    <div className="p-4 bg-muted/50 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Valor por 12 horas
                      </p>
                      <p className={`text-2xl font-bold ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`}>
                        R$ {professional?.priceRange?.min ?? '--'} – R${' '}
                        {professional?.priceRange?.max ?? '--'}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        className={`flex-1 md:flex-none gradient-highlight border-0`}
                        onClick={handleWhatsAppClick}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        WhatsApp
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {professional.certificates && professional.certificates.length >0 && (
                        professional.certificates.map((cert, index) => (
                          <img
                            key={index}
                            src={cert.file}
                            alt={cert.name || 'Certificado'}
                            style={{ width:100, height:100, objectFit: 'cover', borderRadius:8, border: '1px solid #eee' }}
                          />
                        ))
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Bio - Only detailed for highlighted */}
              <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Sobre</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {professional.isHighlighted
                      ? professional.bio
                      : professional.bio.substring(0, 150) + (professional.bio.length > 150 ? '...' : '')
                    }
                  </p>
                  {!professional.isHighlighted && professional.bio.length > 150 && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Profissionais em destaque mostram descrição completa
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Video Presentation */}
              {professional.videoUrl && (
                <Card className="animate-fade-in" style={{ animationDelay: '125ms' }}>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-gradient-highlight" />
                      Vídeo de Apresentação
                    </h2>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={professional.profileImage || '/placeholder.svg'}
                      >
                        <source src={professional.videoUrl} type="video/mp4" />
                        Seu navegador não suporta vídeo.
                      </video>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Courses & Certificates */}
              <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gradient-highlight" />
                    Formações e Cursos
                  </h2>
                  {professional.courses && professional.courses.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {professional.courses.map((course, index) => (
                        <Badge key={index} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-6">Nenhuma formação informada</p>
                  )}

                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-gradient-highlight" />
                    Certificados
                  </h3>
                  {professional.certificates && professional.certificates.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {professional.certificates.map((cert, index) => (
                        <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          {cert.file ? (
                            <a
                              href={cert.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={cert.file}
                                alt={cert.name || 'Certificado'}
                                className="w-full h-24 object-cover rounded mb-2"
                                onError={(e) => {
                                  // If image fails to load, show a document icon
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const icon = document.createElement('div');
                                    icon.className = 'w-full h-24 bg-muted rounded mb-2 flex items-center justify-center';
                                    icon.innerHTML = '<svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                                    parent.insertBefore(icon, target);
                                  }
                                }}
                              />
                              <p className="text-xs text-center text-muted-foreground truncate">
                                {cert.name || 'Certificado'}
                              </p>
                            </a>
                          ) : (
                            <div className="w-full h-24 bg-muted rounded mb-2 flex items-center justify-center">
                              <FileCheck className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum certificado informado</p>
                  )}
                </CardContent>
              </Card>

              {/* References - Only for highlighted */}
              {professional.isHighlighted && professional.references && professional.references.length > 0 && (
                <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gradient-highlight" />
                      Referências
                    </h2>
                    <div className="space-y-3">
                      {professional.references.map((ref, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">{ref.name}</span>
                          {ref.phone && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {ref.phone}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Area */}
              <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`} />
                    Área de Atendimento
                  </h3>
                  <p className="text-muted-foreground">{professional.serviceArea}</p>
                  {professional.isHighlighted && professional.serviceRadius && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Raio de atendimento</p>
                      <p className="text-xl font-bold text-gradient-highlight">{professional.serviceRadius} km</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <Badge variant="secondary">
                      {professional.availability === 'hospital' && 'Atende em Hospitais'}
                      {professional.availability === 'domicilio' && 'Atende em Domicílio'}
                      {professional.availability === 'ambos' && 'Hospital e Domicílio'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Hospitals - Only for highlighted or if has hospitals */}
              {professional.hospitals.length > 0 && (professional.isHighlighted || professional.availability !== 'domicilio') && (
                <Card className="animate-fade-in" style={{ animationDelay: '250ms' }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Building2 className={`w-5 h-5 ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`} />
                      Hospitais que Atende
                    </h3>
                    <ul className="space-y-2">
                      {professional.hospitals.map((hospital, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-success" />
                          {hospital}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Background Check */}
              <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className={`w-5 h-5 ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`} />
                    Segurança
                  </h3>
                  {professional.backgroundCheck && professional.isHighlighted ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Antecedentes criminais verificados
                      </span>
                    </div>
                  ) : professional.backgroundCheck ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">
                        Perfil verificado pela KUID+
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm">Verificação pendente</span>
                    </div>
                  )}
                  {professional.backgroundCheckFile && (
                    <div className="mt-3">
                      <a
                        href={professional.backgroundCheckFile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Ver documento de antecedentes (PDF)
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upgrade CTA for non-highlighted */}
              {!professional.isHighlighted && (
                <Card className="animate-fade-in gradient-highlight border-0" style={{ animationDelay: '350ms' }}>
                  <CardContent className="p-6 text-white text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Perfil em Destaque</h3>
                    <p className="text-sm text-white/80 mb-4">
                      Vídeo, referências, selo verificado e mais visibilidade!
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (user && ['cuidador', 'acompanhante', 'enfermeiro', 'tecnico'].includes(user.role)) {
                          navigate('/planos');
                        }
                      }}
                    >
                      Saiba mais
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Disclaimer Modal */}
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Aviso Importante
            </DialogTitle>
            <DialogDescription className="text-left pt-4">
              O contato é direto com o profissional.
              <br />
              <br />
              <strong>O KUID+ não intermedia serviços</strong> e não se
              responsabiliza pelos atendimentos realizados. Recomendamos que você
              verifique as credenciais do profissional antes de contratá-lo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowWhatsAppModal(false)}>
              Cancelar
            </Button>
            <Button onClick={openWhatsApp} className="gradient-highlight border-0">
              <MessageCircle className="mr-2 h-4 w-4" />
              Continuar para WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
