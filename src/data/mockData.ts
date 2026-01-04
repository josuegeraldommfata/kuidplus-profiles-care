// Mock Users for Authentication
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'enfermeiro' | 'tecnico' | 'contratante' | 'admin';
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
    email: 'contratante@kuid.com',
    password: '123456',
    name: 'Ana Costa',
    role: 'contratante',
  },
  {
    id: '4',
    email: 'admin@kuid.com',
    password: '123456',
    name: 'Carlos Admin',
    role: 'admin',
  },
];

// Professional Profile Interface
export interface Professional {
  id: string;
  userId: string;
  name: string;
  age: number;
  sex: 'Masculino' | 'Feminino';
  city: string;
  state: string;
  whatsapp: string;
  email: string;
  profession: 'Enfermeiro(a)' | 'Técnico(a) de Enfermagem';
  profileImage: string;
  videoUrl?: string;
  bio: string;
  experienceYears: number;
  courses: string[];
  certificates: { name: string; file?: string }[];
  serviceArea: string;
  hospitals: string[];
  priceRange: { min: number; max: number };
  rating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'suspended';
  backgroundCheck: boolean;
  whatsappClicks: number;
  createdAt: string;
}

export const mockProfessionals: Professional[] = [
  {
    id: 'prof-1',
    userId: '1',
    name: 'Maria Silva',
    age: 34,
    sex: 'Feminino',
    city: 'São Paulo',
    state: 'SP',
    whatsapp: '5511999999999',
    email: 'maria.silva@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Enfermeira com mais de 10 anos de experiência em cuidados domiciliares e hospitalares. Especializada em geriatria e cuidados paliativos. Atendo com carinho e dedicação, priorizando sempre o bem-estar do paciente e da família.',
    experienceYears: 10,
    courses: ['Especialização em Geriatria', 'Cuidados Paliativos', 'Primeiros Socorros Avançado'],
    certificates: [
      { name: 'COREN-SP Ativo' },
      { name: 'Especialização USP' },
    ],
    serviceArea: 'Zona Sul e Centro de São Paulo',
    hospitals: ['Hospital Albert Einstein', 'Hospital Sírio-Libanês', 'Hospital das Clínicas'],
    priceRange: { min: 220, max: 280 },
    rating: 4.9,
    totalRatings: 47,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 156,
    createdAt: '2024-01-15',
  },
  {
    id: 'prof-2',
    userId: '2',
    name: 'João Santos',
    age: 28,
    sex: 'Masculino',
    city: 'Rio de Janeiro',
    state: 'RJ',
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
    hospitals: ['Hospital Copa Star', 'Hospital Samaritano'],
    priceRange: { min: 180, max: 220 },
    rating: 4.7,
    totalRatings: 32,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 89,
    createdAt: '2024-02-20',
  },
  {
    id: 'prof-3',
    userId: '',
    name: 'Carla Mendes',
    age: 42,
    sex: 'Feminino',
    city: 'Belo Horizonte',
    state: 'MG',
    whatsapp: '5531977777777',
    email: 'carla.mendes@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Enfermeira com 15 anos de experiência, especialista em UTI e cuidados intensivos domiciliares. Trabalho com pacientes em recuperação pós-operatória e cuidados paliativos.',
    experienceYears: 15,
    courses: ['Especialização em UTI', 'Gestão de Enfermagem', 'Cuidados Intensivos'],
    certificates: [
      { name: 'COREN-MG Ativo' },
      { name: 'MBA em Gestão Hospitalar' },
    ],
    serviceArea: 'Região Centro-Sul de BH',
    hospitals: ['Hospital Mater Dei', 'Hospital Felício Rocho'],
    priceRange: { min: 250, max: 320 },
    rating: 4.8,
    totalRatings: 63,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 234,
    createdAt: '2023-11-10',
  },
  {
    id: 'prof-4',
    userId: '',
    name: 'Pedro Oliveira',
    age: 31,
    sex: 'Masculino',
    city: 'São Paulo',
    state: 'SP',
    whatsapp: '5511966666666',
    email: 'pedro.oliveira@email.com',
    profession: 'Técnico(a) de Enfermagem',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Técnico de enfermagem com foco em acompanhamento de idosos. Paciente, atencioso e com experiência em administração de medicamentos e curativos.',
    experienceYears: 7,
    courses: ['Técnico em Enfermagem', 'Gerontologia Básica', 'Administração de Medicamentos'],
    certificates: [
      { name: 'COREN-SP Ativo' },
    ],
    serviceArea: 'Zona Norte e Centro de São Paulo',
    hospitals: ['Hospital Mandaqui', 'Hospital Sancta Maggiore'],
    priceRange: { min: 180, max: 220 },
    rating: 4.5,
    totalRatings: 28,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 67,
    createdAt: '2024-03-05',
  },
  {
    id: 'prof-5',
    userId: '',
    name: 'Fernanda Lima',
    age: 29,
    sex: 'Feminino',
    city: 'Curitiba',
    state: 'PR',
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
    hospitals: ['Hospital Marcelino Champagnat', 'Hospital Evangélico'],
    priceRange: { min: 200, max: 260 },
    rating: 4.6,
    totalRatings: 19,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 45,
    createdAt: '2024-04-12',
  },
  {
    id: 'prof-6',
    userId: '',
    name: 'Roberto Alves',
    age: 45,
    sex: 'Masculino',
    city: 'Salvador',
    state: 'BA',
    whatsapp: '5571944444444',
    email: 'roberto.alves@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Enfermeiro com 20 anos de experiência. Especialista em cuidados com pacientes acamados e recuperação pós-AVC.',
    experienceYears: 20,
    courses: ['Especialização em Neurologia', 'Cuidados Intensivos', 'Reabilitação'],
    certificates: [
      { name: 'COREN-BA Ativo' },
      { name: 'Especialização UFBA' },
    ],
    serviceArea: 'Toda Salvador',
    hospitals: ['Hospital Português', 'Hospital São Rafael'],
    priceRange: { min: 280, max: 350 },
    rating: 4.9,
    totalRatings: 89,
    status: 'approved',
    backgroundCheck: true,
    whatsappClicks: 312,
    createdAt: '2023-08-22',
  },
  {
    id: 'prof-7',
    userId: '',
    name: 'Luciana Freitas',
    age: 26,
    sex: 'Feminino',
    city: 'Porto Alegre',
    state: 'RS',
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
    hospitals: ['Hospital Moinhos de Vento'],
    priceRange: { min: 150, max: 180 },
    rating: 4.3,
    totalRatings: 8,
    status: 'pending',
    backgroundCheck: false,
    whatsappClicks: 12,
    createdAt: '2024-05-30',
  },
  {
    id: 'prof-8',
    userId: '',
    name: 'Marcos Ribeiro',
    age: 38,
    sex: 'Masculino',
    city: 'Brasília',
    state: 'DF',
    whatsapp: '5561922222222',
    email: 'marcos.ribeiro@email.com',
    profession: 'Enfermeiro(a)',
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    videoUrl: '',
    bio: 'Enfermeiro com experiência em hospitais públicos e privados. Especialista em emergências e cuidados domiciliares.',
    experienceYears: 12,
    courses: ['Emergência e Trauma', 'UTI Adulto', 'Home Care'],
    certificates: [
      { name: 'COREN-DF Ativo' },
      { name: 'ACLS' },
    ],
    serviceArea: 'Asa Sul, Asa Norte e Lago Sul',
    hospitals: ['Hospital Santa Lúcia', 'Hospital Brasília'],
    priceRange: { min: 240, max: 300 },
    rating: 4.7,
    totalRatings: 41,
    status: 'suspended',
    backgroundCheck: true,
    whatsappClicks: 178,
    createdAt: '2023-12-01',
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
  { label: 'Até R$ 180', min: 0, max: 180 },
  { label: 'R$ 180 - R$ 220', min: 180, max: 220 },
  { label: 'R$ 220 - R$ 280', min: 220, max: 280 },
  { label: 'R$ 280 - R$ 350', min: 280, max: 350 },
  { label: 'Acima de R$ 350', min: 350, max: 9999 },
];
