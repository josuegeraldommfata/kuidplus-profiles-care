import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { getFileUrl } from '@/lib/utils';
import { User, Edit, Upload, Save, BarChart3, Plus } from 'lucide-react';
import DashboardStats from '@/components/DashboardStats';
import ContractorMarketplaceSidebar from '@/components/ContractorMarketplaceSidebar';

interface UserData {
  id: number;
  email: string;
  name: string;
  surname: string;
  profile_image: string | null;
  whatsapp: string;
  city: string;
  state: string;
  role: string;
}

export default function DashboardContratante() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    whatsapp: '',
    city: '',
    state: '',
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    profession: '',
    city: '',
    state: '',
    budgetMin: '',
    budgetMax: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setUserData(response.data.user);
        setFormData({
          name: response.data.user.name || '',
          surname: response.data.user.surname || '',
          whatsapp: response.data.user.whatsapp || '',
          city: response.data.user.city || '',
          state: response.data.user.state || '',
        });
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

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const url = URL.createObjectURL(file);
      setProfilePhotoPreview(url);
    }
  };

  useEffect(() => {
    return () => {
      if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  const handleCreateProposal = async () => {
    try {
      const payload = {
        title: proposalForm.title,
        description: proposalForm.description,
        profession: proposalForm.profession,
        city: proposalForm.city,
        state: proposalForm.state,
        budgetMin: proposalForm.budgetMin || null,
        budgetMax: proposalForm.budgetMax || null,
      };

      const res = await api.post('/api/proposals', payload);
      if (res.status === 201) {
        alert('Proposta criada com sucesso! Abrindo chat...');
        setIsCreateModalOpen(false);
        navigate(`/chat?proposalId=${res.data.id}`);
      } else {
        alert('Erro ao criar proposta');
      }
    } catch (err) {
      alert('Erro ao criar proposta');
    }
  };

  const handleSave = async () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== undefined && v !== null) payload.append(k, String(v));
    });
    if (profilePhotoFile) payload.append('profile_image', profilePhotoFile);

    try {
      const response = await api.put(`/api/users/${user?.id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const updated = response.data.user;
        setUserData(updated);
        if (updateUser) {
          updateUser(updated);
        }
        alert('Perfil salvo com sucesso!');
        setIsEditModalOpen(false);
        setProfilePhotoPreview(null);
        setProfilePhotoFile(null);
      } else {
        alert('Erro ao salvar perfil.');
      }
    } catch (error) {
      alert('Erro ao salvar perfil.');
    }
  };

  if (!user) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <User className="w-12 h-12 text-destructive mx-auto mb-4" />
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

  if (loadingUser) {
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

  if (errorUser) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Erro ao carregar perfil</p>
            <p className="text-muted-foreground text-sm">{errorUser}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <ContractorMarketplaceSidebar />

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold">
                    Olá, <span className="text-gradient-highlight">{userData?.name || user?.name}</span>!
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie seus serviços e propostas
                  </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Proposta
                </Button>
              </div>

              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Criar Proposta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input value={proposalForm.title} onChange={(e) => setProposalForm(f => ({...f, title: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea value={proposalForm.description} onChange={(e) => setProposalForm(f => ({...f, description: e.target.value}))} rows={6} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Profissão</Label>
                        <Input value={proposalForm.profession} onChange={(e) => setProposalForm(f => ({...f, profession: e.target.value}))} />
                      </div>
                      <div>
                        <Label>Cidade</Label>
                        <Input value={proposalForm.city} onChange={(e) => setProposalForm(f => ({...f, city: e.target.value}))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Estado</Label>
                        <Input value={proposalForm.state} onChange={(e) => setProposalForm(f => ({...f, state: e.target.value}))} />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Orçamento mínimo</Label>
                          <Input type="number" value={proposalForm.budgetMin} onChange={(e) => setProposalForm(f => ({...f, budgetMin: e.target.value}))} />
                        </div>
                        <div className="flex-1">
                          <Label>Orçamento máximo</Label>
                          <Input type="number" value={proposalForm.budgetMax} onChange={(e) => setProposalForm(f => ({...f, budgetMax: e.target.value}))} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                      <Button onClick={handleCreateProposal} className="gradient-highlight border-0">Criar Proposta</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Tabs defaultValue="profile" className="mt-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Estatísticas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle className="text-lg text-center">Sua Foto de Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={
                            profilePhotoPreview ||
                            (userData?.profile_image
                              ? getFileUrl(userData.profile_image)
                              : '/placeholder.svg')
                          }
                          alt={userData?.name || 'Perfil'}
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Perfil
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Editar Perfil</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Foto de Perfil</Label>
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    profilePhotoPreview ||
                                    (userData?.profile_image
                                      ? getFileUrl(userData.profile_image)
                                      : '/placeholder.svg')
                                  }
                                  alt={userData?.name || 'Perfil'}
                                  className="w-16 h-16 rounded-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                                  }}
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
                                    <Button variant="outline" size="sm" asChild>
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

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="surname">Sobrenome</Label>
                                <Input
                                  id="surname"
                                  value={formData.surname}
                                  onChange={(e) => setFormData((f) => ({ ...f, surname: e.target.value }))}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="whatsapp">WhatsApp</Label>
                              <Input
                                id="whatsapp"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData((f) => ({ ...f, whatsapp: e.target.value }))}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input
                                  id="city"
                                  value={formData.city}
                                  onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state">Estado</Label>
                                <Input
                                  id="state"
                                  value={formData.state}
                                  onChange={(e) => setFormData((f) => ({ ...f, state: e.target.value }))}
                                />
                              </div>
                            </div>

                            <Button onClick={handleSave} className="w-full">
                              <Save className="mr-2 h-4 w-4" />
                              Salvar alterações
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats">
                  <DashboardStats type="contractor" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

