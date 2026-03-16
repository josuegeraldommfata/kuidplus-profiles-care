import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { getFileUrl } from '@/lib/utils';
import { Upload, Save, ArrowLeft, User, Phone, MapPin } from 'lucide-react';

export default function PerfilContratante() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    whatsapp: '',
    city: '',
    state: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name?.split(' ')[0] || '',
        surname: user.name?.split(' ').slice(1).join(' ') || '',
        whatsapp: (user as any).whatsapp || '',
        city: (user as any).city || '',
        state: (user as any).state || '',
      });

      if (user.profileImage) {
        setProfileImagePreview(getFileUrl(user.profileImage));
      }
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Arquivo muito grande',
          description: 'A imagem deve ter no máximo 5MB.',
          variant: 'destructive',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione uma imagem.',
          variant: 'destructive',
        });
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const data = new FormData();

      // Combine name and surname
      const fullName = `${formData.name} ${formData.surname}`.trim();
      data.append('name', fullName);
      data.append('whatsapp', formData.whatsapp);
      data.append('city', formData.city);
      data.append('state', formData.state);

      if (profileImage) {
        data.append('profile_image', profileImage);
      }

      const response = await api.put(`/api/users/${user.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local user state
      updateUser({
        name: fullName,
        whatsapp: formData.whatsapp,
        city: formData.city,
        state: formData.state,
        profileImage: response.data.profileImage,
      });

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });

      navigate('/dashboard-contratante');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.response?.data?.error || 'Erro ao atualizar perfil.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" onClick={() => navigate('/dashboard-contratante')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="space-y-4">
                  <Label>Foto de Perfil</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={profileImagePreview || '/placeholder.svg'}
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full object-cover border-2 border-border"
                      />
                      <label
                        htmlFor="profile-image"
                        className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Clique no ícone para alterar sua foto
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formatos aceitos: JPG, PNG. Máximo 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name and Surname */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Sobrenome</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Seu estado"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      'Salvando...'
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
