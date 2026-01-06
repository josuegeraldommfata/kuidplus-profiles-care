import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { StarRating } from '@/components/ui/StarRating';
import { mockProfessionals, getDisplayName, calculateAge } from '@/data/mockData';
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
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Get highlighted professionals first, then others
  const highlightedProfessionals = mockProfessionals
    .filter((p) => p.status === 'approved' && p.isHighlighted)
    .slice(0, 5);
  
  const featuredProfessionals = mockProfessionals
    .filter((p) => p.status === 'approved')
    .slice(0, 5);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-highlight text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              KUID+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!
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
                <span className="text-gradient-highlight">Conheça o KUID+</span>
              </h2>
              <p className="text-muted-foreground">
                Veja como funciona nossa plataforma e os benefícios para profissionais e famílias
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full gradient-highlight flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-muted-foreground">
                  Vídeo de apresentação da KUID+ (em breve)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Por que escolher o <span className="text-gradient-highlight">KUID+</span>?
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
                        R$ {professional.priceRange.min}–{professional.priceRange.max}
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
                      R$ {professional.priceRange.min}–{professional.priceRange.max}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
