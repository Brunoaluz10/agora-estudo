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

export interface ProgressoMensal {
  mes: string;
  temasRevisados: number;
  tempoEstudo: number;
  taxaAcerto: number;
  questoesRespondidas: number;
}

// Especialidades médicas
export const especialidades: Especialidade[] = [
  {
    id: 'cardio',
    nome: 'Cardiologia',
    cor: 'blue',
    progresso: 75,
    totalTopicos: 45,
    topicosRevisados: 34
  },
  {
    id: 'neuro',
    nome: 'Neurologia',
    cor: 'purple',
    progresso: 60,
    totalTopicos: 38,
    topicosRevisados: 23
  },
  {
    id: 'ped',
    nome: 'Pediatria',
    cor: 'green',
    progresso: 45,
    totalTopicos: 52,
    topicosRevisados: 23
  },
  {
    id: 'cir',
    nome: 'Cirurgia Geral',
    cor: 'red',
    progresso: 30,
    totalTopicos: 40,
    topicosRevisados: 12
  },
  {
    id: 'med',
    nome: 'Medicina Interna',
    cor: 'orange',
    progresso: 55,
    totalTopicos: 48,
    topicosRevisados: 26
  },
  {
    id: 'gine',
    nome: 'Ginecologia',
    cor: 'pink',
    progresso: 40,
    totalTopicos: 35,
    topicosRevisados: 14
  }
];

// Tópicos de estudo
export const topicos: Topico[] = [
  {
    id: '1',
    nome: 'Insuficiência Cardíaca',
    especialidade: 'Cardiologia',
    prioridade: 'alta',
    status: 'em_revisao',
    ultimaRevisao: '2024-07-15',
    proximaRevisao: '2024-07-22',
    dificuldade: 'dificil',
    fonte: 'Harrison',
    observacoes: 'Foco em tratamento e classificação NYHA'
  },
  {
    id: '2',
    nome: 'AVC Isquêmico',
    especialidade: 'Neurologia',
    prioridade: 'alta',
    status: 'concluido',
    ultimaRevisao: '2024-07-18',
    proximaRevisao: '2024-07-25',
    dificuldade: 'dificil',
    fonte: 'Adams & Victor',
    observacoes: 'Janela terapêutica e trombolíticos'
  },
  {
    id: '3',
    nome: 'Pneumonia na Infância',
    especialidade: 'Pediatria',
    prioridade: 'media',
    status: 'pendente',
    proximaRevisao: '2024-07-28',
    dificuldade: 'medio',
    fonte: 'Nelson',
    observacoes: 'Critérios de internação'
  },
  {
    id: '4',
    nome: 'Apendicite Aguda',
    especialidade: 'Cirurgia Geral',
    prioridade: 'alta',
    status: 'pendente',
    proximaRevisao: '2024-07-30',
    dificuldade: 'medio',
    fonte: 'Schwartz',
    observacoes: 'Diagnóstico diferencial'
  },
  {
    id: '5',
    nome: 'Diabetes Mellitus',
    especialidade: 'Medicina Interna',
    prioridade: 'alta',
    status: 'concluido',
    ultimaRevisao: '2024-07-10',
    proximaRevisao: '2024-07-17',
    dificuldade: 'medio',
    fonte: 'Harrison',
    observacoes: 'Complicações micro e macrovasculares'
  },
  {
    id: '6',
    nome: 'Pré-eclâmpsia',
    especialidade: 'Ginecologia',
    prioridade: 'alta',
    status: 'em_revisao',
    ultimaRevisao: '2024-07-12',
    proximaRevisao: '2024-07-19',
    dificuldade: 'dificil',
    fonte: 'Williams',
    observacoes: 'Critérios de gravidade'
  }
];

// Métricas do dashboard
export const metricas: Metrica[] = [
  {
    id: 'temas-revisados',
    titulo: 'Temas Revisados',
    valor: 127,
    variacao: 15,
    descricao: 'Crescimento este mês',
    meta: 'Meta: 150 temas',
    icone: 'BookOpen',
    cor: 'blue'
  },
  {
    id: 'tempo-estudo',
    titulo: 'Tempo de Estudo',
    valor: '42h',
    variacao: 8,
    descricao: 'Esta semana',
    meta: 'Meta: 40h/semana',
    icone: 'Clock',
    cor: 'green'
  },
  {
    id: 'taxa-acerto',
    titulo: 'Taxa de Acerto',
    valor: '78%',
    variacao: 5,
    descricao: 'Últimas 100 questões',
    meta: 'Meta: 80%',
    icone: 'Target',
    cor: 'yellow'
  },
  {
    id: 'progresso-geral',
    titulo: 'Progresso Geral',
    valor: '65%',
    variacao: 12,
    descricao: 'Conclusão do programa',
    meta: 'Meta: 100%',
    icone: 'Award',
    cor: 'purple'
  }
];

// Progresso mensal para gráficos
export const progressoMensal: ProgressoMensal[] = [
  { mes: 'Jan', temasRevisados: 15, tempoEstudo: 120, taxaAcerto: 65, questoesRespondidas: 200 },
  { mes: 'Fev', temasRevisados: 22, tempoEstudo: 140, taxaAcerto: 68, questoesRespondidas: 250 },
  { mes: 'Mar', temasRevisados: 18, tempoEstudo: 130, taxaAcerto: 70, questoesRespondidas: 220 },
  { mes: 'Abr', temasRevisados: 25, tempoEstudo: 160, taxaAcerto: 72, questoesRespondidas: 300 },
  { mes: 'Mai', temasRevisados: 30, tempoEstudo: 180, taxaAcerto: 75, questoesRespondidas: 350 },
  { mes: 'Jun', temasRevisados: 28, tempoEstudo: 170, taxaAcerto: 76, questoesRespondidas: 320 },
  { mes: 'Jul', temasRevisados: 35, tempoEstudo: 200, taxaAcerto: 78, questoesRespondidas: 400 }
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

export async function getProgressoMensal(): Promise<ProgressoMensal[]> {
  await simularDelay(400);
  return progressoMensal;
}

export async function getTopicoById(id: string): Promise<Topico | undefined> {
  await simularDelay(200);
  return topicos.find(t => t.id === id);
}

export async function getTopicosPorEspecialidade(especialidade: string): Promise<Topico[]> {
  await simularDelay(300);
  return topicos.filter(t => t.especialidade === especialidade);
} 