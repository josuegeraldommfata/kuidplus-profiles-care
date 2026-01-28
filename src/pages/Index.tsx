import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { StarRating } from '@/components/ui/StarRating';
import { getDisplayName, Professional } from '@/data/mockData';
import { getFileUrl } from '@/lib/utils';
import {
  Search,
  Shield,
  MessageCircle,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Play,
  MapPin,
  Eye,
  Check,
  Crown,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import api from '@/lib/api';

// Normaliza dados do backend (snake_case) para frontend (camelCase)
const normalizeProfessional = (p: any): Professional => {
  if (!p) return p;

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
    bio: p.bio,
    experienceYears: p.experience_years || p.experienceYears,
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
  } as Professional;
};

const Index = () => {
  const navigate = useNavigate();

  // Get highlighted professionals first, then others (from backend)
  const [highlightedProfessionals, setHighlightedProfessionals] = useState<Professional[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchHomeLists() {
      try {
        const hl = await api.get('/api/professionals', { params: { highlighted: true, limit: 5 } });
        const fe = await api.get('/api/professionals', { params: { highlighted: false, limit: 5 } });

        const hlItemsRaw = Array.isArray(hl.data) ? hl.data : Array.isArray(hl.data?.items) ? hl.data.items : [];
        const feItemsRaw = Array.isArray(fe.data) ? fe.data : Array.isArray(fe.data?.items) ? fe.data.items : [];

        // Normalize all items
        const hlItems = hlItemsRaw.map(normalizeProfessional).filter((p: Professional) => p && p.name);
        const feItems = feItemsRaw.map(normalizeProfessional).filter((p: Professional) => p && p.name);

        if (!cancelled) {
          setHighlightedProfessionals(hlItems);
          setFeaturedProfessionals(feItems);
        }
      } catch (err) {
        console.warn('Failed to load home professionals', err);
      }
    }

    fetchHomeLists();
    return () => { cancelled = true; };
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-highlight text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              KUIDD+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!!
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight text-gradient-highlight">
              Conectando Famílias a Acompanhantes Hospitalares, Cuidadores, Técnicos de Enfermagem e Enfermeiros verificados e de Excelência
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              A plataforma que facilita o encontro entre famílias e profissionais
              qualificadas de cuidados. Segurança, transparência e qualidade em cada conexão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 gradient-highlight border-0"
                onClick={() => navigate('/buscar')}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Profissionais
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                onClick={() => navigate('/cadastro')}
              >
                Sou Profissional
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - KUID+ Presentation */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-gradient-highlight">Conheça o KUIDD+</span>
              </h2>
              <p className="text-muted-foreground">
                Veja como funciona nossa plataforma e os benefícios para profissionais e famílias
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center relative">
              {/* video with poster and overlay if browser can't render video frames */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover bg-black"
                controls
                playsInline
                autoPlay
                muted
                preload="metadata"
                src="/video/kuidd-plus-web.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Por que escolher o <span className="text-gradient-highlight">KUIDD+</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Profissionais Verificados',
                description:
                  'Todos os profissionais têm antecedentes criminais verificados e documentação conferida.',
              },
              {
                icon: MessageCircle,
                title: 'Contato Direto',
                description:
                  'Fale diretamente com o profissional via WhatsApp. Sem intermediários, sem taxas.',
              },
              {
                icon: Users,
                title: 'Perfis Completos',
                description:
                  'Veja formações, experiência, avaliações e vídeos de apresentação antes de escolher.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl gradient-highlight flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Professionals */}
      {highlightedProfessionals.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gradient-highlight text-white text-xs font-medium mb-2">
                  <Sparkles className="w-3 h-3" />
                  EM DESTAQUE
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Profissionais em <span className="text-gradient-highlight">Destaque</span>
                </h2>
                <p className="text-muted-foreground mt-1">
                  Perfis completos com vídeo, referências e selo de verificação
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/buscar')}>
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {highlightedProfessionals.map((professional, index) => (
                <Card
                  key={professional.id}
                  className="overflow-hidden hover:shadow-highlight transition-all cursor-pointer group animate-fade-in-up card-highlighted"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/profissional/${professional.id}`)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={professional.profileImage}
                      alt={professional.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                      <div className="px-2 py-1 rounded-full gradient-highlight text-white text-[10px] font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Destaque
                      </div>
                      {professional.videoUrl && (
                        <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {professional.backgroundCheck && (
                      <div className="absolute bottom-2 left-2 bg-success text-success-foreground px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verificado
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">{professional.name}</h3>
                    <p className="text-xs text-gradient-highlight font-medium">{professional.profession}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">
                        {professional.city}, {professional.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <StarRating
                        rating={professional.rating}
                        totalRatings={professional.totalRatings}
                        size="sm"
                        showCount={false}
                      />
                      <span className="text-xs font-medium">
                        R$ {professional?.priceRange?.min ?? '--'}–{professional?.priceRange?.max ?? '--'}
                      </span>
                    </div>
                    {professional.highlightPhrase && (
                      <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 italic">
                        {professional.highlightPhrase}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {professional.weeklyViews} acessos esta semana
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Featured Professionals */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Profissionais Disponíveis
              </h2>
              <p className="text-muted-foreground">
                Cuidadores prontos para atender
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/buscar')}>
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredProfessionals.map((professional, index) => (
              <Card
                key={professional.id}
                className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group animate-fade-in-up ${
                  professional.isHighlighted ? 'card-highlighted' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/profissional/${professional.id}`)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={professional.profileImage}
                    alt={getDisplayName(professional.name, professional.isHighlighted)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {professional.isHighlighted && (
                    <div className="absolute top-2 left-2">
                      <div className="px-2 py-1 rounded-full gradient-highlight text-white text-[10px] font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Destaque
                      </div>
                    </div>
                  )}
                  {professional.backgroundCheck && professional.isHighlighted && (
                    <div className="absolute bottom-2 left-2 bg-success text-success-foreground px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verificado
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm truncate">
                    {getDisplayName(professional.name, professional.isHighlighted)}
                  </h3>
                  <p className={`text-xs font-medium ${professional.isHighlighted ? 'text-gradient-highlight' : 'text-primary'}`}>
                    {professional.profession}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {professional.city}, {professional.region}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating
                      rating={professional.rating}
                      totalRatings={professional.totalRatings}
                      size="sm"
                      showCount={false}
                    />
                    <span className="text-xs font-medium">
                      R$ {professional?.priceRange?.min ?? '--'}–{professional?.priceRange?.max ?? '--'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-highlight text-white text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              PLANOS PARA PROFISSIONAIS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Destaque seu perfil e <span className="text-gradient-highlight">conquiste mais clientes</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Todos os profissionais começam com 7 dias de acesso completo grátis.
              Após o período de trial, escolha o plano ideal para continuar em destaque.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Plano Mensal</h3>
                  <p className="text-muted-foreground text-sm">Flexibilidade total</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gradient-highlight">R$ 39,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Estatísticas de visualização',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => navigate('/cadastro?plano=mensal')}
                >
                  Começar 7 dias grátis
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="relative overflow-hidden border-2 border-primary shadow-highlight">
              <div className="absolute top-0 right-0 px-4 py-1 gradient-highlight text-white text-xs font-medium rounded-bl-lg">
                MAIS ECONOMIA
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Plano Trimestral</h3>
                  <p className="text-muted-foreground text-sm">Melhor custo-benefício</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gradient-highlight">R$ 99,90</span>
                  <span className="text-muted-foreground">/trimestre</span>
                  <p className="text-sm text-primary font-medium mt-1">Economia de R$ 19,80</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Tudo do plano mensal',
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Prioridade máxima no ranking',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gradient-highlight border-0"
                  onClick={() => navigate('/cadastro?plano=trimestral')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Começar 7 dias grátis
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            ✨ Todos os planos incluem 7 dias de trial grátis. Após o período, assine para continuar com acesso completo.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <Card className="gradient-highlight border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                É profissional de saúde?
              </h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Cadastre-se gratuitamente e divulgue seus serviços para milhares de
                famílias em busca de cuidadores qualificados. Perfil FREE disponível!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base"
                  onClick={() => navigate('/cadastro')}
                >
                  Criar perfil FREE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => navigate('/cadastro?destaque=1')}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Quero ser Destaque
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Login Demo Info */}
      <section className="py-8 bg-muted/50">
        <div className="container">
          <Card className="border-dashed">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">
                🔐 Contas de Demonstração
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Enfermeiro(a)</p>
                  <p className="text-muted-foreground text-xs">enfermeiro@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Técnico(a)</p>
                  <p className="text-muted-foreground text-xs">tecnico@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Cuidador(a)</p>
                  <p className="text-muted-foreground text-xs">cuidador@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Acompanhante</p>
                  <p className="text-muted-foreground text-xs">acompanhante@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Contratante</p>
                  <p className="text-muted-foreground text-xs">contratante@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-gradient-highlight">Admin</p>
                  <p className="text-muted-foreground text-xs">admin@kuid.com</p>
                  <p className="text-muted-foreground text-xs">Senha: 123456</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
