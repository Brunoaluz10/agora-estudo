"use client";

import React from 'react';
import { SecurityAlert } from '@/lib/security';
import { AlertTriangle, Shield, AlertCircle, XCircle, Info } from 'lucide-react';

interface SecurityAlertProps {
  alert: SecurityAlert;
  onDismiss?: (alert: SecurityAlert) => void;
  onConfirm?: (alert: SecurityAlert) => void;
  onDeny?: (alert: SecurityAlert) => void;
}

const getAlertIcon = (level: SecurityAlert['level']) => {
  switch (level) {
    case 'CRITICAL':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'HIGH':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'MEDIUM':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'LOW':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Shield className="h-5 w-5 text-gray-500" />;
  }
};

const getAlertStyles = (level: SecurityAlert['level']) => {
  switch (level) {
    case 'CRITICAL':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'HIGH':
      return 'border-orange-200 bg-orange-50 text-orange-800';
    case 'MEDIUM':
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case 'LOW':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-800';
  }
};

const getButtonStyles = (level: SecurityAlert['level']) => {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-600 hover:bg-red-700 text-white';
    case 'HIGH':
      return 'bg-orange-600 hover:bg-orange-700 text-white';
    case 'MEDIUM':
      return 'bg-yellow-600 hover:bg-yellow-700 text-white';
    case 'LOW':
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    default:
      return 'bg-gray-600 hover:bg-gray-700 text-white';
  }
};

export function SecurityAlertComponent({ 
  alert, 
  onDismiss, 
  onConfirm, 
  onDeny 
}: SecurityAlertProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getAlertStyles(alert.level)}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getAlertIcon(alert.level)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">
              {alert.message}
            </h4>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm mb-3 opacity-90">
            {alert.details}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs opacity-75">
              <span className="capitalize">
                {alert.category.toLowerCase()}
              </span>
              <span>
                {formatTime(alert.timestamp)}
              </span>
            </div>
            
            {alert.requiresConfirmation && (onConfirm || onDeny) && (
              <div className="flex gap-2">
                {onDeny && (
                  <button
                    onClick={() => onDeny(alert)}
                    className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Negar
                  </button>
                )}
                {onConfirm && (
                  <button
                    onClick={() => onConfirm(alert)}
                    className={`px-3 py-1 text-xs rounded text-white transition-colors ${getButtonStyles(alert.level)}`}
                  >
                    Confirmar
                  </button>
                )}
              </div>
            )}
          </div>
          
          {alert.action && (
            <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
              <strong>Ação recomendada:</strong> {alert.action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SecurityAlertListProps {
  alerts: SecurityAlert[];
  onDismiss?: (alert: SecurityAlert) => void;
  onConfirm?: (alert: SecurityAlert) => void;
  onDeny?: (alert: SecurityAlert) => void;
  maxAlerts?: number;
}

export function SecurityAlertList({ 
  alerts, 
  onDismiss, 
  onConfirm, 
  onDeny, 
  maxAlerts = 10 
}: SecurityAlertListProps) {
  const sortedAlerts = [...alerts]
    .sort((a, b) => {
      const levelOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return levelOrder[b.level] - levelOrder[a.level];
    })
    .slice(0, maxAlerts);

  if (sortedAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum alerta de segurança detectado</p>
        <p className="text-sm">O sistema está monitorando atividades suspeitas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAlerts.map((alert, index) => (
        <SecurityAlertComponent
          key={`${alert.timestamp.getTime()}-${index}`}
          alert={alert}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          onDeny={onDeny}
        />
      ))}
    </div>
  );
}

interface SecurityDashboardProps {
  alerts: SecurityAlert[];
  isEnabled: boolean;
  onToggleMonitoring: (enabled: boolean) => void;
  onClearAlerts: () => void;
  onDismiss?: (alert: SecurityAlert) => void;
  onConfirm?: (alert: SecurityAlert) => void;
  onDeny?: (alert: SecurityAlert) => void;
}

export function SecurityDashboard({
  alerts,
  isEnabled,
  onToggleMonitoring,
  onClearAlerts,
  onDismiss,
  onConfirm,
  onDeny
}: SecurityDashboardProps) {
  const criticalCount = alerts.filter(a => a.level === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.level === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.level === 'MEDIUM').length;
  const lowCount = alerts.filter(a => a.level === 'LOW').length;

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Painel de Segurança</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Monitoramento:</span>
              <button
                onClick={() => onToggleMonitoring(!isEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {alerts.length > 0 && (
              <button
                onClick={onClearAlerts}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpar histórico
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-red-600">Críticos</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <div className="text-xs text-orange-600">Altos</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
            <div className="text-xs text-yellow-600">Médios</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{lowCount}</div>
            <div className="text-xs text-blue-600">Baixos</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <SecurityAlertList
          alerts={alerts}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          onDeny={onDeny}
          maxAlerts={20}
        />
      </div>
    </div>
  );
} 