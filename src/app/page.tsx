"use client";

import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  FileText, 
  Grid3X3, 
  HelpCircle, 
  Home as HomeIcon, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Settings, 
  TrendingUp, 
  Users,
  Clock,
  Target,
  Brain,
  Award,
  ChevronUp,
  ChevronDown,
  Bell
} from "lucide-react";
import { ProgressChart } from "@/components/ui/progress-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { topicos, especialidades, Topico } from "@/lib/mock-data";
import { TopicsTable } from "@/components/ui/topics-table";
import { aulas as aulasOriginais } from "../data/aulas";
import { useState, useMemo, useEffect } from "react";
import { useAulas } from "@/lib/aulas-context";
import { TopicForm } from "@/components/ui/topic-form";
import { Dialog } from "@headlessui/react";
import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartRadarMaterias } from "@/components/ui/chart-radar-materias";
import { ChartRadarReleituras } from "@/components/ui/chart-radar-releituras";
import { FilterBar } from "@/components/ui/filter-bar";
// Adicionar estilos globais para animação
import "../styles/aulas-animacao.css";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Função utilitária para obter o mês de uma data (YYYY-MM-DD → abreviação)
function getMesAbreviado(dateStr: string): string {
  if (!dateStr) return "";
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(dateStr);
  return meses[d.getMonth()] || "";
}
// Função para simular datas de conclusão para aulas sem data
function distribuirDatasConclusao(
  aulasConcluidas: Array<{ ultimaRevisao?: string } & Record<string, any>>,
  meses: string[]
): Array<{ ultimaRevisao: string } & Record<string, any>> {
  const total = aulasConcluidas.length;
  return aulasConcluidas.map((aula, idx) => {
    if (aula.ultimaRevisao) return aula as { ultimaRevisao: string } & Record<string, any>;
    // Distribui datas nos meses disponíveis
    const mesIdx = Math.floor(idx * meses.length / total);
    const ano = new Date().getFullYear();
    const mes = (new Date().getMonth() - (meses.length - 1 - mesIdx));
    const data = new Date(ano, mes, 10 + (idx % 10));
    return { ...aula, ultimaRevisao: data.toISOString().slice(0, 10) };
  });
}
// Função para gerar datas de revisão a partir da data de conclusão
function gerarDatasRevisao(dataConclusao: string) {
  const dias = [1, 3, 10, 40];
  const datas: string[] = [];
  const base = new Date(dataConclusao);
  dias.forEach(d => {
    const nova = new Date(base);
    nova.setDate(nova.getDate() + d);
    datas.push(nova.toISOString().slice(0, 10));
  });
  return datas;
}

// Definição global do tipo AulaComData
type AulaComData = typeof aulasOriginais[0] & {
  ultimaRevisao?: string;
  releituras?: number;
  datasRevisao?: string[];
  revisoesFeitas?: string[];
  releiturasExtras?: string[];
  tempoEstudado?: number; // em segundos
  concluida?: boolean;
  emProgresso?: boolean;
};

export default function Home() {
  const { 
    aulas: aulasState, 
    tempoTotalEstudado, 
    marcarConcluida,
    marcarRevisaoFeita,
    especialidades,
    metricas,
    getEstatisticasGerais
  } = useAulas();

  // Estados para filtros
  const [areaFiltro, setAreaFiltro] = useState<string>("");
  
  // Estados para especialidades
  const [especialidadesExpandidas, setEspecialidadesExpandidas] = useState(false);
  const [especialidadesVisiveis, setEspecialidadesVisiveis] = useState(3); // Mostrar apenas 3 inicialmente
  const [prioridadeFiltro, setPrioridadeFiltro] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [periodo, setPeriodo] = useState<'3meses' | '30dias' | '7dias' | '24h' | '48h'>('3meses');

  // Filtrar aulas baseado nos filtros aplicados
  const aulasFiltradas = aulasState.filter((aula: AulaComData) => {
    const matchArea = areaFiltro ? aula.area === areaFiltro : true;
    const matchPrioridade = prioridadeFiltro ? aula.prioridade === prioridadeFiltro : true;
    const matchSearch = searchTerm ? aula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    // Filtro por status
    let matchStatus = true;
    if (selectedStatus) {
      switch (selectedStatus) {
        case 'concluida':
          matchStatus = aula.concluida || false;
          break;
        case 'em_progresso':
          matchStatus = aula.emProgresso || false;
          break;
        case 'pendente':
          matchStatus = !(aula.concluida || false) && !(aula.emProgresso || false);
          break;
      }
    }
    
    return matchArea && matchPrioridade && matchSearch && matchStatus;
  });

  // Calcular métricas dinâmicas baseadas nos dados filtrados
  const metricasDinamicas = useMemo(() => {
    // Usar aulasFiltradas em vez de aulasState para que as métricas reflitam os filtros
    const aulasConcluidas = aulasFiltradas.filter(aula => aula.concluida).length;
    const totalAulas = aulasFiltradas.length;
    const progressoGeral = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;
    
    // Calcular tempo total apenas das aulas filtradas
    const tempoTotalFiltrado = aulasFiltradas.reduce((total, aula) => total + (aula.tempoEstudado || 0), 0);
    const tempoTotalHoras = Math.floor(tempoTotalFiltrado / 3600);
    const tempoTotalMinutos = Math.floor((tempoTotalFiltrado % 3600) / 60);
    const tempoTotalSegundos = tempoTotalFiltrado % 60;
    
    let tempoFormatado = '';
    if (tempoTotalHoras > 0) {
      tempoFormatado = `${tempoTotalHoras}h ${tempoTotalMinutos.toString().padStart(2, '0')}m ${tempoTotalSegundos.toString().padStart(2, '0')}s`;
    } else if (tempoTotalMinutos > 0) {
      tempoFormatado = `${tempoTotalMinutos}m ${tempoTotalSegundos.toString().padStart(2, '0')}s`;
    } else {
      tempoFormatado = `${tempoTotalSegundos}s`;
    }

    // Calcular variação baseada nas aulas filtradas do mês atual
    const mesAtual = new Date().getMonth();
    const aulasConcluidasMes = aulasFiltradas.filter(aula => {
      if (!aula.concluida || !aula.ultimaRevisao) return false;
      const dataConclusao = new Date(aula.ultimaRevisao);
      return dataConclusao.getMonth() === mesAtual;
    }).length;

    // Calcular variação percentual baseada no total de aulas (não filtradas) para contexto
    const totalAulasGeral = aulasState.length;
    const aulasConcluidasGeral = aulasState.filter(aula => aula.concluida).length;
    const progressoGeralTotal = totalAulasGeral > 0 ? Math.round((aulasConcluidasGeral / totalAulasGeral) * 100) : 0;

    // Calcular temas revisados: aulas concluídas + revisões feitas
    const totalRevisoesFeitas = aulasFiltradas.reduce((total, aula) => {
      return total + (aula.revisoesFeitas?.length || 0);
    }, 0);
    const temasRevisados = aulasConcluidas + totalRevisoesFeitas;

    // Calcular variação de temas revisados no mês atual
    const revisoesFeitasMes = aulasFiltradas.reduce((total, aula) => {
      if (!aula.revisoesFeitas) return total;
      const revisoesMes = aula.revisoesFeitas.filter(data => {
        const dataRevisao = new Date(data);
        return dataRevisao.getMonth() === mesAtual;
      }).length;
      return total + revisoesMes;
    }, 0);
    const temasRevisadosMes = aulasConcluidasMes + revisoesFeitasMes;

    return [
      {
        id: 'temas-revisados',
        titulo: 'Temas Revisados',
        valor: temasRevisados,
        variacao: temasRevisadosMes,
        descricao: 'Aulas concluídas + revisões',
        meta: `Meta: ${totalAulas} temas`,
        icone: 'BookOpen',
        cor: 'blue'
      },
      {
        id: 'tempo-estudo',
        titulo: 'Tempo de Estudo',
        valor: tempoFormatado,
        variacao: tempoTotalHoras > 0 ? Math.round(tempoTotalHoras / 10) : 0,
        descricao: 'Tempo total estudado',
        meta: 'Meta: 40h/semana',
        icone: 'Clock',
        cor: 'green'
      },
      {
        id: 'progresso-geral',
        titulo: 'Progresso Geral',
        valor: `${progressoGeral}%`,
        variacao: progressoGeral > 0 ? Math.round(progressoGeral / 10) : 0,
        descricao: 'Conclusão do programa',
        meta: 'Meta: 100%',
        icone: 'Award',
        cor: 'purple'
      }
    ];
  }, [aulasFiltradas, aulasState, tempoTotalEstudado]);

  // Atualizar modalAula para usar titulo
  const [modalAula, setModalAula] = useState<null | { titulo: string; concluindo: boolean }>(null);
  const [dataManual, setDataManual] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  // Novo estado para pop-up de releitura
  const [modalReleitura, setModalReleitura] = useState<null | { titulo: string; extra?: boolean }>(null);
  const [dataReleituraManual, setDataReleituraManual] = useState<string>("");
  // Estado para customização de intervalos
  const [intervalosRevisao, setIntervalosRevisao] = useState<number[]>([1, 3, 10, 40]);
  const [showCustomIntervalos, setShowCustomIntervalos] = useState(false);
  // Adicionar estado para data selecionada no calendário
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  function toggleConcluida(idx: number) {
    const aula = aulasState[idx];
    if (aula) {
      marcarConcluida(aula.id, !aula.concluida);
    }
  }
  function normalizarPrioridade(p: string) {
    return (p || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  function handleCheckConcluida(titulo: string) {
    const aula = aulasState.find(a => a.titulo === titulo);
    if (aula) {
      setModalAula({ titulo, concluindo: !aula.concluida });
      setDataManual("");
    }
  }
  // Ao concluir uma aula, agendar todas as revisões (D+1, D+3, D+10, D+40) usando gerarDatasRevisao.
  function confirmarConclusaoAgora() {
    if (modalAula) {
      const aula = aulasState.find(a => a.titulo === modalAula.titulo);
      if (aula) {
        marcarConcluida(aula.id, modalAula.concluindo);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setModalAula(null);
    }
  }
  function confirmarConclusaoDataManual() {
    if (modalAula && dataManual) {
      const aula = aulasState.find(a => a.titulo === modalAula.titulo);
      if (aula) {
        marcarConcluida(aula.id, modalAula.concluindo);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setModalAula(null);
    }
  }
  function cancelarConclusao() {
    setModalAula(null);
  }
  function alterarReleituras(titulo: string, delta: number) {
    // Implementar função para alterar releituras no contexto se necessário
    console.log('Alterar releituras:', titulo, delta);
  }
  function handleMarcarRevisaoFeita(titulo: string, data: string) {
    // Encontrar a aula pelo título
    const aula = aulasState.find(a => a.titulo === titulo);
    if (aula) {
      marcarRevisaoFeita(aula.id, data);
      console.log('✅ Revisão marcada como feita:', titulo, 'em', data);
    } else {
      console.log('❌ Aula não encontrada:', titulo);
    }
  }
  // Função para adicionar releitura
  function handleAddReleitura(titulo: string) {
    setModalReleitura({ titulo });
    setDataReleituraManual("");
  }
  function confirmarReleituraAgora() {
    if (modalReleitura) {
      // Implementar função para confirmar releitura no contexto se necessário
      console.log('Confirmar releitura agora:', modalReleitura.titulo);
      setModalReleitura(null);
    }
  }
  function confirmarReleituraDataManual() {
    if (modalReleitura && dataReleituraManual) {
      // Implementar função para confirmar releitura com data no contexto se necessário
      console.log('Confirmar releitura com data:', modalReleitura.titulo, dataReleituraManual);
      setModalReleitura(null);
    }
  }
  function cancelarReleitura() {
    setModalReleitura(null);
  }
  // Adicionar função para abrir modal de releitura extra
  function handleAddReleituraExtra(titulo: string) {
    setModalReleitura({ titulo, extra: true });
    setDataReleituraManual("");
  }
  // As funções confirmarReleituraExtraAgora e confirmarReleituraExtraDataManual foram removidas pois não estão integradas ao contexto global
  // Função para gerar próxima data de revisão baseada no histórico
  function proximaDataRevisao(aula: AulaComData, dataBase: string) {
    const feitas = aula.revisoesFeitas?.length || 0;
    if (feitas >= intervalosRevisao.length) return null;
    const dias = intervalosRevisao[feitas];
    const base = new Date(dataBase);
    base.setDate(base.getDate() + dias);
    return base.toISOString().slice(0, 10);
  }
  // Mapeamento de cor e emoji por área
  const areaStyles: Record<string, { color: string; emoji: string }> = {
    "Clínica Médica": { color: "text-blue-700", emoji: "🩺" },
    "Cirurgia Geral": { color: "text-red-600", emoji: "🔪" },
    "Cirurgia": { color: "text-red-600", emoji: "🔪" },
    "Pediatria": { color: "text-green-600", emoji: "🧒" },
    "Ginecologia": { color: "text-pink-600", emoji: "🤰" },
    "Ginecologia e Obstetrícia": { color: "text-pink-600", emoji: "🤰" },
    "Obstetrícia": { color: "text-pink-600", emoji: "🤰" },
    "Neurologia": { color: "text-purple-700", emoji: "🧠" },
    "Ortopedia": { color: "text-yellow-700", emoji: "🦴" },
    "Dermatologia": { color: "text-orange-600", emoji: "🩹" },
    "Psiquiatria": { color: "text-indigo-700", emoji: "💭" },
    "Cardiologia": { color: "text-rose-700", emoji: "❤️" },
    "Saúde Coletiva": { color: "text-cyan-700", emoji: "🏥" },
    "Líder de Saúde Coletiva": { color: "text-cyan-700", emoji: "🏥" },
    // Adicione mais áreas conforme necessário
  };
  // Mapeamento de cor por prioridade
  const prioridadeStyles: Record<string, string> = {
    "alta": "bg-red-100 text-red-800",
    "alta incidência": "bg-red-100 text-red-800",
    "alta incidencia": "bg-red-100 text-red-800",
    "média": "bg-yellow-100 text-yellow-800",
    "media": "bg-yellow-100 text-yellow-800",
    "intermediária": "bg-yellow-100 text-yellow-800",
    "intermediaria": "bg-yellow-100 text-yellow-800",
    "baixa": "bg-green-100 text-green-800",
    "baixa incidência": "bg-green-100 text-green-800",
    "baixa incidencia": "bg-green-100 text-green-800",
    "padrão": "bg-gray-100 text-gray-800",
    "padrao": "bg-gray-100 text-gray-800",
    "normal": "bg-gray-100 text-gray-800",
    "default": "bg-gray-100 text-gray-800",
    "incidencia padrao": "bg-gray-100 text-gray-800",
    "incidencia intermediaria": "bg-yellow-100 text-yellow-800",
  };
  // Mapeamento de cor de fundo para área
  const areaBgStyles: Record<string, string> = {
    "Clínica Médica": "bg-blue-100",
    "Cirurgia Geral": "bg-red-100",
    "Cirurgia": "bg-red-100",
    "Pediatria": "bg-green-100",
    "Ginecologia": "bg-pink-100",
    "Ginecologia e Obstetrícia": "bg-pink-100",
    "Obstetrícia": "bg-pink-100",
    "Neurologia": "bg-purple-100",
    "Ortopedia": "bg-yellow-100",
    "Dermatologia": "bg-orange-100",
    "Psiquiatria": "bg-indigo-100",
    "Cardiologia": "bg-rose-100",
    "Saúde Coletiva": "bg-cyan-100",
    "Líder de Saúde Coletiva": "bg-cyan-100",
  };
  const mesesGrafico = ["Mai", "Jun", "Jul"];
  // Função para filtrar aulas concluídas conforme o período selecionado
  function filtrarPorPeriodo(aulas: AulaComData[], periodo: string) {
    if (periodo === '3meses') return aulas;
    const agora = new Date();
    let dataLimite = new Date();
    if (periodo === '30dias') dataLimite.setDate(agora.getDate() - 30);
    else if (periodo === '7dias') dataLimite.setDate(agora.getDate() - 7);
    else if (periodo === '24h') dataLimite.setHours(agora.getHours() - 24);
    else if (periodo === '48h') dataLimite.setHours(agora.getHours() - 48);
    return aulas.filter(a => {
      if (!a.concluida) return false;
      if (!a.ultimaRevisao) return false;
      const data = new Date(a.ultimaRevisao);
      return data >= dataLimite && data <= agora;
    });
  }
  const aulasConcluidasFiltradas = useMemo(() => {
    // Só aulas filtradas e concluídas, respeitando o período
    return filtrarPorPeriodo(aulasFiltradas, periodo);
  }, [aulasFiltradas, periodo]);
  const aulasComDatas = useMemo(() => distribuirDatasConclusao(aulasConcluidasFiltradas, mesesGrafico), [aulasConcluidasFiltradas]);
  const progressoGrafico = useMemo(() => {
    // Conta quantas aulas concluídas por mês
    const porMes: Record<string, number> = {};
    const tempoPorMes: Record<string, number> = {};
    mesesGrafico.forEach(m => {
      porMes[m] = 0;
      tempoPorMes[m] = 0;
    });
    
    aulasComDatas.forEach((aula: { ultimaRevisao: string } & Record<string, any>) => {
      const mes = getMesAbreviado(aula.ultimaRevisao);
      if (mes && Object.prototype.hasOwnProperty.call(porMes, mes)) {
        porMes[mes]++;
        // Adicionar tempo de estudo real da aula
        tempoPorMes[mes] += (aula.tempoEstudado as number) || 0;
      }
    });
    
    // Progresso acumulado
    let acumulado = 0;
    let tempoAcumulado = 0;
    return mesesGrafico.map(m => {
      acumulado += porMes[m];
      tempoAcumulado += tempoPorMes[m];
      return {
        mes: m,
        temasRevisados: acumulado,
        tempoEstudo: Math.floor(tempoAcumulado / 3600), // Converter segundos para horas
        taxaAcerto: 0, // pode ser mock ou implementado futuramente
        questoesRespondidas: 0
      };
    });
  }, [aulasComDatas]);

  // Gerar dados para o radar chart: quantidade de aulas concluídas por área
  const radarData = useMemo(() => {
    const porArea: Record<string, number> = {};
    aulasConcluidasFiltradas.forEach(aula => {
      porArea[aula.area] = (porArea[aula.area] || 0) + 1;
    });
    return Object.entries(porArea).map(([area, concluido]) => ({ area, concluido }));
  }, [aulasConcluidasFiltradas]);

  // Gerar dados para o radar de releituras: quantidade de releituras por área
  const radarReleiturasData = useMemo(() => {
    const porArea: Record<string, number> = {};
    aulasFiltradas.forEach(aula => {
      porArea[aula.area] = (porArea[aula.area] || 0) + (aula.releituras ?? 0);
    });
    return Object.entries(porArea).map(([area, releituras]) => ({ area, releituras }));
  }, [aulasFiltradas]);

  const { width, height } = useWindowSize();
  const [showGraficos, setShowGraficos] = useState(true);
  const [showProgressoReleituras, setShowProgressoReleituras] = useState(true);
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });
  const [showReleiturasHoje, setShowReleiturasHoje] = useState(true);
  const [showProximasReleituras, setShowProximasReleituras] = useState(true);

  useEffect(() => {
    function updateConfettiSize() {
      setConfettiSize({
        width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth),
        height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight),
      });
    }
    updateConfettiSize();
    window.addEventListener("resize", updateConfettiSize);
    window.addEventListener("scroll", updateConfettiSize);
    return () => {
      window.removeEventListener("resize", updateConfettiSize);
      window.removeEventListener("scroll", updateConfettiSize);
    };
  }, []);

  // Calcular estatísticas resumidas de acordo com os filtros
  const totalAulasFiltradas = aulasFiltradas.length;
  const totalConcluidasFiltradas = aulasFiltradas.filter(a => a.concluida).length;
  const totalReleiturasFiltradas = aulasFiltradas.reduce((acc, a) => acc + (a.releituras ?? 0), 0);

  // Calcular revisões do dia
  const hojeStr = new Date().toISOString().slice(0, 10);
  const revisoesHoje = aulasState.filter(a => (a.datasRevisao || []).includes(hojeStr));

  // Calcular todas as datas futuras de revisões agendadas
  const hoje = new Date();
  const todasDatasFuturas = Array.from(
    new Set(
      aulasState
        .flatMap(a => (a.datasRevisao || []))
        .filter(d => new Date(d) >= hoje)
    )
  ).sort();

  // Agrupar revisões por data
  const revisoesFuturas = todasDatasFuturas.map(data => ({
    data,
    aulas: aulasState.filter(a => (a.datasRevisao || []).includes(data))
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Agora Estudo</span>
            </div>
          </div>

          {/* Quick Create Button */}
          <div className="p-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
              <span>Nova Revisão</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <div className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Grid3X3 className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Calendar className="h-5 w-5" />
                <span>Cronograma</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Progresso</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Target className="h-5 w-5" />
                <span>Questões</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Users className="h-5 w-5" />
                <span>Grupo de Estudo</span>
              </a>
            </div>

            {/* Especialidades Section */}
            <div className="pt-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Especialidades
                </h3>
                <button
                  onClick={() => {
                    setEspecialidadesExpandidas(!especialidadesExpandidas);
                    setEspecialidadesVisiveis(especialidadesExpandidas ? 3 : especialidades.length);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  {especialidadesExpandidas ? 'Recolher' : 'Expandir'}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {especialidades.slice(0, especialidadesVisiveis).map((esp) => (
                  <a 
                    key={esp.id}
                    href="#" 
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className={`h-5 w-5 rounded-full bg-${esp.cor}-500 flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{esp.nome.charAt(0)}</span>
                    </div>
                    <span className="flex-1">{esp.nome}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {esp.topicosRevisados}/{esp.totalTopicos}
                    </span>
                  </a>
                ))}
                {!especialidadesExpandidas && especialidades.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
                    +{especialidades.length - 3} mais especialidades
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col gap-2 mb-4">
              <a href="#" className="flex w-full items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 text-sm font-medium">
                <Settings className="h-5 w-5" />
                Configurações
              </a>
              <a href="#" className="flex w-full items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 text-sm font-medium">
                <HelpCircle className="h-5 w-5" />
                Ajuda
              </a>
              <a href="#" className="flex w-full items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 text-sm font-medium">
                <Search className="h-5 w-5" />
                Buscar
              </a>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Médico</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">estudante@medicina.com</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard de Estudos</h1>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricasDinamicas.map((metrica) => {
              const iconMap = {
                BookOpen,
                Clock,
                Target,
                Award
              };
              const Icon = iconMap[metrica.icone as keyof typeof iconMap] || BookOpen;
              return (
                <MetricCard
                  key={metrica.id}
                  title={metrica.titulo}
                  value={metrica.valor}
                  variation={metrica.variacao}
                  description={metrica.descricao}
                  target={metrica.meta}
                  icon={Icon}
                  color={metrica.cor as any}
                />
              );
            })}
          </div>



          {/* Box Metas do Dia */}
          <div className="bg-[#181818] rounded-lg border border-blue-400 dark:border-blue-600 shadow-md p-6 mb-8 flex flex-col gap-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-6 w-6 text-blue-500 animate-bounce" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">Releituras de Hoje</span>
              {revisoesHoje.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold animate-pulse">{revisoesHoje.length}</span>
              )}
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setShowReleiturasHoje(v => !v)}
                aria-label={showReleiturasHoje ? 'Minimizar releituras de hoje' : 'Maximizar releituras de hoje'}
                style={{ zIndex: 10 }}
              >
                <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${showReleiturasHoje ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>
            <div className={`transition-all duration-500 overflow-hidden ${showReleiturasHoje ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              style={{ minHeight: showReleiturasHoje ? undefined : 0 }}>
              {revisoesHoje.length === 0 ? (
                <div className="text-gray-300">Nenhuma releitura agendada para hoje. Aproveite para revisar conteúdos anteriores!</div>
              ) : (
                <ul className="space-y-2">
                  {revisoesHoje.map(aula => (
                    <li key={aula.titulo} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-blue-800 dark:text-blue-200">{aula.titulo}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full ${areaBgStyles[aula.area] || 'bg-gray-100'} ${areaStyles[aula.area]?.color || ''}`}>{areaStyles[aula.area]?.emoji} {aula.area}</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full ${prioridadeStyles[normalizarPrioridade(aula.prioridade)] || 'bg-gray-100 text-gray-800'}`}>{aula.prioridade}</span>
                          <span className="ml-2">Data: <b>{hojeStr.split('-').reverse().join('/')}</b></span>
                        </span>
                      </div>
                      <button
                        className="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        onClick={() => { handleMarcarRevisaoFeita(aula.titulo, hojeStr); alterarReleituras(aula.titulo, 1); }}
                      >
                        <CheckCircle className="inline-block mr-1 -mt-1" /> Marcar como feita
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Box Próximas Releituras */}
          <div className="bg-[#181818] rounded-lg border border-orange-400 dark:border-orange-600 shadow-md p-6 mb-8 flex flex-col gap-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-6 w-6 text-orange-500 animate-bounce" />
              <span className="text-lg font-bold text-orange-700 dark:text-orange-300">Próximas Releituras</span>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setShowProximasReleituras(v => !v)}
                aria-label={showProximasReleituras ? 'Minimizar próximas releituras' : 'Maximizar próximas releituras'}
                style={{ zIndex: 10 }}
              >
                <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${showProximasReleituras ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>
            <div className={`transition-all duration-500 overflow-hidden ${showProximasReleituras ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              style={{ minHeight: showProximasReleituras ? undefined : 0 }}>
              {/* Layout lado a lado para calendário e informações */}
              <div className={`flex flex-col ${selectedCalendarDate ? 'md:flex-row' : ''} gap-6 mb-4`}>
                <div className={selectedCalendarDate ? 'md:w-1/2' : 'w-full'}>
                  <DayPicker
                    mode="single"
                    selected={selectedCalendarDate}
                    onSelect={date => setSelectedCalendarDate(date as Date)}
                    className="rounded-md border shadow-sm bg-gray-900 text-white"
                    showOutsideDays
                    captionLayout="dropdown"
                    modifiers={{ 
                      hasRevisao: todasDatasFuturas.map(d => new Date(d)),
                      hoje: [new Date()]
                    }}
                    modifiersClassNames={{ 
                      hasRevisao: 'bg-orange-500 text-white font-bold',
                      hoje: 'bg-blue-500 text-white font-bold'
                    }}
                    defaultMonth={todasDatasFuturas.length > 0 ? new Date(todasDatasFuturas[0]) : undefined}
                  />
                  {todasDatasFuturas.length === 0 && (
                    <div className="text-center text-gray-300 mt-4">
                      Nenhuma revisão agendada. Conclua algumas aulas para ver as revisões no calendário!
                    </div>
                  )}
                </div>
                {selectedCalendarDate && (
                  <div className="md:w-1/2 flex flex-col justify-start">
                    {/* Exibir próximas releituras da data selecionada */}
                    {(() => {
                      const dataStr = selectedCalendarDate.toISOString().slice(0, 10);
                      const grupo = revisoesFuturas.find(g => g.data === dataStr);
                      if (!grupo || grupo.aulas.length === 0) {
                        return (
                          <div className="text-gray-300 mb-4">
                            Nenhuma revisão agendada para {selectedCalendarDate.toLocaleDateString('pt-BR')}.
                          </div>
                        );
                      }
                      return (
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="text-lg font-semibold text-orange-600 dark:text-orange-300 mb-2">
                            Revisões para {selectedCalendarDate.toLocaleDateString('pt-BR')}
                          </div>
                          <ul className="space-y-3">
                            {grupo.aulas.map(aula => (
                              <li key={aula.titulo + '-' + grupo.data} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-3 border border-orange-200 dark:border-orange-700">
                                <div className="flex flex-col gap-2">
                                  <span className="font-semibold text-orange-800 dark:text-orange-200">{aula.titulo}</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${areaBgStyles[aula.area] || 'bg-gray-100'} ${areaStyles[aula.area]?.color || ''}`}>
                                      {areaStyles[aula.area]?.emoji} {aula.area}
                                    </span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${prioridadeStyles[normalizarPrioridade(aula.prioridade)] || 'bg-gray-100 text-gray-800'}`}>
                                      {aula.prioridade}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2"
                                  onClick={() => { 
                                    handleMarcarRevisaoFeita(aula.titulo, grupo.data); 
                                    alterarReleituras(aula.titulo, 1); 
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" /> 
                                  Marcar como feita
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              
              {/* Lista geral de próximas revisões */}
              {!selectedCalendarDate && revisoesFuturas.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximas Revisões Agendadas</h3>
                  <div className="space-y-4">
                    {revisoesFuturas.slice(0, 5).map(grupo => (
                      <div key={grupo.data} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="text-sm font-semibold text-orange-600 dark:text-orange-300 mb-2">
                          {new Date(grupo.data).toLocaleDateString('pt-BR')} ({grupo.aulas.length} revisão{grupo.aulas.length > 1 ? 'ões' : 'ão'})
                        </div>
                        <ul className="space-y-2">
                          {grupo.aulas.map(aula => (
                            <li key={aula.titulo} className="flex items-center justify-between bg-gray-700 rounded px-3 py-2">
                              <span className="font-medium text-gray-900 dark:text-white">{aula.titulo}</span>
                              <button
                                className="px-3 py-1 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                                onClick={() => { 
                                  handleMarcarRevisaoFeita(aula.titulo, grupo.data); 
                                  alterarReleituras(aula.titulo, 1); 
                                }}
                              >
                                Marcar como feita
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#181818] rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 relative">
            {/* Header animado */}
            <div className="flex items-center gap-3 mb-4 animate-fade-in-down">
              <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center shadow-lg animate-bounce-in"></div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">Painel de Gráficos</span>
            </div>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setShowGraficos(v => !v)}
              aria-label={showGraficos ? 'Minimizar gráficos' : 'Maximizar gráficos'}
              style={{ zIndex: 10 }}
            >
              <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${showGraficos ? 'rotate-0' : 'rotate-180'}`} />
            </button>
            <div
              className={`transition-all duration-500 overflow-hidden ${showGraficos ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              style={{ minHeight: showGraficos ? undefined : 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Progresso por Especialidade</h2>
                  <p className="text-sm text-gray-300">Últimos 3 meses de estudo</p>
                </div>
                <div className="flex space-x-2">
                  <button className={`px-3 py-1 text-sm ${periodo === '3meses' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} rounded-md`} onClick={() => setPeriodo('3meses')}>Últimos 3 meses</button>
                  <button className={`px-3 py-1 text-sm ${periodo === '30dias' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} rounded-md`} onClick={() => setPeriodo('30dias')}>Últimos 30 dias</button>
                  <button className={`px-3 py-1 text-sm ${periodo === '7dias' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} rounded-md`} onClick={() => setPeriodo('7dias')}>Últimos 7 dias</button>
                  <button className={`px-3 py-1 text-sm ${periodo === '24h' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} rounded-md`} onClick={() => setPeriodo('24h')}>Últimas 24h</button>
                  <button className={`px-3 py-1 text-sm ${periodo === '48h' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} rounded-md`} onClick={() => setPeriodo('48h')}>Últimas 48h</button>
                </div>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#181818] rounded-lg border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center" style={{ width: 300, height: 300 }}>
                  <ProgressChart data={progressoGrafico} />
                </div>
                <ChartRadarMaterias data={radarData} />
                <ChartRadarReleituras data={radarReleiturasData} />
              </div>
            </div>
            {!showGraficos && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {totalConcluidasFiltradas} / {totalAulasFiltradas} aulas concluídas
                </div>
                <div className="text-lg text-gray-700 dark:text-gray-200">
                  Total de releituras: <span className="font-bold text-orange-500">{totalReleiturasFiltradas}</span>
                </div>
              </div>
            )}
          </div>

          {/* Progresso por especialidade (releituras) */}
          <div className="bg-[#181818] rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 relative">
            {/* Header animado */}
            <div className="flex items-center gap-3 mb-4 animate-fade-in-down">
              <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center shadow-lg animate-bounce-in"></div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">Progresso de Releituras por Especialidade</span>
            </div>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setShowProgressoReleituras(v => !v)}
              aria-label={showProgressoReleituras ? 'Minimizar progresso de releituras' : 'Maximizar progresso de releituras'}
              style={{ zIndex: 10 }}
            >
              <ChevronUp className={`h-5 w-5 transition-transform duration-300 ${showProgressoReleituras ? 'rotate-0' : 'rotate-180'}`} />
            </button>
            <div
              className={`transition-all duration-500 overflow-hidden ${showProgressoReleituras ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              style={{ minHeight: showProgressoReleituras ? undefined : 0 }}
            >
              <h2 className="text-lg font-semibold text-white mb-4">Progresso de Releituras por Especialidade</h2>
              <ul className="space-y-2">
                {radarReleiturasData.map(item => (
                  <li key={item.area} className="flex items-center justify-between">
                    <span className="font-medium">{item.area}</span>
                    <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 px-3 py-1 rounded-full font-mono">{item.releituras}</span>
                  </li>
                ))}
              </ul>
            </div>
            {!showProgressoReleituras && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  Total de releituras: {totalReleiturasFiltradas}
                </div>
              </div>
            )}
          </div>

          {/* Box de customização de intervalos */}
          <div className="mb-4">
            <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => setShowCustomIntervalos(v => !v)}>
              {showCustomIntervalos ? 'Ocultar' : 'Customizar'} intervalos de revisão
            </button>
            {showCustomIntervalos && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs text-gray-600 dark:text-gray-300">Intervalos (em dias, separados por vírgula):</label>
                <input
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
                  value={intervalosRevisao.join(",")}
                  onChange={e => {
                    const val = e.target.value.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
                    setIntervalosRevisao(val.length ? val : [1, 3, 10, 40]);
                  }}
                />
                <span className="text-xs text-gray-500">Exemplo: 1,3,10,40</span>
              </div>
            )}
          </div>

          {/* Filtros de Progresso */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Filtros de Progresso</h2>
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedArea={areaFiltro}
              onAreaChange={setAreaFiltro}
              selectedPriority={prioridadeFiltro}
              onPriorityChange={setPrioridadeFiltro}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              areas={Array.from(new Set(aulasOriginais.map((a: typeof aulasOriginais[0]) => a.area)))}
              priorities={Array.from(new Set(aulasOriginais.map((a: typeof aulasOriginais[0]) => a.prioridade)))}
              onClearFilters={() => { setAreaFiltro(""); setPrioridadeFiltro(""); setSearchTerm(""); setSelectedStatus(""); }}
              showStatusFilter={true}
            />
          </div>

          {/* Tabela de aulas */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tabela de Aulas</h2>
            <div className="bg-[#181818] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Aula</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Área</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Prioridade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Concluída</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Releituras</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aulasFiltradas.map((aula: AulaComData) => (
                      <tr
                        key={aula.titulo}
                        className={`border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${aula.concluida ? "bg-green-50 dark:bg-green-900/30 aulas-concluida" : ""}`}
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white flex items-center gap-2">
                          {areaStyles[aula.area]?.emoji && (
                            <span className="mr-1 text-lg align-middle">{areaStyles[aula.area].emoji}</span>
                          )}
                          {aula.titulo}
                          {aula.concluida && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-200 text-green-800 animate-pop">Concluída</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`
                              inline-block px-3 py-1 rounded-full text-xs font-semibold
                              ${areaBgStyles[aula.area] || 'bg-gray-100'}
                              ${areaStyles[aula.area]?.color || ''}
                              whitespace-nowrap
                            `}
                          >
                            {areaStyles[aula.area]?.emoji} {aula.area}
                          </span>
                        </td>
                        <td className={`py-3 px-4`}>
                          <span
                            className={`
                              px-2 py-0.5 rounded-full font-semibold
                              text-xs sm:text-sm
                              text-center
                              break-words whitespace-normal
                              max-w-[120px] inline-block
                              ${prioridadeStyles[normalizarPrioridade(aula.prioridade)] || 'bg-gray-100 text-gray-800'}
                            `}
                          >
                            {aula.prioridade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={aula.concluida}
                            onCheckedChange={() => handleCheckConcluida(aula.titulo)}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                              onClick={() => alterarReleituras(aula.titulo, -1)}
                              disabled={aula.releituras === 0}>-</button>
                            <span className="min-w-[2ch] text-center font-mono bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 px-3 py-1 rounded-full">{aula.releituras ?? 0}</span>
                            <button className="px-2 py-1 rounded bg-orange-200 dark:bg-orange-700 text-lg font-bold hover:bg-orange-300 dark:hover:bg-orange-600 text-orange-900 dark:text-orange-100"
                              onClick={() => handleAddReleituraExtra(aula.titulo)}>+</button>
                          </div>
                          {aula.revisoesFeitas && aula.revisoesFeitas.length > 0 && (
                            <span className="text-[10px] text-gray-500 block mt-1">{aula.revisoesFeitas.map((d, i) => <span key={d}>{i > 0 && ', '}{d.split('-').reverse().join('/')}</span>)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showConfetti && (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none" style={{ width: confettiSize.width, height: confettiSize.height }}>
    <Confetti width={confettiSize.width} height={confettiSize.height} numberOfPieces={350} recycle={false} />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/40 rounded-2xl p-8 flex flex-col items-center animate-celebrate-message">
        <span className="text-5xl md:text-7xl mb-4 animate-bounce">🎉</span>
        <span className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg animate-fade-in">Parabéns! Aula concluída!</span>
      </div>
    </div>
  </div>
)}
      {/* Modal de pop-up para releitura */}
      <Dialog open={!!modalReleitura} onClose={cancelarReleitura} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl p-10 max-w-xl w-full shadow-2xl border-4 border-orange-500 flex flex-col items-center relative">
            <Dialog.Title className="text-2xl font-bold mb-4 text-orange-700 dark:text-orange-300 text-center">
              {modalReleitura?.extra ? "Adicionar releitura extra" : "Adicionar releitura"}
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-lg text-gray-700 dark:text-gray-200 text-center">
              Deseja marcar a releitura {modalReleitura?.extra ? "extra " : ""}para hoje ou escolher uma data?
            </Dialog.Description>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition" onClick={modalReleitura?.extra ? confirmarReleituraAgora : confirmarReleituraAgora}>Sim, fiz releitura hoje</button>
              <div className="flex items-center gap-2">
                <input type="date" className="border rounded px-3 py-2 text-base flex-1" value={dataReleituraManual} onChange={e => setDataReleituraManual(e.target.value)} />
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition" disabled={!dataReleituraManual} onClick={modalReleitura?.extra ? confirmarReleituraDataManual : confirmarReleituraDataManual}>Releitura com data</button>
              </div>
              <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 mt-2 transition" onClick={cancelarReleitura}>Cancelar</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Modal de pop-up para conclusão de aula */}
      <Dialog open={!!modalAula} onClose={cancelarConclusao} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl p-10 max-w-xl w-full shadow-2xl border-4 border-blue-500 flex flex-col items-center relative">
            <Dialog.Title className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300 text-center">Concluiu agora?</Dialog.Title>
            <Dialog.Description className="mb-6 text-lg text-gray-700 dark:text-gray-200 text-center">Deseja marcar a aula como concluída na data de hoje ou escolher uma data?</Dialog.Description>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition" onClick={confirmarConclusaoAgora}>Sim, concluí agora</button>
              <div className="flex items-center gap-2">
                <input type="date" className="border rounded px-3 py-2 text-base flex-1" value={dataManual} onChange={e => setDataManual(e.target.value)} />
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition" disabled={!dataManual} onClick={confirmarConclusaoDataManual}>Concluir com data</button>
              </div>
              <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 mt-2 transition" onClick={cancelarConclusao}>Cancelar</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}