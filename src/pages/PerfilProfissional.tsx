import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/StarRating';
import { mockProfessionals } from '@/data/mockData';
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
} from 'lucide-react';

export default function PerfilProfissional() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const professional = mockProfessionals.find((p) => p.id === id);

  if (!professional) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
          <Button onClick={() => navigate('/buscar')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para busca
          </Button>
        </div>
      </Layout>
    );
  }

  const handleWhatsAppClick = () => {
    const hasSeenDisclaimer = localStorage.getItem('kuid_whatsapp_disclaimer');
    if (hasSeenDisclaimer) {
      openWhatsApp();
    } else {
      setShowWhatsAppModal(true);
    }
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
              <Card className="overflow-hidden animate-fade-in">
                <div className="md:flex">
                  <div className="md:w-64 md:shrink-0">
                    <img
                      src={professional.profileImage}
                      alt={professional.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl font-bold">{professional.name}</h1>
                        <p className="text-primary font-medium">
                          {professional.profession}
                        </p>
                      </div>
                      {professional.backgroundCheck && (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {professional.city}, {professional.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {professional.experienceYears} anos de experiência
                      </span>
                    </div>

                    <StarRating
                      rating={professional.rating}
                      totalRatings={professional.totalRatings}
                      size="lg"
                      className="mb-4"
                    />

                    <div className="p-4 bg-muted/50 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Valor por plantão de 12h
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        R$ {professional.priceRange.min} – R${' '}
                        {professional.priceRange.max}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full md:w-auto"
                      onClick={handleWhatsAppClick}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Entrar em contato via WhatsApp
                    </Button>
                  </CardContent>
                </div>
              </Card>

              {/* Bio */}
              <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Sobre mim</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {professional.bio}
                  </p>
                </CardContent>
              </Card>

              {/* Courses & Certificates */}
              <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Formações e Cursos
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {professional.courses.map((course, index) => (
                      <Badge key={index} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    Certificados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.certificates.map((cert, index) => (
                      <Badge key={index} variant="outline">
                        {cert.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Area */}
              <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Área de Atendimento
                  </h3>
                  <p className="text-muted-foreground">{professional.serviceArea}</p>
                </CardContent>
              </Card>

              {/* Hospitals */}
              <Card className="animate-fade-in" style={{ animationDelay: '250ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
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

              {/* Background Check */}
              <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Segurança
                  </h3>
                  {professional.backgroundCheck ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">
                        Antecedentes criminais verificados
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm">Verificação pendente</span>
                    </div>
                  )}
                </CardContent>
              </Card>
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
            <Button onClick={openWhatsApp}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Continuar para WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
