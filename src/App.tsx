import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Buscar from "./pages/Buscar";
import PerfilProfissional from "./pages/PerfilProfissional";
import DashboardProfissional from "./pages/DashboardProfissional";
import DashboardAdmin from "./pages/DashboardAdmin";
import Sobre from "./pages/Sobre";
import TermosProfissionais from "./pages/TermosProfissionais";
import TermosContratantes from "./pages/TermosContratantes";
import Privacidade from "./pages/Privacidade";
import NotFound from "./pages/NotFound";
import Planos from "./pages/Planos";
import MercadoPagoKeys from "./pages/MercadoPagoKeys";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/profissional/:id" element={<PerfilProfissional />} />
            <Route path="/profissional" element={<DashboardProfissional />} />
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/mercadopago-keys" element={<MercadoPagoKeys />} />
            <Route path="/termos-profissionais" element={<TermosProfissionais />} />
            <Route path="/termos-contratantes" element={<TermosContratantes />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
