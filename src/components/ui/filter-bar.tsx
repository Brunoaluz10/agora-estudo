"use client";

import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedArea: string;
  onAreaChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  areas: string[];
  priorities: string[];
  onClearFilters: () => void;
  showStatusFilter?: boolean;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedArea,
  onAreaChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  areas,
  priorities,
  onClearFilters,
  showStatusFilter = true
}: FilterBarProps) {
  const hasActiveFilters = searchTerm || selectedArea || selectedPriority || selectedStatus;

  return (
    <div className="bg-[#181818] border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por Área */}
        <div className="lg:w-48">
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as áreas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Prioridade */}
        <div className="lg:w-40">
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as prioridades</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status */}
        {showStatusFilter && (
          <div className="lg:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="concluida">Concluída</option>
              <option value="em_progresso">Em progresso</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        )}

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="lg:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Indicadores de filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md">
              Busca: "{searchTerm}"
            </span>
          )}
          {selectedArea && (
            <span className="px-2 py-1 bg-green-600 text-white text-sm rounded-md">
              Área: {selectedArea}
            </span>
          )}
          {selectedPriority && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-sm rounded-md">
              Prioridade: {selectedPriority}
            </span>
          )}
          {selectedStatus && (
            <span className="px-2 py-1 bg-purple-600 text-white text-sm rounded-md">
              Status: {selectedStatus === 'concluida' ? 'Concluída' : selectedStatus === 'em_progresso' ? 'Em progresso' : 'Pendente'}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 