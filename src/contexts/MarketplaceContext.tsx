import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  Service, Proposal, Conversation, Message, Review, Notification,
  ServiceStatus, ProposalStatus,
} from '@/types/marketplace';

interface MarketplaceContextType {
  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'proposals' | 'status'>) => Service;
  updateServiceStatus: (serviceId: string, status: ServiceStatus) => void;
  getServiceById: (id: string) => Service | undefined;
  getServicesByContractor: (contractorId: string) => Service[];
  getAvailableServices: () => Service[];

  // Proposals
  addProposal: (serviceId: string, proposal: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => void;
  updateProposalStatus: (serviceId: string, proposalId: string, status: ProposalStatus) => void;
  getProposalsByProfessional: (professionalId: string) => { service: Service; proposal: Proposal }[];

  // Chat
  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  getConversationsByUser: (userId: string) => Conversation[];
  startConversation: (data: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageAt' | 'unreadCount'>) => Conversation;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviewsByProfessional: (professionalId: string) => Review[];

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 15);

// Demo data
const DEMO_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Cuidador para idoso – turno noturno',
    description: 'Preciso de um cuidador(a) experiente para acompanhar meu pai durante a noite. Ele tem Alzheimer em estágio moderado e precisa de supervisão constante.',
    professionType: 'Cuidador(a)',
    date: '2026-03-20',
    startTime: '19:00',
    endTime: '07:00',
    location: 'Rua das Flores, 123 - Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    offeredValue: 250,
    negotiable: true,
    urgent: false,
    status: 'aberto',
    contractorId: 'c1',
    contractorName: 'Roberto Almeida',
    createdAt: '2026-03-15T10:00:00Z',
    proposals: [],
  },
  {
    id: 's2',
    title: 'Enfermeiro(a) para aplicação de medicação',
    description: 'Necessito de enfermeiro(a) para aplicar medicação intravenosa em paciente domiciliar. Será necessário por 5 dias consecutivos.',
    professionType: 'Enfermeiro(a)',
    date: '2026-03-18',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Av. Brasil, 500 - Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    offeredValue: 180,
    negotiable: false,
    urgent: true,
    status: 'aberto',
    contractorId: 'c2',
    contractorName: 'Mariana Costa',
    createdAt: '2026-03-14T14:30:00Z',
    proposals: [],
  },
  {
    id: 's3',
    title: 'Fisioterapeuta domiciliar – pós-operatório',
    description: 'Paciente em recuperação de cirurgia no joelho precisa de sessões de fisioterapia domiciliar 3x por semana.',
    professionType: 'Fisioterapeuta',
    date: '2026-03-22',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Rua Harmonia, 45 - Vila Madalena',
    city: 'São Paulo',
    state: 'SP',
    offeredValue: 200,
    negotiable: true,
    urgent: false,
    status: 'recebendo_propostas',
    contractorId: 'c1',
    contractorName: 'Roberto Almeida',
    createdAt: '2026-03-13T09:00:00Z',
    proposals: [
      {
        id: 'p1',
        serviceId: 's3',
        professionalId: 'prof1',
        professionalName: 'Dr. Carlos Mendes',
        professionalImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
        profession: 'Fisioterapeuta',
        rating: 4.8,
        totalRatings: 23,
        proposedValue: 220,
        message: 'Tenho 8 anos de experiência em reabilitação pós-cirúrgica. Posso iniciar imediatamente.',
        available: true,
        status: 'enviada',
        createdAt: '2026-03-14T11:00:00Z',
      },
    ],
  },
];

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(DEMO_SERVICES);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'nova_proposta',
      title: 'Nova proposta recebida',
      message: 'Dr. Carlos Mendes enviou uma proposta para "Fisioterapeuta domiciliar"',
      read: false,
      createdAt: '2026-03-14T11:00:00Z',
      linkTo: '/dashboard/contratante/meus-servicos/s3',
    },
  ]);

  const addService = useCallback((data: Omit<Service, 'id' | 'createdAt' | 'proposals' | 'status'>) => {
    const newService: Service = {
      ...data,
      id: generateId(),
      status: 'aberto',
      proposals: [],
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [newService, ...prev]);

    return newService;
  }, []);

  const updateServiceStatus = useCallback((serviceId: string, status: ServiceStatus) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status } : s));
  }, []);

  const getServiceById = useCallback((id: string) => services.find(s => s.id === id), [services]);

  const getServicesByContractor = useCallback((contractorId: string) =>
    services.filter(s => s.contractorId === contractorId), [services]);

  const getAvailableServices = useCallback(() =>
    services.filter(s => s.status === 'aberto' || s.status === 'recebendo_propostas'), [services]);

  const addProposal = useCallback((serviceId: string, proposal: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: generateId(),
      status: 'enviada',
      createdAt: new Date().toISOString(),
    };
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          status: 'recebendo_propostas' as ServiceStatus,
          proposals: [...s.proposals, newProposal],
        };
      }
      return s;
    }));

    // Notification for contractor
    addNotification({
      type: 'nova_proposta',
      title: 'Nova proposta recebida',
      message: `${proposal.professionalName} enviou uma proposta`,
      linkTo: `/dashboard/contratante/meus-servicos/${serviceId}`,
    });
  }, []);

  const updateProposalStatus = useCallback((serviceId: string, proposalId: string, status: ProposalStatus) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const updatedProposals = s.proposals.map(p =>
          p.id === proposalId ? { ...p, status } : p
        );
        let newServiceStatus = s.status;
        if (status === 'aceita') {
          newServiceStatus = 'profissional_selecionado';
          // Reject other proposals
          updatedProposals.forEach(p => {
            if (p.id !== proposalId && p.status === 'enviada') p.status = 'recusada';
          });
        }
        return { ...s, proposals: updatedProposals, status: newServiceStatus };
      }
      return s;
    }));

    if (status === 'aceita') {
      addNotification({
        type: 'proposta_aceita',
        title: 'Proposta aceita!',
        message: 'Sua proposta foi aceita pelo contratante',
      });
    }
  }, []);

  const getProposalsByProfessional = useCallback((professionalId: string) => {
    const results: { service: Service; proposal: Proposal }[] = [];
    services.forEach(s => {
      s.proposals.forEach(p => {
        if (p.professionalId === professionalId) {
          results.push({ service: s, proposal: p });
        }
      });
    });
    return results;
  }, [services]);

  // Chat
  const startConversation = useCallback((data: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageAt' | 'unreadCount'>) => {
    const existing = conversations.find(c => c.serviceId === data.serviceId && c.participantId === data.participantId);
    if (existing) return existing;

    const newConv: Conversation = {
      ...data,
      id: generateId(),
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };
    setConversations(prev => [newConv, ...prev]);
    return newConv;
  }, [conversations]);

  const getConversation = useCallback((id: string) => conversations.find(c => c.id === id), [conversations]);

  const getConversationsByUser = useCallback((userId: string) =>
    conversations.filter(c => c.participantId === userId || c.serviceId), [conversations]);

  const sendMessage = useCallback((conversationId: string, msg: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: Message = {
      ...msg,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));
    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, lastMessage: msg.content, lastMessageAt: newMsg.createdAt } : c
    ));
  }, []);

  // Reviews
  const addReview = useCallback((data: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setReviews(prev => [newReview, ...prev]);
    addNotification({
      type: 'nova_avaliacao',
      title: 'Nova avaliação recebida',
      message: `${data.reviewerName} avaliou seu serviço com ${data.rating} estrelas`,
    });
  }, []);

  const getReviewsByProfessional = useCallback((professionalId: string) =>
    reviews.filter(r => r.professionalId === professionalId), [reviews]);

  // Notifications
  const addNotification = useCallback((data: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const n: Notification = { ...data, id: generateId(), createdAt: new Date().toISOString(), read: false };
    setNotifications(prev => [n, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getUnreadCount = useCallback(() => notifications.filter(n => !n.read).length, [notifications]);

  return (
    <MarketplaceContext.Provider value={{
      services, addService, updateServiceStatus, getServiceById, getServicesByContractor, getAvailableServices,
      addProposal, updateProposalStatus, getProposalsByProfessional,
      conversations, getConversation, getConversationsByUser, startConversation,
      messages, sendMessage,
      reviews, addReview, getReviewsByProfessional,
      notifications, addNotification, markNotificationRead, markAllNotificationsRead, getUnreadCount,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
}
