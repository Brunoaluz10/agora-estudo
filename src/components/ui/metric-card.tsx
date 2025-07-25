import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  variation: number;
  description: string;
  target: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange' | 'pink';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    icon: 'text-blue-600',
    variation: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    icon: 'text-green-600',
    variation: 'text-green-600 dark:text-green-400'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    icon: 'text-yellow-600',
    variation: 'text-yellow-600 dark:text-yellow-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    icon: 'text-purple-600',
    variation: 'text-purple-600 dark:text-purple-400'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    icon: 'text-red-600',
    variation: 'text-red-600 dark:text-red-400'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    icon: 'text-orange-600',
    variation: 'text-orange-600 dark:text-orange-400'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/20',
    icon: 'text-pink-600',
    variation: 'text-pink-600 dark:text-pink-400'
  }
};

export function MetricCard({ 
  title, 
  value, 
  variation, 
  description, 
  target, 
  icon: Icon, 
  color 
}: MetricCardProps) {
  const colors = colorClasses[color];
  const isPositive = variation >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{variation}%
            </span>
          </div>
        </div>
        <div className={`h-12 w-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {description}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {target}
      </p>
    </div>
  );
} 