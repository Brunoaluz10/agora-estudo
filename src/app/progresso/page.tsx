"use client";

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Award, Calendar, Clock, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import { useAulas } from '@/lib/aulas-context';
import { ProgressChart } from '@/components/ui/progress-chart';
import { ChartRadarMaterias } from '@/components/ui/chart-radar-materias';
import { ChartRadarReleituras } from '@/components/ui/chart-radar-releituras';

export default function ProgressoPage() {
  const [periodo, setPeriodo] = useState<'7dias' | '30dias' | '3meses' | '6meses'>('30dias');
  
  const { metricas, especialidades, aulas: aulasState, releituras } = useAulas();

  // Dados para gráficos baseados no contexto
  const progressoMensal = [
    { mes: "Jan", temasRevisados: 15, tempoEstudo: 20, taxaAcerto: 70, questoesRespondidas: 50 },
    { mes: "Fev", temasRevisados: 22, tempoEstudo: 25, taxaAcerto: 75, questoesRespondidas: 65 },
    { mes: "Mar", temasRevisados: 18, tempoEstudo: 22, taxaAcerto: 78, questoesRespondidas: 45 },
    { mes: "Abr", temasRevisados: 25, tempoEstudo: 28, taxaAcerto: 82, questoesRespondidas: 70 },
    { mes: "Mai", temasRevisados: 30, tempoEstudo: 32, taxaAcerto: 85, questoesRespondidas: 85 },
    { mes: "Jun", temasRevisados: 35, tempoEstudo: 35, taxaAcerto: 88, questoesRespondidas: 100 }
  ];

  // Dados para radar chart de matérias baseados nas especialidades
  const radarData = especialidades.map(esp => ({
    area: esp.nome,
    concluido: esp.topicosRevisados
  }));

  // Dados para radar chart de releituras baseados nas áreas
  const radarReleiturasData = especialidades.map(esp => {
    const releiturasDaArea = releituras.filter(r => {
      const topico = aulasState.find(a => a.id === r.topicoId);
      return topico && topico.area === esp.nome;
    });
    return {
      area: esp.nome,
      releituras: releiturasDaArea.length
    };
  });

  const IconMap: Record<string, React.ComponentType<any>> = {
    BookOpen,
    Clock,
    Target,
    Award,
    TrendingUp,
    RefreshCw
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Progresso</h1>
          </div>
          <p className="text-muted-foreground">
            Acompanhe seu desenvolvimento e performance nos estudos
          </p>
        </div>

        {/* Métricas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map((metrica) => {
            const Icon = IconMap[metrica.icone as keyof typeof IconMap];
            if (!Icon) {
              console.warn(`Ícone não encontrado: ${metrica.icone}`);
              return null;
            }
            return (
              <div key={metrica.id} className="bg-[#181818] border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${metrica.cor}`} />
                    <span className="text-sm font-medium text-muted-foreground">{metrica.titulo}</span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                
                <div className="mb-2">
                  <span className="text-2xl font-bold text-foreground">{metrica.valor}</span>
                  <span className="ml-2 text-sm font-medium text-green-600">{metrica.variacao}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">{metrica.descricao}</p>
                <p className="text-xs text-muted-foreground">{metrica.meta}</p>
              </div>
            );
          })}
        </div>

        {/* Filtros de Período */}
        <div className="bg-[#181818] border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Filtros de Período</h2>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { value: '7dias', label: 'Últimos 7 dias' },
              { value: '30dias', label: 'Últimos 30 dias' },
              { value: '3meses', label: 'Últimos 3 meses' },
              { value: '6meses', label: 'Últimos 6 meses' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriodo(option.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodo === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progresso Mensal */}
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">Progresso Mensal</h3>
            </div>
            <div className="h-64">
              <ProgressChart data={progressoMensal} />
            </div>
          </div>

          {/* Radar Chart - Matérias */}
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-foreground">Progresso por Área</h3>
            </div>
            <div className="h-64">
              <ChartRadarMaterias data={radarData} />
            </div>
          </div>
        </div>

        {/* Radar Chart - Releituras */}
        <div className="bg-[#181818] border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">Releituras por Área</h3>
          </div>
          <div className="h-64">
            <ChartRadarReleituras data={radarReleiturasData} />
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Áreas com Melhor Performance */}
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Melhores Áreas</h3>
            <div className="space-y-3">
              {radarData
                .sort((a, b) => b.concluido - a.concluido)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.area} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium text-foreground">{item.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(item.concluido / Math.max(...radarData.map(d => d.concluido))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.concluido}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Áreas que Precisam de Atenção */}
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Precisa de Atenção</h3>
            <div className="space-y-3">
              {radarData
                .sort((a, b) => a.concluido - b.concluido)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.area} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium text-foreground">{item.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(item.concluido / Math.max(...radarData.map(d => d.concluido))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.concluido}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="bg-[#181818] border border-border rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Resumo Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {aulasState.length}
              </div>
              <div className="text-sm text-muted-foreground">Total de Aulas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {aulasState.filter(a => a.concluida).length}
              </div>
              <div className="text-sm text-muted-foreground">Aulas Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round((aulasState.filter(a => a.concluida).length / aulasState.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 