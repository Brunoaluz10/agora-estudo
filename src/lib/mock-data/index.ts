// Dados mock para o projeto Agora Estudo - Revisão para Residência Médica

export interface Especialidade {
  id: string;
  nome: string;
  cor: string;
  progresso: number;
  totalTopicos: number;
  topicosRevisados: number;
}

export interface Topico {
  id: string;
  nome: string;
  especialidade: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_revisao' | 'concluido';
  ultimaRevisao?: string;
  proximaRevisao?: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  fonte?: string;
  observacoes?: string;
}

export interface Metrica {
  id: string;
  titulo: string;
  valor: string | number;
  variacao: number;
  descricao: string;
  meta: string;
  icone: string;
  cor: string;
}

export interface Releitura {
  id: string;
  topicoId: string;
  data: string;
  tipo: 'primeira' | 'segunda' | 'terceira' | 'quarta';
  observacoes?: string;
  tempoGasto: number; // em segundos
}

// Especialidades baseadas no relatório de aulas
export const especialidades: Especialidade[] = [
  {
    id: 'clinica-medica',
    nome: 'Clínica Médica',
    cor: 'bg-blue-500',
    progresso: 34,
    totalTopicos: 45,
    topicosRevisados: 15
  },
  {
    id: 'cirurgia-geral',
    nome: 'Cirurgia Geral',
    cor: 'bg-green-500',
    progresso: 23,
    totalTopicos: 38,
    topicosRevisados: 8
  },
  {
    id: 'ginecologia-obstetricia',
    nome: 'Ginecologia e Obstetrícia',
    cor: 'bg-purple-500',
    progresso: 28,
    totalTopicos: 42,
    topicosRevisados: 12
  },
  {
    id: 'pediatria',
    nome: 'Pediatria',
    cor: 'bg-orange-500',
    progresso: 31,
    totalTopicos: 52,
    topicosRevisados: 16
  },
  {
    id: 'saude-coletiva',
    nome: 'Saúde Coletiva',
    cor: 'bg-red-500',
    progresso: 18,
    totalTopicos: 25,
    topicosRevisados: 4
  }
];

// Tópicos baseados no relatório de aulas
export const topicos: Topico[] = [
  // Clínica Médica
  {
    id: 'cm-1',
    nome: 'Diabetes: classificação, diagnóstico e tratamento',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-2',
    nome: 'Hipertensão arterial sistêmica',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'em_revisao',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-3',
    nome: 'Pneumonia',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-4',
    nome: 'HIV',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-5',
    nome: 'Síndromes coronarianas',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-6',
    nome: 'Arritmias',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-7',
    nome: 'Suporte básico e avançado na parada cardiorrespiratória',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'cm-8',
    nome: 'Intoxicações e acidentes com animais peçonhentos',
    especialidade: 'Clínica Médica',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },

  // Cirurgia Geral
  {
    id: 'cg-1',
    nome: 'Pós-operatório',
    especialidade: 'Cirurgia Geral',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'cg-2',
    nome: 'Abdome agudo inflamatório',
    especialidade: 'Cirurgia Geral',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'cg-3',
    nome: 'Hérnias',
    especialidade: 'Cirurgia Geral',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },

  // Ginecologia e Obstetrícia
  {
    id: 'go-1',
    nome: 'Gestação de alto risco',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-2',
    nome: 'Infecções do trato genital feminino',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-3',
    nome: 'Assistência pré-natal',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-4',
    nome: 'Câncer de colo de útero e doenças da vulva',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-5',
    nome: 'Anticoncepção',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-6',
    nome: 'Sangramentos na gravidez',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-7',
    nome: 'Mastologia',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'go-8',
    nome: 'Assistência ao parto e ao puerpério',
    especialidade: 'Ginecologia e Obstetrícia',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },

  // Pediatria
  {
    id: 'ped-1',
    nome: 'Crescimento e desenvolvimento',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'ped-2',
    nome: 'Pneumonia na infância',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'ped-3',
    nome: 'Atendimento ao recém-nascido em sala de parto',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'dificil',
    fonte: 'Aristo Class'
  },
  {
    id: 'ped-4',
    nome: 'Aleitamento, alimentação e suplementação na infância',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'ped-5',
    nome: 'Imunizações',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'ped-6',
    nome: 'Doenças exantemáticas',
    especialidade: 'Pediatria',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },

  // Saúde Coletiva
  {
    id: 'sc-1',
    nome: 'Sistema Único de Saúde',
    especialidade: 'Saúde Coletiva',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'facil',
    fonte: 'Aristo Class'
  },
  {
    id: 'sc-2',
    nome: 'Atenção Primária à Saúde',
    especialidade: 'Saúde Coletiva',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'sc-3',
    nome: 'Vigilância em Saúde',
    especialidade: 'Saúde Coletiva',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'sc-4',
    nome: 'Indicadores de Saúde',
    especialidade: 'Saúde Coletiva',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'medio',
    fonte: 'Aristo Class'
  },
  {
    id: 'sc-5',
    nome: 'Legislação Médica',
    especialidade: 'Saúde Coletiva',
    prioridade: 'alta',
    status: 'pendente',
    dificuldade: 'facil',
    fonte: 'Aristo Class'
  }
];

// Métricas do dashboard
export const metricas: Metrica[] = [
  {
    id: '1',
    titulo: 'Tópicos Revisados',
    valor: '55',
    variacao: 12,
    descricao: 'Total de tópicos revisados',
    meta: 'Meta: 200 tópicos',
    icone: 'BookOpen',
    cor: 'text-blue-600'
  },
  {
    id: '2',
    titulo: 'Tempo de Estudo',
    valor: '127h',
    variacao: 8,
    descricao: 'Tempo total de estudo',
    meta: 'Meta: 500 horas',
    icone: 'Clock',
    cor: 'text-green-600'
  },
  {
    id: '3',
    titulo: 'Releituras',
    valor: '23',
    variacao: -3,
    descricao: 'Releituras realizadas',
    meta: 'Meta: 100 releituras',
    icone: 'RefreshCw',
    cor: 'text-purple-600'
  },
  {
    id: '4',
    titulo: 'Progresso Geral',
    valor: '68%',
    variacao: 5,
    descricao: 'Progresso geral do curso',
    meta: 'Meta: 100%',
    icone: 'TrendingUp',
    cor: 'text-orange-600'
  }
];

// Releituras realizadas
export const releituras: Releitura[] = [
  {
    id: '1',
    topicoId: 'cm-1',
    data: '2024-01-15',
    tipo: 'primeira',
    observacoes: 'Conceitos básicos bem assimilados',
    tempoGasto: 2700 // 45 minutos em segundos
  },
  {
    id: '2',
    topicoId: 'cm-1',
    data: '2024-01-22',
    tipo: 'segunda',
    observacoes: 'Revisão focada em complicações',
    tempoGasto: 1800 // 30 minutos em segundos
  },
  {
    id: '3',
    topicoId: 'cm-2',
    data: '2024-01-18',
    tipo: 'primeira',
    observacoes: 'Farmacologia dos anti-hipertensivos',
    tempoGasto: 3600 // 60 minutos em segundos
  },
  {
    id: '4',
    topicoId: 'ped-1',
    data: '2024-01-20',
    tipo: 'primeira',
    observacoes: 'Curvas de crescimento',
    tempoGasto: 2400 // 40 minutos em segundos
  }
];

// Simular delay de rede
export const simularDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Funções para buscar dados
export async function getEspecialidades(): Promise<Especialidade[]> {
  await simularDelay(500);
  return especialidades;
}

export async function getTopicos(): Promise<Topico[]> {
  await simularDelay(300);
  return topicos;
}

export async function getMetricas(): Promise<Metrica[]> {
  await simularDelay(200);
  return metricas;
}

export async function getReleituras(): Promise<Releitura[]> {
  await simularDelay(400);
  return releituras;
}

export async function getTopicoById(id: string): Promise<Topico | undefined> {
  await simularDelay(200);
  return topicos.find(t => t.id === id);
}

export async function getTopicosPorEspecialidade(especialidade: string): Promise<Topico[]> {
  await simularDelay(300);
  return topicos.filter(t => t.especialidade === especialidade);
} 