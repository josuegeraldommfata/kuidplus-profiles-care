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
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  // Get highlighted professionals first, then others (from backend)
  const [highlightedProfessionals, setHighlightedProfessionals] = useState<Professional[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);

  // Plans for home pricing display
  const [plansList, setPlansList] = useState<any[]>([]);
  const [contratantePlanApi, setContratantePlanApi] = useState<any | null>(null);

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

    async function fetchPlansHome() {
      try {
        const res = await api.get('/api/payments/plans');
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) {
          setPlansList(list);
          const cp = list.find((p: any) =>
            (p.name || '').toString().toLowerCase().includes('contratante') ||
            (p.name || '').toString().toLowerCase().includes('familiar') ||
            (p.name || '').toString().toLowerCase().includes('family')
          );
          setContratantePlanApi(cp || null);
          console.log('Home plans:', list, 'contratantePlanApi:', cp);
        }
      } catch (err) {
        console.warn('Failed to load plans for home', err);
      }
    }

    fetchHomeLists();
    fetchPlansHome();
    return () => { cancelled = true; };
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div className="container relative">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="w-4 h-4" />
              KUIDD+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!!
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-balance leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Conectando Famílias a Acompanhantes Hospitalares, Cuidadores, Técnicos de Enfermagem e Enfermeiros verificados e de Excelência
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
              A plataforma que facilita o encontro entre famílias e profissionais
              qualificadas de cuidados. Segurança, transparência e qualidade em cada conexão.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate('/buscar')}
              >
                <Search className="mr-3 h-6 w-6" />
                Buscar Profissionais
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-4 border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate('/cadastro')}
              >
                Sou Profissional
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - KUID+ Presentation */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Conheça o KUIDD+</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Veja como funciona nossa plataforma e os benefícios para profissionais e famílias
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
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
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Por que escolher o <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">KUIDD+</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Profissionais Verificados',
                description: 'Todos os profissionais têm antecedentes criminais verificados e documentação conferida.',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: MessageCircle,
                title: 'Contato Direto',
                description: 'Fale diretamente com o profissional via WhatsApp. Sem intermediários, sem taxas.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Users,
                title: 'Perfis Completos',
                description: 'Veja formações, experiência, avaliações e vídeos de apresentação antes de escolher.',
                color: 'from-purple-500 to-pink-600'
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
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
                      src={getFileUrl(professional.profileImage)}
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
                    src={getFileUrl(professional.profileImage)}
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
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium mb-6 shadow-lg">
              <Crown className="w-4 h-4" />
              NOSSOS PLANOS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Escolha o plano ideal para <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">você</span>
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Planos para profissionais e familiares. Todos começam com 7 dias de acesso completo grátis!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contratante (Familiar) Plan */}
            <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 rounded-3xl">
              <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-bl-2xl shadow-lg">
                PARA FAMÍLIAS
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Contratante</h3>
                  <p className="text-slate-600 text-base">Para famílias que buscam cuidadores</p>
                </div>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-4">
                    <span className="text-base text-emerald-700 font-semibold">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {contratantePlanApi ? `R$ ${Number(contratantePlanApi.price).toFixed(2).replace('.', ',')}` : 'R$29,90'}
                  </span>
                  <span className="text-slate-500 text-lg">/mês</span>
                  <p className="text-sm text-slate-500 mt-2">Renovação automática mensal</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Acesso a todos os perfis',
                    'Contato direto via WhatsApp',
                    'Visualizar vídeos de apresentação',
                    'Ver certificados e diplomas',
                    'Filtros avançados de busca',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-base">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => {
                    if (contratantePlanApi && user) {
                      navigate('/planos');
                    } else {
                      navigate('/cadastro-contratante');
                    }
                  }}
                >
                  <Heart className="mr-3 h-5 w-5" />
                  Começar 7 dias grátis
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan (Profissionais) */}
            <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 rounded-3xl ring-2 ring-blue-500/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Profissional Mensal</h3>
                  <p className="text-slate-600 text-base">Flexibilidade total</p>
                </div>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4">
                    <span className="text-base text-blue-700 font-semibold">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">R$ 39,90</span>
                  <span className="text-slate-500 text-lg">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Estatísticas de visualização',
                    'Suporte prioritário',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-base">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate('/cadastro?plano=mensal')}
                >
                  Começar 7 dias grátis
                </Button>
              </CardContent>
            </Card>

            {/* Trimestral Plan */}
            <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 rounded-3xl">
              <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium rounded-bl-2xl shadow-lg">
                MAIS ECONOMIA
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Profissional Trimestral</h3>
                  <p className="text-slate-600 text-base">Melhor custo-benefício</p>
                </div>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
                    <span className="text-base text-purple-700 font-semibold">🎉 7 dias GRÁTIS</span>
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">R$ 99,90</span>
                  <span className="text-slate-500 text-lg">/trimestre</span>
                  <p className="text-base text-purple-600 font-semibold mt-2">Economia de R$ 19,80</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Tudo do plano mensal',
                    'Perfil em destaque nas buscas',
                    'Selo de verificação',
                    'Vídeo de apresentação',
                    'Referências profissionais',
                    'Prioridade máxima no ranking',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-base">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate('/cadastro?plano=trimestral')}
                >
                  <Sparkles className="mr-3 h-5 w-5" />
                  Começar 7 dias grátis
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-slate-600 text-base mt-12">
            ✨ Todos os planos incluem 7 dias de trial grátis. Após o período, a cobrança é feita automaticamente.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                É profissional de saúde?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Cadastre-se gratuitamente e divulgue seus serviços para milhares de
                famílias em busca de cuidadores qualificados. Perfil FREE disponível!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 bg-white text-slate-800 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate('/cadastro')}
                >
                  Criar perfil FREE
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate('/cadastro?destaque=1')}
                >
                  <Sparkles className="mr-3 h-5 w-5" />
                  Quero ser Destaque
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Login Demo Info */}

    </Layout>
  );
};

export default Index;
