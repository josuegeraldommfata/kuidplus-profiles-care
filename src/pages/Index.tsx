import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { StarRating } from '@/components/ui/StarRating';
import { mockProfessionals } from '@/data/mockData';
import {
  Search,
  Shield,
  MessageCircle,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const featuredProfessionals = mockProfessionals
    .filter((p) => p.status === 'approved')
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Cuidado profissional para quem você ama
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Encontre cuidadores de saúde{' '}
              <span className="text-primary">qualificados</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Conectamos famílias a enfermeiros e técnicos de enfermagem
              verificados. Contato direto via WhatsApp, sem intermediários.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8"
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

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Por que escolher o KUID+?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Profissionais Verificados',
                description:
                  'Todos os cuidadores têm antecedentes criminais verificados e documentação conferida.',
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
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Profissionais em Destaque
              </h2>
              <p className="text-muted-foreground">
                Cuidadores bem avaliados prontos para atender
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/buscar')}>
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProfessionals.map((professional, index) => (
              <Card
                key={professional.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/profissional/${professional.id}`)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={professional.profileImage}
                    alt={professional.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {professional.backgroundCheck && (
                      <div className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verificado
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{professional.name}</h3>
                      <p className="text-sm text-primary">{professional.profession}</p>
                    </div>
                    <StarRating
                      rating={professional.rating}
                      totalRatings={professional.totalRatings}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {professional.city}, {professional.state} •{' '}
                    {professional.experienceYears} anos exp.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      R$ {professional.priceRange.min}–{professional.priceRange.max}
                      <span className="text-muted-foreground font-normal">
                        {' '}
                        / plantão 12h
                      </span>
                    </span>
                    <Button size="sm" variant="ghost" className="text-primary">
                      Ver perfil
                    </Button>
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
          <Card className="gradient-primary border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                É profissional de saúde?
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
                Cadastre-se gratuitamente e divulgue seus serviços para milhares de
                famílias em busca de cuidadores qualificados.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-base"
                onClick={() => navigate('/cadastro')}
              >
                Criar meu perfil
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-primary">Enfermeiro(a)</p>
                  <p className="text-muted-foreground">enfermeiro@kuid.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-primary">Técnico(a)</p>
                  <p className="text-muted-foreground">tecnico@kuid.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-primary">Contratante</p>
                  <p className="text-muted-foreground">contratante@kuid.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-medium text-primary">Admin</p>
                  <p className="text-muted-foreground">admin@kuid.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
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
