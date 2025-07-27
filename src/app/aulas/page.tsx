"use client";

import React, { useState, useCallback } from 'react';
import { BookOpen, Plus, Search, Filter, Calendar, CheckCircle, Clock, Target, Play, Square } from 'lucide-react';
import { Dialog } from "@headlessui/react";
import { useAulas } from '@/lib/aulas-context';
import { FilterBar } from '@/components/ui/filter-bar';

export default function AulasPage() {
  const { aulas: aulasComTimer, iniciarAula: iniciarAulaContext, finalizarAula: finalizarAulaContext, atualizarDuracao: atualizarDuracaoContext } = useAulas();
  
  console.log('📚 Página Aulas - Aulas carregadas:', aulasComTimer.length);
  console.log('📚 Página Aulas - Primeira aula:', aulasComTimer[0]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalConfirmacao, setModalConfirmacao] = useState<null | { aulaId: string; titulo: string }>(null);

  const areas = [...new Set(aulasComTimer.map(aula => aula.area))];
  const priorities = [...new Set(aulasComTimer.map(aula => aula.prioridade))];

  const filteredAulas = aulasComTimer.filter(aula => {
    const matchesSearch = aula.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || aula.area === selectedArea;
    const matchesPriority = !selectedPriority || aula.prioridade === selectedPriority;
    
    // Filtro por status
    let matchesStatus = true;
    if (selectedStatus) {
      switch (selectedStatus) {
        case 'concluida':
          matchesStatus = aula.concluida;
          break;
        case 'em_progresso':
          matchesStatus = aula.emProgresso;
          break;
        case 'pendente':
          matchesStatus = !aula.concluida && !aula.emProgresso;
          break;
      }
    }
    
    return matchesSearch && matchesArea && matchesPriority && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setSelectedPriority('');
    setSelectedStatus('');
  };

  const areaStyles: Record<string, { color: string; emoji: string; bgColor: string }> = {
    "Clínica Médica": { color: "text-blue-700", emoji: "🩺", bgColor: "bg-blue-100" },
    "Cirurgia Geral": { color: "text-red-600", emoji: "🔪", bgColor: "bg-red-100" },
    "Pediatria": { color: "text-green-600", emoji: "🧒", bgColor: "bg-green-100" },
    "Ginecologia": { color: "text-pink-600", emoji: "🤰", bgColor: "bg-pink-100" },
    "Neurologia": { color: "text-purple-700", emoji: "🧠", bgColor: "bg-purple-100" },
    "Ortopedia": { color: "text-yellow-700", emoji: "🦴", bgColor: "bg-yellow-100" },
    "Dermatologia": { color: "text-orange-600", emoji: "🩹", bgColor: "bg-orange-100" },
    "Psiquiatria": { color: "text-indigo-700", emoji: "💭", bgColor: "bg-indigo-100" },
    "Cardiologia": { color: "text-rose-700", emoji: "❤️", bgColor: "bg-rose-100" },
    "Saúde Coletiva": { color: "text-cyan-700", emoji: "🏥", bgColor: "bg-cyan-100" },
    "Ginecologia e Obstetrícia": { color: "text-pink-600", emoji: "🤰", bgColor: "bg-pink-100" },
  };

  const priorityStyles: Record<string, string> = {
    "alta": "bg-red-100 text-red-800",
    "média": "bg-yellow-100 text-yellow-800",
    "baixa": "bg-green-100 text-green-800",
    "padrão": "bg-gray-100 text-gray-800",
  };

  const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}m ${segs.toString().padStart(2, '0')}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs.toString().padStart(2, '0')}s`;
    } else {
      return `${segs}s`;
    }
  };

  const formatarTempoTotal = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}m ${segs.toString().padStart(2, '0')}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs.toString().padStart(2, '0')}s`;
    } else {
      return `${segs}s`;
    }
  };

  const handleIniciarAula = useCallback((aulaId: string) => {
    console.log('🎯 Página Aulas - Iniciando aula:', aulaId);
    iniciarAulaContext(aulaId);
  }, [iniciarAulaContext]);

  const solicitarFinalizarAula = useCallback((aulaId: string, titulo: string) => {
    setModalConfirmacao({ aulaId, titulo });
  }, []);

  const confirmarFinalizarAula = useCallback(() => {
    if (!modalConfirmacao) return;
    
    const { aulaId } = modalConfirmacao;
    console.log('🎯 Página Aulas - Finalizando aula:', aulaId);
    finalizarAulaContext(aulaId);
    
    setModalConfirmacao(null);
  }, [modalConfirmacao, finalizarAulaContext]);

  const cancelarFinalizarAula = useCallback(() => {
    setModalConfirmacao(null);
  }, []);

  const handleAtualizarDuracao = useCallback((aulaId: string, novaDuracao: number) => {
    atualizarDuracaoContext(aulaId, novaDuracao);
  }, [atualizarDuracaoContext]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Aulas</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie suas aulas e acompanhe seu progresso de estudo
          </p>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 mb-2">🔍 <strong>Debug:</strong> Teste o sistema de tempo</p>
            <p className="text-xs text-blue-400">
              1. Clique em "Iniciar" em uma aula<br/>
              2. Aguarde alguns segundos<br/>
              3. Clique em "Finalizar"<br/>
              4. Verifique o console (F12) para logs
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Aulas</p>
                <p className="text-2xl font-bold text-foreground">{aulasComTimer.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-foreground">
                  {aulasComTimer.filter(a => a.concluida).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Progresso</p>
                <p className="text-2xl font-bold text-foreground">
                  {aulasComTimer.filter(a => a.emProgresso).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-[#181818] border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Total Estudado</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatarTempoTotal(aulasComTimer.reduce((sum, aula) => sum + aula.tempoEstudado, 0))}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          areas={areas}
          priorities={priorities}
          onClearFilters={clearFilters}
        />

        {/* Aulas List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAulas.map((aula) => (
            <div
              key={aula.id}
              className={`bg-[#181818] border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-lg ${
                aula.concluida ? 'opacity-75' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[aula.prioridade] || 'bg-gray-100 text-gray-800'}`}>
                      {aula.prioridade}
                    </span>
                    {aula.concluida && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {aula.emProgresso && (
                      <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{aula.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{aula.area}</p>
                </div>
              </div>

              {/* Timer Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tempo estudado:</span>
                  <span className="font-mono text-foreground">
                    {formatarTempo(aula.tempoEstudado)}
                  </span>
                </div>
                {aula.emProgresso && (
                  <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/20 rounded-md">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Em progresso</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Duration Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  value={aula.duracao}
                  onChange={(e) => handleAtualizarDuracao(aula.id, parseInt(e.target.value) || 1)}
                  disabled={aula.emProgresso}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-[#1a2233] text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {aula.emProgresso ? (
                  <button
                    onClick={() => solicitarFinalizarAula(aula.id, aula.titulo)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Finalizar
                  </button>
                ) : (
                  <button
                    onClick={() => handleIniciarAula(aula.id)}
                    disabled={aula.concluida}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4" />
                    Iniciar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAulas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma aula encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedArea || selectedPriority || selectedStatus
                ? "Tente ajustar os filtros para encontrar mais aulas."
                : "Não há aulas cadastradas ainda."}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog
        open={modalConfirmacao !== null}
        onClose={cancelarFinalizarAula}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#181818] border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Confirmar Finalização
            </Dialog.Title>
            
            <Dialog.Description className="text-gray-300 mb-6">
              Tem certeza que quer terminar a aula "{modalConfirmacao?.titulo}"?
            </Dialog.Description>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelarFinalizarAula}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarFinalizarAula}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sim, finalizar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 