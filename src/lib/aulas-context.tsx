"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aulas as aulasOriginais } from '@/data/aulas';
import { especialidades as especialidadesOriginais, topicos as topicosOriginais, metricas as metricasOriginais, releituras as releiturasOriginais } from '@/lib/mock-data';

// Função para formatar tempo de forma amigável
const formatarTempo = (horas: number): string => {
  const totalSegundos = Math.round(horas * 3600);
  const horasInteiras = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  
  if (horasInteiras > 0) {
    return `${horasInteiras}h ${minutos.toString().padStart(2, '0')}m ${segundos.toString().padStart(2, '0')}s`;
  } else if (minutos > 0) {
    return `${minutos}m ${segundos.toString().padStart(2, '0')}s`;
  } else {
    return `${segundos}s`;
  }
};

// Função para gerar datas de revisão a partir da data de conclusão
const gerarDatasRevisao = (dataConclusao: string) => {
  const dias = [1, 3, 10, 40];
  const datas: string[] = [];
  const base = new Date(dataConclusao);
  dias.forEach(d => {
    const nova = new Date(base);
    nova.setDate(nova.getDate() + d);
    datas.push(nova.toISOString().slice(0, 10));
  });
  return datas;
};

export interface AulaComTimer {
  id: string;
  area: string;
  titulo: string;
  prioridade: string;
  concluida: boolean;
  duracao: number; // em minutos
  tempoEstudado: number; // em segundos
  emProgresso: boolean;
  tempoInicio?: number;
  ultimaRevisao?: string;
  releituras?: number;
  datasRevisao?: string[];
  revisoesFeitas?: string[];
  releiturasExtras?: string[];
}

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
  tempoGasto: number; // em minutos
}

interface AulasContextType {
  // Aulas
  aulas: AulaComTimer[];
  tempoTotalEstudado: number;
  atualizarAula: (aulaId: string, dados: Partial<AulaComTimer>) => void;
  iniciarAula: (aulaId: string) => void;
  finalizarAula: (aulaId: string) => void;
  atualizarDuracao: (aulaId: string, novaDuracao: number) => void;
  marcarConcluida: (aulaId: string, concluida: boolean) => void;
  marcarRevisaoFeita: (aulaId: string, dataRevisao: string) => void;
  
  // Especialidades
  especialidades: Especialidade[];
  atualizarEspecialidade: (especialidadeId: string, dados: Partial<Especialidade>) => void;
  calcularProgressoEspecialidade: (especialidadeNome: string) => void;
  
  // Tópicos
  topicos: Topico[];
  atualizarTopico: (topicoId: string, dados: Partial<Topico>) => void;
  marcarTopicoConcluido: (topicoId: string) => void;
  adicionarTopico: (topico: Omit<Topico, 'id'>) => void;
  
  // Releituras
  releituras: Releitura[];
  adicionarReleitura: (releitura: Omit<Releitura, 'id'>) => void;
  getReleiturasPorTopico: (topicoId: string) => Releitura[];
  
  // Métricas
  metricas: Metrica[];
  atualizarMetricas: () => void;
  
  // Estatísticas gerais
  getEstatisticasGerais: () => {
    totalAulas: number;
    aulasConcluidas: number;
    progressoGeral: number;
    tempoTotalHoras: number;
    totalReleituras: number;
  };
}

const AulasContext = createContext<AulasContextType | undefined>(undefined);

export function AulasProvider({ children }: { children: ReactNode }) {
  const [aulas, setAulas] = useState<AulaComTimer[]>([]);
  const [tempoTotalEstudado, setTempoTotalEstudado] = useState(0);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [releituras, setReleituras] = useState<Releitura[]>([]);
  const [metricas, setMetricas] = useState<Metrica[]>([]);

  // Inicializar dados
  useEffect(() => {
    console.log('🔄 Carregando dados do localStorage...');
    const dadosSalvos = localStorage.getItem('aulas-estado-completo');
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos);
        console.log('📦 Dados carregados:', {
          aulas: dados.aulas?.length || 0,
          especialidades: dados.especialidades?.length || 0,
          topicos: dados.topicos?.length || 0
        });
        // Verificar se há aulas válidas
        if (!dados.aulas || dados.aulas.length === 0) {
          console.log('⚠️ Nenhuma aula encontrada, reinicializando...');
          inicializarDados();
        } else {
          setAulas(dados.aulas);
        }
        setTempoTotalEstudado(dados.tempoTotalEstudado || 0);
        setEspecialidades(dados.especialidades || especialidadesOriginais);
        setTopicos(dados.topicos || topicosOriginais);
        setReleituras(dados.releituras || releiturasOriginais);
        setMetricas(dados.metricas || metricasOriginais);
      } catch (error) {
        console.error('❌ Erro ao carregar dados salvos:', error);
        inicializarDados();
      }
    } else {
      console.log('📝 Nenhum dado salvo encontrado, inicializando...');
      inicializarDados();
    }
  }, []);

  const inicializarDados = () => {
    console.log('🔧 Inicializando dados...');
    console.log('📚 Aulas originais:', aulasOriginais.length);
    
    // Inicializar aulas
    const aulasIniciais = aulasOriginais.map((aula, index) => ({
      id: `aula-${index}`,
      ...aula,
      duracao: 45,
      tempoEstudado: 0,
      emProgresso: false,
      concluida: false,
      releituras: 0,
      datasRevisao: [],
      revisoesFeitas: [],
      releiturasExtras: [],
    }));
    
    console.log('✅ Aulas inicializadas:', aulasIniciais.length);
    console.log('📊 Primeira aula exemplo:', aulasIniciais[0]);
    setAulas(aulasIniciais);
    
    // Inicializar outras entidades
    setEspecialidades(especialidadesOriginais);
    setTopicos(topicosOriginais);
    setReleituras(releiturasOriginais);
    setMetricas(metricasOriginais);
  };

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('aulas-estado-completo', JSON.stringify({
      aulas,
      tempoTotalEstudado,
      especialidades,
      topicos,
      releituras,
      metricas
    }));
  }, [aulas, tempoTotalEstudado, especialidades, topicos, releituras, metricas]);

  // Timer automático
  useEffect(() => {
    const interval = setInterval(() => {
      setAulas(prevAulas => 
        prevAulas.map(aula => {
          if (aula.emProgresso && aula.tempoInicio) {
            const tempoDecorrido = Math.floor((Date.now() - aula.tempoInicio) / 1000);
            // Só atualizar se o tempo decorrido for maior que o tempo já registrado
            if (tempoDecorrido > 0) {
              return {
                ...aula,
                tempoEstudado: aula.tempoEstudado + 1,
              };
            }
          }
          return aula;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Funções para Aulas
  const atualizarAula = (aulaId: string, dados: Partial<AulaComTimer>) => {
    setAulas(prevAulas =>
      prevAulas.map(aula => 
        aula.id === aulaId ? { ...aula, ...dados } : aula
      )
    );
  };

  const iniciarAula = (aulaId: string) => {
    console.log('▶️ Iniciando aula:', aulaId);
    atualizarAula(aulaId, {
      emProgresso: true,
      tempoInicio: Date.now(),
    });
  };

  const finalizarAula = (aulaId: string) => {
    console.log('🔄 Finalizando aula:', aulaId);
    setAulas(prevAulas =>
      prevAulas.map(aula => {
        if (aula.id === aulaId) {
          const tempoAdicional = aula.tempoInicio ? Math.floor((Date.now() - aula.tempoInicio) / 1000) : 0;
          const novoTempoEstudado = aula.tempoEstudado + tempoAdicional;
          
          console.log('⏱️ Aula finalizada:', {
            titulo: aula.titulo,
            tempoAdicional,
            tempoAnterior: aula.tempoEstudado,
            novoTempo: novoTempoEstudado
          });
          
          // Atualizar tempo total estudado
          setTempoTotalEstudado(prev => prev + tempoAdicional);
          
          return {
            ...aula,
            emProgresso: false,
            tempoInicio: undefined,
            tempoEstudado: novoTempoEstudado,
            concluida: true,
            ultimaRevisao: new Date().toISOString().slice(0, 10),
          };
        }
        return aula;
      })
    );
  };

  const atualizarDuracao = (aulaId: string, novaDuracao: number) => {
    atualizarAula(aulaId, { duracao: novaDuracao });
  };

  const marcarConcluida = (aulaId: string, concluida: boolean) => {
    console.log('✅ Marcando aula como concluída:', aulaId, concluida);
    setAulas(prevAulas =>
      prevAulas.map(aula => {
        if (aula.id === aulaId) {
          // Se está marcando como concluída e ainda não tem tempo estudado, usar a duração como base
          let novoTempoEstudado = aula.tempoEstudado;
          if (concluida && aula.tempoEstudado === 0) {
            novoTempoEstudado = aula.duracao * 60; // Converter minutos para segundos
            console.log('⏱️ Aula sem tempo, usando duração:', aula.duracao, 'minutos =', novoTempoEstudado, 'segundos');
          }
          
          console.log('⏱️ Tempo estudado atualizado:', aula.tempoEstudado, '→', novoTempoEstudado);
          
          // Gerar datas de revisão se a aula está sendo marcada como concluída
          const datasRevisao = concluida ? gerarDatasRevisao(new Date().toISOString().slice(0, 10)) : [];
          
          return {
            ...aula,
            concluida,
            tempoEstudado: novoTempoEstudado,
            ultimaRevisao: concluida ? new Date().toISOString().slice(0, 10) : undefined,
            datasRevisao: concluida ? datasRevisao : aula.datasRevisao || [],
          };
        }
        return aula;
      })
    );
  };

  // Função para marcar uma revisão como feita
  const marcarRevisaoFeita = (aulaId: string, dataRevisao: string) => {
    setAulas(prevAulas =>
      prevAulas.map(aula => {
        if (aula.id === aulaId) {
          // Remover a data de revisão marcada como feita
          const datasRevisaoAtualizadas = (aula.datasRevisao || []).filter(data => data !== dataRevisao);
          
          // Adicionar à lista de revisões feitas
          const revisoesFeitas = [...(aula.revisoesFeitas || []), dataRevisao];
          
          // Se ainda há datas de revisão pendentes, não fazer nada
          // Se não há mais datas de revisão, a aula está completamente revisada
          
          return {
            ...aula,
            datasRevisao: datasRevisaoAtualizadas,
            revisoesFeitas,
          };
        }
        return aula;
      })
    );
  };

  // Funções para Especialidades
  const atualizarEspecialidade = (especialidadeId: string, dados: Partial<Especialidade>) => {
    setEspecialidades(prevEspecialidades =>
      prevEspecialidades.map(esp => 
        esp.id === especialidadeId ? { ...esp, ...dados } : esp
      )
    );
  };

  const calcularProgressoEspecialidade = (especialidadeNome: string) => {
    const topicosDaEspecialidade = topicos.filter(t => t.especialidade === especialidadeNome);
    const topicosConcluidos = topicosDaEspecialidade.filter(t => t.status === 'concluido').length;
    const progresso = topicosDaEspecialidade.length > 0 ? (topicosConcluidos / topicosDaEspecialidade.length) * 100 : 0;
    
    setEspecialidades(prevEspecialidades =>
      prevEspecialidades.map(esp => 
        esp.nome === especialidadeNome 
          ? { 
              ...esp, 
              progresso: Math.round(progresso),
              totalTopicos: topicosDaEspecialidade.length,
              topicosRevisados: topicosConcluidos
            } 
          : esp
      )
    );
  };

  // Funções para Tópicos
  const atualizarTopico = (topicoId: string, dados: Partial<Topico>) => {
    setTopicos(prevTopicos =>
      prevTopicos.map(topico => 
        topico.id === topicoId ? { ...topico, ...dados } : topico
      )
    );
  };

  const marcarTopicoConcluido = (topicoId: string) => {
    const topico = topicos.find(t => t.id === topicoId);
    if (topico) {
      atualizarTopico(topicoId, {
        status: 'concluido',
        ultimaRevisao: new Date().toISOString().slice(0, 10),
      });
      
      // Recalcular progresso da especialidade
      calcularProgressoEspecialidade(topico.especialidade);
    }
  };

  const adicionarTopico = (topico: Omit<Topico, 'id'>) => {
    const novoTopico: Topico = {
      ...topico,
      id: `topico-${Date.now()}`,
    };
    setTopicos(prev => [...prev, novoTopico]);
  };

  // Funções para Releituras
  const adicionarReleitura = (releitura: Omit<Releitura, 'id'>) => {
    const novaReleitura: Releitura = {
      ...releitura,
      id: `releitura-${Date.now()}`,
    };
    setReleituras(prev => [...prev, novaReleitura]);
  };

  const getReleiturasPorTopico = (topicoId: string) => {
    return releituras.filter(r => r.topicoId === topicoId);
  };

  // Funções para Métricas
  const atualizarMetricas = () => {
    const estatisticas = getEstatisticasGerais();
    
    const novasMetricas: Metrica[] = [
      {
        id: '1',
        titulo: 'Tópicos Revisados',
        valor: estatisticas.aulasConcluidas.toString(),
        variacao: 12,
        descricao: 'Total de tópicos revisados',
        meta: 'Meta: 200 tópicos',
        icone: 'BookOpen',
        cor: 'text-blue-600'
      },
      {
        id: '2',
        titulo: 'Tempo de Estudo',
        valor: formatarTempo(estatisticas.tempoTotalHoras),
        variacao: 8,
        descricao: 'Tempo total de estudo',
        meta: 'Meta: 500 horas',
        icone: 'Clock',
        cor: 'text-green-600'
      },
      {
        id: '3',
        titulo: 'Releituras',
        valor: estatisticas.totalReleituras.toString(),
        variacao: -3,
        descricao: 'Releituras realizadas',
        meta: 'Meta: 100 releituras',
        icone: 'RefreshCw',
        cor: 'text-purple-600'
      },
      {
        id: '4',
        titulo: 'Progresso Geral',
        valor: `${Math.round(estatisticas.progressoGeral)}%`,
        variacao: 5,
        descricao: 'Progresso geral do curso',
        meta: 'Meta: 100%',
        icone: 'TrendingUp',
        cor: 'text-orange-600'
      }
    ];
    
    setMetricas(novasMetricas);
  };

  // Estatísticas gerais
  const getEstatisticasGerais = () => {
    const totalAulas = aulas.length;
    const aulasConcluidas = aulas.filter(a => a.concluida).length;
    const progressoGeral = totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;
    
    // Calcular tempo total a partir das aulas individuais
    const tempoTotalSegundos = aulas.reduce((total, aula) => total + aula.tempoEstudado, 0);
    const tempoTotalHoras = tempoTotalSegundos / 3600;
    
    console.log('📊 Estatísticas gerais:', {
      totalAulas,
      aulasConcluidas,
      progressoGeral: Math.round(progressoGeral),
      tempoTotalSegundos,
      tempoTotalHoras: Math.round(tempoTotalHoras * 100) / 100
    });
    
    const totalReleituras = releituras.length;

    return {
      totalAulas,
      aulasConcluidas,
      progressoGeral,
      tempoTotalHoras,
      totalReleituras
    };
  };

  // Atualizar métricas quando dados mudarem
  useEffect(() => {
    atualizarMetricas();
  }, [aulas, tempoTotalEstudado, releituras]);

  const value: AulasContextType = {
    // Aulas
    aulas,
    tempoTotalEstudado,
    atualizarAula,
    iniciarAula,
    finalizarAula,
    atualizarDuracao,
    marcarConcluida,
    marcarRevisaoFeita,
    
    // Especialidades
    especialidades,
    atualizarEspecialidade,
    calcularProgressoEspecialidade,
    
    // Tópicos
    topicos,
    atualizarTopico,
    marcarTopicoConcluido,
    adicionarTopico,
    
    // Releituras
    releituras,
    adicionarReleitura,
    getReleiturasPorTopico,
    
    // Métricas
    metricas,
    atualizarMetricas,
    
    // Estatísticas
    getEstatisticasGerais,
  };

  return (
    <AulasContext.Provider value={value}>
      {children}
    </AulasContext.Provider>
  );
}

export function useAulas() {
  const context = useContext(AulasContext);
  if (context === undefined) {
    throw new Error('useAulas deve ser usado dentro de um AulasProvider');
  }
  return context;
} 