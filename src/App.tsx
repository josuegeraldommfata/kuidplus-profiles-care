import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import SubscriptionPrompt from "@/components/ui/SubscriptionPrompt";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EscolhaTipoCadastro from "./pages/EscolhaTipoCadastro";
import CadastroContratante from "./pages/CadastroContratante";
import ConfirmEmail from "./pages/ConfirmEmail";
import Buscar from "./pages/Buscar";
import PerfilProfissional from "./pages/PerfilProfissional";
import DashboardProfissional from "./pages/DashboardProfissional";
import DashboardContratante from "./pages/DashboardContratante";
import PerfilContratante from "./pages/PerfilContratante";
import DashboardAdmin from "./pages/DashboardAdmin";
import Sobre from "./pages/Sobre";
import TermosProfissionais from "./pages/TermosProfissionais";
import TermosContratantes from "./pages/TermosContratantes";
import Privacidade from "./pages/Privacidade";
import NotFound from "./pages/NotFound";
import Planos from "./pages/Planos";
import MercadoPagoKeys from "./pages/MercadoPagoKeys";

// Marketplace pages
import PostarServico from "./pages/marketplace/PostarServico";
import ServicosDisponiveis from "./pages/marketplace/ServicosDisponiveis";
import ServicoDetalhes from "./pages/marketplace/ServicoDetalhes";
import DashboardProfissionalMarketplace from "./pages/marketplace/DashboardProfissionalMarketplace";
import DashboardContratanteMarketplace from "./pages/marketplace/DashboardContratanteMarketplace";
import ChatPage from "./pages/marketplace/ChatPage";
import ProcurarTurnos from "./pages/marketplace/ProcurarTurnos";
import Mensagens from "./pages/Mensagens";
import DashboardProfissionalAgenda from "./pages/DashboardProfissionalAgenda";
import MarketplaceMeusServicos from "./pages/marketplace/MeusServicos";

// ✅ TODAS PÁGINAS NOVAS
import MinhasPropostas from "./pages/dashboard/profissional/MinhasPropostas";
import Historico from "./pages/dashboard/profissional/Historico";
import ServicosAceitos from "./pages/dashboard/profissional/ServicosAceitos";
import PropostasRecebidas from "./pages/dashboard/contratante/PropostasRecebidas";
import ServicosContratados from "./pages/dashboard/contratante/ServicosContratados";
import HistoricoContratante from "./pages/dashboard/contratante/Historico";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MarketplaceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <SubscriptionPrompt />

              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/escolha-tipo-cadastro" element={<EscolhaTipoCadastro />} />
                <Route path="/cadastro-contratante" element={<CadastroContratante />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/buscar" element={<Buscar />} />

                <Route path="/profissional/me" element={<PerfilProfissional />} />
                <Route path="/profissional/:id" element={<PerfilProfissional />} />

                <Route path="/dashboard-profissional" element={<DashboardProfissional />} />
                <Route path="/dashboard-contratante" element={<DashboardContratante />} />
                <Route path="/perfil-contratante" element={<PerfilContratante />} />

                <Route path="/admin" element={<DashboardAdmin />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />

                {/* Marketplace & Dashboard routes */}
                <Route path="/dashboard/contratante/postar-servico" element={<PostarServico />} />
                <Route path="/dashboard/contratante/meus-servicos" element={<MarketplaceMeusServicos />} />
                <Route path="/dashboard/contratante/meus-servicos/:id" element={<ServicoDetalhes />} />
                <Route path="/dashboard/contratante/marketplace" element={<DashboardContratanteMarketplace />} />

                {/* ✅ PÁGINAS CONTRATANTE - 404 RESOLVIDO */}
                <Route path="/dashboard/contratante/propostas-recebidas" element={<PropostasRecebidas />} />
                <Route path="/dashboard/contratante/servicos-contratados" element={<ServicosContratados />} />
                <Route path="/dashboard/contratante/historico" element={<HistoricoContratante />} />

                <Route path="/dashboard/profissional/procurar-turnos" element={<ProcurarTurnos />} />
                <Route path="/dashboard/profissional/servicos-disponiveis" element={<ServicosDisponiveis />} />
                <Route path="/dashboard/profissional/servicos-aceitos" element={<ServicosAceitos />} />

                <Route path="/dashboard/profissional/minhas-propostas" element={<MinhasPropostas />} />
                <Route path="/dashboard/profissional/historico" element={<Historico />} />
                <Route path="/dashboard/profissional/agenda" element={<DashboardProfissionalAgenda />} />
                <Route path="/dashboard/profissional/marketplace" element={<DashboardProfissionalMarketplace />} />

                <Route path="/dashboard/mensagens" element={<Mensagens />} />
                <Route path="/dashboard/chat" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:conversationId" element={<ChatPage />} />

                <Route path="/sobre" element={<Sobre />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/planos/:tipo" element={<Planos />} />
                <Route path="/mercadopago-keys" element={<MercadoPagoKeys />} />
                <Route path="/termos-profissionais" element={<TermosProfissionais />} />
                <Route path="/termos-contratantes" element={<TermosContratantes />} />
                <Route path="/privacidade" element={<Privacidade />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </MarketplaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

