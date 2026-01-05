// Mock Users for Authentication
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'cuidador' | 'acompanhante' | 'tecnico' | 'enfermeiro' | 'contratante' | 'admin';
  profileImage?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'enfermeiro@kuid.com',
    password: '123456',
    name: 'Maria Silva',
    role: 'enfermeiro',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '2',
    email: 'tecnico@kuid.com',
    password: '123456',
    name: 'João Santos',
    role: 'tecnico',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '3',
    email: 'cuidador@kuid.com',
    password: '123456',
    name: 'Ana Paula Costa',
    role: 'cuidador',
    profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '4',
    email: 'acompanhante@kuid.com',
    password: '123456',
    name: 'Carlos Mendes',
    role: 'acompanhante',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '5',
    email: 'contratante@kuid.com',
    password: '123456',
    name: 'Família Costa',
    role: 'contratante',
  },
  {
    id: '6',
    email: 'admin@kuid.com',
    password: '123456',
    name: 'Admin KUID+',
    role: 'admin',
  },
];

// Professional Categories
export type ProfessionType = 'Cuidador(a)' | 'Acompanhante Hospitalar' | 'Técnico(a) de Enfermagem' | 'Enfermeiro(a)';

// Professional Profile Interface
export interface Professional {
  id: string;
  userId: string;
  name: string;
  birthDate: string; // ISO date string
  sex: 'Masculino' | 'Feminino';
  city: string;
  state: string;
  region: string;
  whatsapp: string;
  email: string;
  profession: ProfessionType;
  profileImage: string;
  videoUrl?: string;
  bio: string;
  experienceYears: number;
  courses: string[];
  certificates: { name: string; file?: string }[];
  serviceArea: string;
  serviceRadius?: number; // km
  hospitals: string[];
  availability: 'hospital' | 'domicilio' | 'ambos';
  priceRange: { min: number; max: number };
  rating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'suspended';
  backgroundCheck: boolean;
  whatsappClicks: number;
  weeklyViews: number;
  createdAt: string;
  // Highlight/Destaque features
  isHighlighted: boolean;
  highlightPhrase?: string;
  references?: { name: string; phone?: string }[];
  // Trial period
  trialEndsAt?: string;
}

// Helper to calculate age from birthDate
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Helper to get first name + last initial
export function getDisplayName(fullName: string, isHighlighted: boolean): string {
  if (isHighlighted) return fullName;
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export const mockProfessionals: Professional[] = [
  {
    id: 'prof-1',
    userId: '1',
    name: 'Maria Silva Santos',
    birthDate: '1990-03-15',
    sex: 'Feminino',
    city: 'São Paulo',
    state: 'SP',
    region: 'Zona Sul',
    whatsapp: '5511999999999',
    email: 'maria.silva@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    videoUrl: 'https://example.com/video1.mp4',
    bio: 'Enfermeira com mais de 10 anos de experiência em cuidados domiciliares e hospitalares. Especializada em geriatria e cuidados paliativos. Atendo com carinho e dedicação, priorizando sempre o bem-estar do paciente e da família.',
    experienceYears: 10,
    courses: ['Especialização em Geriatria', 'Cuidados Paliativos', 'Primeiros Socorros Avançado'],
    certificates: [
      { name: 'COREN-SP Ativo' },
      { name: 'Especialização USP' },
    ],
    serviceArea: 'Zona Sul e Centro de São Paulo',
    serviceRadius: 15,
    hospitals: ['Hospital Albert Einstein', 'Hospital Sírio-Libanês', 'Hospital das Clínicas'],
    availability: 'ambos',
    priceRange: { min: 220, max: 280 },
    rating: 4.9,
    totalRatings: 47,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 156,
    weeklyViews: 89,
    createdAt: '2024-01-15',
    isHighlighted: true,
    highlightPhrase: '🏆 Profissional com excelência em cuidados geriátricos',
    references: [
      { name: 'Dr. Carlos Medeiros', phone: '11999998888' },
    ],
  },
  {
    id: 'prof-2',
    userId: '2',
    name: 'João Santos Oliveira',
    birthDate: '1996-07-22',
    sex: 'Masculino',
    city: 'Rio de Janeiro',
    state: 'RJ',
    region: 'Zona Sul',
    whatsapp: '5521988888888',
    email: 'joao.santos@email.com',
    profession: 'Técnico(a) de Enfermagem',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Técnico de enfermagem dedicado, com experiência em home care e acompanhamento hospitalar. Formado pela Cruz Vermelha, com especializações em cuidados com idosos.',
    experienceYears: 5,
    courses: ['Técnico em Enfermagem', 'Cuidador de Idosos', 'Suporte Básico de Vida'],
    certificates: [
      { name: 'COREN-RJ Ativo' },
      { name: 'Cruz Vermelha' },
    ],
    serviceArea: 'Zona Sul e Barra da Tijuca',
    serviceRadius: 20,
    hospitals: ['Hospital Copa Star', 'Hospital Samaritano'],
    availability: 'ambos',
    priceRange: { min: 180, max: 220 },
    rating: 4.7,
    totalRatings: 32,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 89,
    weeklyViews: 45,
    createdAt: '2024-02-20',
    isHighlighted: false,
  },
  {
    id: 'prof-3',
    userId: '3',
    name: 'Ana Paula Costa',
    birthDate: '1985-11-08',
    sex: 'Feminino',
    city: 'São Paulo',
    state: 'SP',
    region: 'Zona Oeste',
    whatsapp: '5511977777777',
    email: 'ana.costa@email.com',
    profession: 'Cuidador(a)',
    profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    videoUrl: 'https://example.com/video3.mp4',
    bio: 'Cuidadora experiente com mais de 8 anos dedicados ao cuidado de idosos. Especialista em Alzheimer e demência. Atendo com muito amor e paciência.',
    experienceYears: 8,
    courses: ['Cuidador de Idosos', 'Alzheimer e Demência', 'Primeiros Socorros'],
    certificates: [
      { name: 'Certificado Cuidador' },
    ],
    serviceArea: 'Zona Oeste de São Paulo',
    serviceRadius: 10,
    hospitals: [],
    availability: 'domicilio',
    priceRange: { min: 150, max: 180 },
    rating: 4.8,
    totalRatings: 63,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 234,
    weeklyViews: 120,
    createdAt: '2023-11-10',
    isHighlighted: true,
    highlightPhrase: '💜 Especialista em Alzheimer com 8 anos de experiência',
    references: [
      { name: 'Família Rodrigues', phone: '11988887777' },
      { name: 'Dra. Marta Lima' },
    ],
  },
  {
    id: 'prof-4',
    userId: '4',
    name: 'Carlos Mendes Silva',
    birthDate: '1988-04-30',
    sex: 'Masculino',
    city: 'São Paulo',
    state: 'SP',
    region: 'Centro',
    whatsapp: '5511966666666',
    email: 'carlos.mendes@email.com',
    profession: 'Acompanhante Hospitalar',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    videoUrl: 'https://example.com/video4.mp4',
    bio: 'Acompanhante hospitalar com vasta experiência em grandes hospitais de São Paulo. Atencioso, paciente e dedicado ao conforto do paciente internado.',
    experienceYears: 7,
    courses: ['Acompanhante Hospitalar', 'Primeiros Socorros', 'Cuidados Básicos'],
    certificates: [
      { name: 'Certificado Acompanhante' },
    ],
    serviceArea: 'Centro e região metropolitana',
    serviceRadius: 25,
    hospitals: ['Hospital das Clínicas', 'Hospital Mandaqui', 'Hospital Santa Casa'],
    availability: 'hospital',
    priceRange: { min: 160, max: 200 },
    rating: 4.6,
    totalRatings: 28,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 67,
    weeklyViews: 38,
    createdAt: '2024-03-05',
    isHighlighted: true,
    highlightPhrase: '🏥 Experiência em grandes hospitais de SP',
  },
  {
    id: 'prof-5',
    userId: '',
    name: 'Fernanda Lima Souza',
    birthDate: '1995-09-12',
    sex: 'Feminino',
    city: 'Curitiba',
    state: 'PR',
    region: 'Centro',
    whatsapp: '5541955555555',
    email: 'fernanda.lima@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Enfermeira formada pela UFPR, com experiência em pediatria e cuidados geriátricos. Atendo com muito carinho e profissionalismo.',
    experienceYears: 6,
    courses: ['Enfermagem Pediátrica', 'Cuidados Geriátricos', 'Enfermagem Domiciliar'],
    certificates: [
      { name: 'COREN-PR Ativo' },
      { name: 'UFPR' },
    ],
    serviceArea: 'Centro e Batel',
    serviceRadius: 12,
    hospitals: ['Hospital Marcelino Champagnat', 'Hospital Evangélico'],
    availability: 'ambos',
    priceRange: { min: 200, max: 260 },
    rating: 4.6,
    totalRatings: 19,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 45,
    weeklyViews: 22,
    createdAt: '2024-04-12',
    isHighlighted: false,
  },
  {
    id: 'prof-6',
    userId: '',
    name: 'Roberto Alves Pereira',
    birthDate: '1979-01-25',
    sex: 'Masculino',
    city: 'Salvador',
    state: 'BA',
    region: 'Ondina',
    whatsapp: '5571944444444',
    email: 'roberto.alves@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    videoUrl: 'https://example.com/video6.mp4',
    bio: 'Enfermeiro com 20 anos de experiência. Especialista em cuidados com pacientes acamados e recuperação pós-AVC.',
    experienceYears: 20,
    courses: ['Especialização em Neurologia', 'Cuidados Intensivos', 'Reabilitação'],
    certificates: [
      { name: 'COREN-BA Ativo' },
      { name: 'Especialização UFBA' },
    ],
    serviceArea: 'Toda Salvador',
    serviceRadius: 30,
    hospitals: ['Hospital Português', 'Hospital São Rafael'],
    availability: 'ambos',
    priceRange: { min: 280, max: 350 },
    rating: 4.9,
    totalRatings: 89,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 312,
    weeklyViews: 156,
    createdAt: '2023-08-22',
    isHighlighted: true,
    highlightPhrase: '⭐ 20 anos de experiência, especialista em neurologia',
    references: [
      { name: 'Dr. Paulo Santos', phone: '71999996666' },
      { name: 'Hospital Português' },
    ],
  },
  {
    id: 'prof-7',
    userId: '',
    name: 'Luciana Freitas',
    birthDate: '1998-06-18',
    sex: 'Feminino',
    city: 'Porto Alegre',
    state: 'RS',
    region: 'Zona Norte',
    whatsapp: '5551933333333',
    email: 'luciana.freitas@email.com',
    profession: 'Técnico(a) de Enfermagem',
    profileImage: 'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Técnica de enfermagem recém-formada, dedicada e em constante aprendizado. Experiência em estágio hospitalar e home care.',
    experienceYears: 2,
    courses: ['Técnico em Enfermagem', 'Primeiros Socorros'],
    certificates: [
      { name: 'COREN-RS Ativo' },
    ],
    serviceArea: 'Zona Norte de Porto Alegre',
    serviceRadius: 8,
    hospitals: ['Hospital Moinhos de Vento'],
    availability: 'ambos',
    priceRange: { min: 150, max: 180 },
    rating: 4.3,
    totalRatings: 8,
    status: 'pending',
    backgroundCheck: false,
    whatsappClicks: 12,
    weeklyViews: 8,
    createdAt: '2024-05-30',
    isHighlighted: false,
    trialEndsAt: '2024-06-30',
  },
  {
    id: 'prof-8',
    userId: '',
    name: 'Marcos Ribeiro Costa',
    birthDate: '1986-12-03',
    sex: 'Masculino',
    city: 'Brasília',
    state: 'DF',
    region: 'Asa Sul',
    whatsapp: '5561922222222',
    email: 'marcos.ribeiro@email.com',
    profession: 'Cuidador(a)',
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Cuidador experiente com foco em acompanhamento de idosos. Paciente, atencioso e comprometido com o bem-estar.',
    experienceYears: 6,
    courses: ['Cuidador de Idosos', 'Gerontologia Básica', 'Primeiros Socorros'],
    certificates: [
      { name: 'Certificado Cuidador' },
    ],
    serviceArea: 'Asa Sul, Asa Norte e Lago Sul',
    serviceRadius: 20,
    hospitals: [],
    availability: 'domicilio',
    priceRange: { min: 140, max: 180 },
    rating: 4.5,
    totalRatings: 35,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 98,
    weeklyViews: 52,
    createdAt: '2023-12-01',
    isHighlighted: false,
  },
];

// Brazilian States
export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Price Ranges for Filter
export const priceRanges = [
  { label: 'Até R$ 150', min: 0, max: 150 },
  { label: 'R$ 150 - R$ 180', min: 150, max: 180 },
  { label: 'R$ 180 - R$ 220', min: 180, max: 220 },
  { label: 'R$ 220 - R$ 280', min: 220, max: 280 },
  { label: 'R$ 280 - R$ 350', min: 280, max: 350 },
  { label: 'Acima de R$ 350', min: 350, max: 9999 },
];

// Profession options
export const professionOptions: ProfessionType[] = [
  'Cuidador(a)',
  'Acompanhante Hospitalar',
  'Técnico(a) de Enfermagem',
  'Enfermeiro(a)',
];
