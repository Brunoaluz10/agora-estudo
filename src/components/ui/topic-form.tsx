import { useState } from "react";
import { Especialidade, Topico } from "@/lib/mock-data";

interface TopicFormProps {
  especialidades: Especialidade[];
  initial?: Partial<Topico>;
  onSubmit: (data: Omit<Topico, "id">) => void;
  onCancel: () => void;
}

export function TopicForm({ especialidades, initial = {}, onSubmit, onCancel }: TopicFormProps) {
  const [nome, setNome] = useState(initial.nome || "");
  const [especialidade, setEspecialidade] = useState(initial.especialidade || especialidades[0]?.nome || "");
  const [prioridade, setPrioridade] = useState<Topico["prioridade"]>(initial.prioridade || "media");
  const [status, setStatus] = useState<Topico["status"]>(initial.status || "pendente");
  const [dificuldade, setDificuldade] = useState<Topico["dificuldade"]>(initial.dificuldade || "medio");
  const [ultimaRevisao, setUltimaRevisao] = useState(initial.ultimaRevisao || "");
  const [proximaRevisao, setProximaRevisao] = useState(initial.proximaRevisao || "");
  const [fonte, setFonte] = useState(initial.fonte || "");
  const [observacoes, setObservacoes] = useState(initial.observacoes || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      nome,
      especialidade,
      prioridade,
      status,
      dificuldade,
      ultimaRevisao: ultimaRevisao || undefined,
      proximaRevisao: proximaRevisao || undefined,
      fonte: fonte || undefined,
      observacoes: observacoes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nome do Tópico</label>
        <input className="w-full border rounded px-3 py-2" value={nome} onChange={e => setNome(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Especialidade</label>
        <select className="w-full border rounded px-3 py-2" value={especialidade} onChange={e => setEspecialidade(e.target.value)} required>
          {especialidades.map(e => (
            <option key={e.id} value={e.nome}>{e.nome}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Prioridade</label>
          <select className="w-full border rounded px-3 py-2" value={prioridade} onChange={e => setPrioridade(e.target.value as any)}>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="pendente">Pendente</option>
            <option value="em_revisao">Em Revisão</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Dificuldade</label>
          <select className="w-full border rounded px-3 py-2" value={dificuldade} onChange={e => setDificuldade(e.target.value as any)}>
            <option value="facil">Fácil</option>
            <option value="medio">Média</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Última Revisão</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={ultimaRevisao} onChange={e => setUltimaRevisao(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Próxima Revisão</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={proximaRevisao} onChange={e => setProximaRevisao(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fonte</label>
        <input className="w-full border rounded px-3 py-2" value={fonte} onChange={e => setFonte(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Observações</label>
        <textarea className="w-full border rounded px-3 py-2" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
      </div>
    </form>
  );
} 