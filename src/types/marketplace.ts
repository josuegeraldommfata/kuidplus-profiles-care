// Marketplace types for services, proposals, chat, reviews, and notifications

export type ServiceStatus =
  | 'aberto'
  | 'recebendo_propostas'
  | 'em_negociacao'
  | 'profissional_selecionado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export type ProposalStatus = 'enviada' | 'aceita' | 'recusada' | 'em_negociacao';

export type ProfessionType =
  | 'Enfermeiro(a)'
  | 'Técnico(a) de Enfermagem'
  | 'Cuidador(a)'
  | 'Fisioterapeuta';

export interface Service {
  id: string;
  title: string;
  description: string;
  professionType: ProfessionType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  state: string;
  offeredValue?: number;
  negotiable: boolean;
  urgent: boolean;
  status: ServiceStatus;
  contractorId: string;
  contractorName: string;
  createdAt: string;
  proposals: Proposal[];
  selectedProfessionalId?: string;
}

export interface Proposal {
  id: string;
  serviceId: string;
  professionalId: string;
  professionalName: string;
  professionalImage?: string;
  profession: string;
  rating: number;
  totalRatings: number;
  proposedValue: number;
  message: string;
  available: boolean;
  status: ProposalStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  serviceId: string;
  serviceTitle: string;
  participantId: string;
  participantName: string;
  participantImage?: string;
  participantRole: 'contratante' | 'profissional';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  serviceTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerImage?: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'nova_proposta' | 'proposta_aceita' | 'nova_mensagem' | 'servico_iniciado' | 'servico_concluido' | 'nova_avaliacao';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  aberto: 'Aberto',
  recebendo_propostas: 'Recebendo Propostas',
  em_negociacao: 'Em Negociação',
  profissional_selecionado: 'Profissional Selecionado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, string> = {
  aberto: 'bg-emerald-100 text-emerald-800',
  recebendo_propostas: 'bg-blue-100 text-blue-800',
  em_negociacao: 'bg-amber-100 text-amber-800',
  profissional_selecionado: 'bg-purple-100 text-purple-800',
  em_andamento: 'bg-cyan-100 text-cyan-800',
  concluido: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  em_negociacao: 'Em Negociação',
};

export const NOTIFICATION_TYPE_LABELS: Record<Notification['type'], string> = {
  nova_proposta: 'Nova Proposta',
  proposta_aceita: 'Proposta Aceita',
  nova_mensagem: 'Nova Mensagem',
  servico_iniciado: 'Serviço Iniciado',
  servico_concluido: 'Serviço Concluído',
  nova_avaliacao: 'Nova Avaliação',
};
