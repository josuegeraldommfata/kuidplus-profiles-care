import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Target } from 'lucide-react';

export default function Sobre() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre o <span className="text-primary">KUIDD+</span>
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                KUIDD+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!!
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
                <p className="text-muted-foreground mb-4">
                  O KUIDD+ nasceu da necessidade de tornar mais fácil e seguro
                  encontrar profissionais de saúde para cuidados domiciliares e
                  acompanhamento hospitalar.
                </p>
                <p className="text-muted-foreground mb-4">
                  Acreditamos que todos merecem acesso a cuidadores qualificados,
                  e que profissionais de saúde merecem uma plataforma que valorize
                  seu trabalho e os conecte diretamente com quem precisa de seus
                  serviços.
                </p>
                <p className="text-muted-foreground">
                  Nossa missão é simplificar essa conexão, garantindo
                  transparência, segurança e qualidade no atendimento.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Heart,
                    title: 'Cuidado',
                    description: 'Foco no bem-estar do paciente',
                  },
                  {
                    icon: Shield,
                    title: 'Segurança',
                    description: 'Profissionais verificados',
                  },
                  {
                    icon: Users,
                    title: 'Conexão',
                    description: 'Contato direto e transparente',
                  },
                  {
                    icon: Target,
                    title: 'Qualidade',
                    description: 'Profissionais qualificados',
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3">
                        <item.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como Funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Busque Profissionais',
                  description:
                    'Use nossos filtros para encontrar cuidadores na sua região, com a qualificação e faixa de preço que você precisa.',
                },
                {
                  step: '02',
                  title: 'Veja os Perfis',
                  description:
                    'Analise formações, experiência, avaliações e vídeos de apresentação. Escolha com confiança.',
                },
                {
                  step: '03',
                  title: 'Entre em Contato',
                  description:
                    'Fale diretamente com o profissional via WhatsApp. Sem intermediários, sem complicação.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Aviso Importante</h2>
                <p className="text-muted-foreground mb-4">
                  O KUIDD+ é uma plataforma de exibição de perfis profissionais.
                </p>
                <p className="text-muted-foreground font-medium">
                  <strong>Não intermediamos serviços</strong>, não realizamos
                  contratações e não nos responsabilizamos pelos atendimentos
                  realizados. O contato e a negociação são feitos diretamente
                  entre o contratante e o profissional.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
