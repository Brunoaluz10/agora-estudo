"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export function Calendar({
  selected,
  onSelect,
  className = "",
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 p-3 border border-border rounded-lg bg-[#1a2233] ${className}`}>
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-foreground">
        {selected ? selected.toLocaleDateString('pt-BR') : 'Selecione uma data'}
      </span>
      <input
        type="date"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => onSelect(e.target.value ? new Date(e.target.value) : undefined)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
} 