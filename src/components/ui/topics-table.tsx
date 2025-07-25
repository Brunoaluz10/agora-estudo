import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Topico } from "@/lib/mock-data";

interface TopicsTableProps {
  topicos: Topico[];
  onEdit?: (topico: Topico) => void;
  onDelete?: (id: string) => void;
}

const getStatusColor = (status: Topico['status']) => {
  switch (status) {
    case 'concluido':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'em_revisao':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'pendente':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const getStatusText = (status: Topico['status']) => {
  switch (status) {
    case 'concluido':
      return 'Concluído';
    case 'em_revisao':
      return 'Em Revisão';
    case 'pendente':
      return 'Pendente';
    default:
      return 'Pendente';
  }
};

const getPriorityColor = (prioridade: Topico['prioridade']) => {
  switch (prioridade) {
    case 'alta':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'baixa':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const getPriorityText = (prioridade: Topico['prioridade']) => {
  switch (prioridade) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Média';
    case 'baixa':
      return 'Baixa';
    default:
      return 'Média';
  }
};

export function TopicsTable({ topicos, onEdit, onDelete }: TopicsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Tópicos Prioritários
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Revisões Pendentes 
              <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                {topicos.filter(t => t.status === 'pendente').length}
              </span>
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Concluídos 
              <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                {topicos.filter(t => t.status === 'concluido').length}
              </span>
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Dificuldade Alta
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <span>Personalizar Colunas</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
              <span>Adicionar Tópico</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Tópico
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Especialidade
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Prioridade
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Última Revisão
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Próxima Revisão
              </th>
              <th className="text-left py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {topicos.map((topico) => (
              <tr key={topico.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {topico.nome}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {topico.especialidade}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(topico.status)}`}>
                    {getStatusText(topico.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(topico.prioridade)}`}>
                    {getPriorityText(topico.prioridade)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {topico.ultimaRevisao ? new Date(topico.ultimaRevisao).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {topico.proximaRevisao ? new Date(topico.proximaRevisao).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {onEdit && (
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar"
                      onClick={() => onEdit(topico)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Remover"
                      onClick={() => onDelete(topico.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 