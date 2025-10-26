// Portuguese districts list
export const DISTRICTS = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Angra do Heroísmo', // Açores
  'Horta', // Açores
  'Ponta Delgada', // Açores
  'Funchal', // Madeira
  'Porto Santo', // Madeira
]

// All services from all categories - flat list for registration
export const ALL_SERVICES = [
  // Serviços de Construção e Remodelação
  'Eletricista',
  'Canalizador',
  'Pintor',
  'Gesseiro',
  'Azulejista',
  'Carpinteiro',
  
  // Serviços Domésticos
  'Engomadeira',
  'Cozinheira',
  'Ama (Babysitter)',
  'Cuidador de idosos',
  'Lavanderia',
  
  // Serviços de Limpeza
  'Limpeza Residencial',
  'Limpeza Pós-obra',
  'Limpeza Comercial',
  'Limpeza de Vidros',
  
  // Serviços de Tecnologia e Informática
  'Suporte Técnico',
  'Formatação',
  'Instalação de Redes',
  'Desenvolvimento de Sites',
  
  // Serviço Automóvel
  'Mecânica',
  'Eletricista Auto',
  'Chapa e Pintura',
  'Mudança de Óleo',
  
  // Beleza e Estética
  'Cabeleireiro',
  'Maquiador(a)',
  'Manicure e Pedicure',
  'Massagens',
  
  // Serviços de Saúde e Bem-Estar
  'Fisioterapia',
  'Nutricionista',
  'Personal Trainer',
  'Psicólogo',
  
  // Serviços de Transporte e Logística
  'Transporte e Mudanças',
  'Serviço de Entregas',
  'Transporte Executivo',
  'Aluguer de Viaturas',
  
  // Educação
  'Aulas Particulares',
  'Reforço Escolar',
  'Tradução',
  
  // Eventos e Festas
  'Buffet',
  'Empregado de Mesa',
  'DJ',
  'Fotógrafo',
  'Decoração',
  
  // Serviços Administrativos e Financeiros
  'Consultoria Contábil',
  'Declaração de IRS',
  'Consultoria Jurídica',
  'Planejamento Financeiro',
  
  // Serviços Criativos e Design
  'Design Gráfico',
  'Criação de Conteúdo',
  'Edição de Vídeo',
  'Fotografia Profissional',
  
  // Serviços de Costura/Alfaiataria/Modista
  'Fazer Bainhas',
  'Apertar/Alargar Peças',
  'Encurtar/Alongar Mangas',
  'Reparação de Fechos',
]

// Service categories structure
export interface ServiceCategory {
  name: string
  services: string[]
}

export const SERVICE_CATEGORIES_LIST: ServiceCategory[] = [
  {
    name: 'Serviços de Construção e Remodelação',
    services: ['Eletricista', 'Canalizador', 'Pintor', 'Gesseiro', 'Azulejista', 'Carpinteiro']
  },
  {
    name: 'Serviços Domésticos',
    services: ['Engomadeira', 'Cozinheira', 'Ama (Babysitter)', 'Cuidador de idosos', 'Lavanderia']
  },
  {
    name: 'Serviços de Limpeza',
    services: ['Limpeza Residencial', 'Limpeza Pós-obra', 'Limpeza Comercial', 'Limpeza de Vidros']
  },
  {
    name: 'Serviços de Tecnologia e Informática',
    services: ['Suporte Técnico', 'Formatação', 'Instalação de Redes', 'Desenvolvimento de Sites']
  },
  {
    name: 'Serviço Automóvel',
    services: ['Mecânica', 'Eletricista Auto', 'Chapa e Pintura', 'Mudança de Óleo']
  },
  {
    name: 'Beleza e Estética',
    services: ['Cabeleireiro', 'Maquiador(a)', 'Manicure e Pedicure', 'Massagens']
  },
  {
    name: 'Serviços de Saúde e Bem-Estar',
    services: ['Fisioterapia', 'Nutricionista', 'Personal Trainer', 'Psicólogo']
  },
  {
    name: 'Serviços de Transporte e Logística',
    services: ['Transporte e Mudanças', 'Serviço de Entregas', 'Transporte Executivo', 'Aluguer de Viaturas']
  },
  {
    name: 'Educação',
    services: ['Aulas Particulares', 'Reforço Escolar', 'Tradução']
  },
  {
    name: 'Eventos e Festas',
    services: ['Buffet', 'Empregado de Mesa', 'DJ', 'Fotógrafo', 'Decoração']
  },
  {
    name: 'Serviços Administrativos e Financeiros',
    services: ['Consultoria Contábil', 'Declaração de IRS', 'Consultoria Jurídica', 'Planejamento Financeiro']
  },
  {
    name: 'Serviços Criativos e Design',
    services: ['Design Gráfico', 'Criação de Conteúdo', 'Edição de Vídeo', 'Fotografia Profissional']
  },
  {
    name: 'Serviços de Costura/Alfaiataria/Modista',
    services: ['Fazer Bainhas', 'Apertar/Alargar Peças', 'Encurtar/Alongar Mangas', 'Reparação de Fechos']
  }
]

