/**
 * Middleware de Segurança - Interceptação e Análise de Ações
 * 
 * Este middleware intercepta ações antes de serem executadas e:
 * - Analisa comandos de terminal
 * - Verifica operações de arquivo
 * - Monitora downloads e URLs
 * - Solicita confirmação para ações perigosas
 */

import { securityMonitor, SecurityAlert } from './security';

export interface SecurityMiddlewareConfig {
  enabled: boolean;
  requireConfirmation: boolean;
  logActions: boolean;
  autoBlock: boolean;
  allowedCommands: string[];
  blockedCommands: string[];
  allowedDomains: string[];
  blockedDomains: string[];
}

export interface SecurityAction {
  type: 'COMMAND' | 'FILE' | 'NETWORK' | 'DOWNLOAD' | 'INSTALL';
  action: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface SecurityResult {
  allowed: boolean;
  alerts: SecurityAlert[];
  requiresConfirmation: boolean;
  reason?: string;
  suggestedAction?: string;
}

export class SecurityMiddleware {
  private config: SecurityMiddlewareConfig;
  private actionHistory: SecurityAction[] = [];
  private blockedActions: SecurityAction[] = [];

  constructor(config: Partial<SecurityMiddlewareConfig> = {}) {
    this.config = {
      enabled: true,
      requireConfirmation: true,
      logActions: true,
      autoBlock: false,
      allowedCommands: [],
      blockedCommands: [],
      allowedDomains: [],
      blockedDomains: [],
      ...config
    };
  }

  /**
   * Analisa uma ação antes de permitir sua execução
   */
  async analyzeAction(action: SecurityAction): Promise<SecurityResult> {
    if (!this.config.enabled) {
      return {
        allowed: true,
        alerts: [],
        requiresConfirmation: false
      };
    }

    // Registrar ação no histórico
    if (this.config.logActions) {
      this.actionHistory.push(action);
    }

    // Analisar a ação usando o monitor de segurança
    const alerts = securityMonitor.analyzeAction(action.action);
    
    // Verificar regras personalizadas
    const customAlerts = this.checkCustomRules(action);
    alerts.push(...customAlerts);

    // Determinar se a ação deve ser bloqueada
    const shouldBlock = this.shouldBlockAction(action, alerts);
    
    // Verificar se requer confirmação
    const requiresConfirmation = this.config.requireConfirmation && 
      alerts.some(alert => alert.requiresConfirmation);

    if (shouldBlock) {
      this.blockedActions.push(action);
      return {
        allowed: false,
        alerts,
        requiresConfirmation: false,
        reason: 'Ação bloqueada por regras de segurança',
        suggestedAction: 'Revise a ação e tente novamente'
      };
    }

    return {
      allowed: true,
      alerts,
      requiresConfirmation,
      suggestedAction: this.getSuggestedAction(alerts)
    };
  }

  /**
   * Verifica regras personalizadas de segurança
   */
  private checkCustomRules(action: SecurityAction): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];

    // Verificar comandos bloqueados
    if (action.type === 'COMMAND') {
      const command = action.action.toLowerCase();
      
      for (const blockedCmd of this.config.blockedCommands) {
        if (command.includes(blockedCmd.toLowerCase())) {
          alerts.push({
            level: 'CRITICAL',
            category: 'SYSTEM',
            message: '🚫 COMANDO BLOQUEADO: Comando não permitido',
            details: `O comando "${action.action}" está na lista de comandos bloqueados.`,
            timestamp: new Date(),
            action: 'Este comando não pode ser executado por questões de segurança.',
            requiresConfirmation: false
          });
        }
      }
    }

    // Verificar domínios bloqueados
    if (action.type === 'NETWORK' || action.type === 'DOWNLOAD') {
      const url = action.metadata?.url || action.action;
      
      for (const blockedDomain of this.config.blockedDomains) {
        if (url.includes(blockedDomain)) {
          alerts.push({
            level: 'HIGH',
            category: 'NETWORK',
            message: '🌐 DOMÍNIO BLOQUEADO: Acesso a domínio não permitido',
            details: `O domínio "${blockedDomain}" está na lista de domínios bloqueados.`,
            timestamp: new Date(),
            action: 'Este domínio não pode ser acessado por questões de segurança.',
            requiresConfirmation: false
          });
        }
      }
    }

    return alerts;
  }

  /**
   * Determina se uma ação deve ser bloqueada
   */
  private shouldBlockAction(action: SecurityAction, alerts: SecurityAlert[]): boolean {
    // Bloqueio automático se configurado
    if (this.config.autoBlock) {
      return alerts.some(alert => alert.level === 'CRITICAL');
    }

    // Verificar se há alertas críticos
    const hasCriticalAlerts = alerts.some(alert => alert.level === 'CRITICAL');
    
    // Verificar se a ação está na lista de comandos bloqueados
    const isBlockedCommand = action.type === 'COMMAND' && 
      this.config.blockedCommands.some(cmd => 
        action.action.toLowerCase().includes(cmd.toLowerCase())
      );

    return hasCriticalAlerts || isBlockedCommand;
  }

  /**
   * Obtém ação sugerida baseada nos alertas
   */
  private getSuggestedAction(alerts: SecurityAlert[]): string {
    if (alerts.length === 0) return '';

    const criticalAlerts = alerts.filter(a => a.level === 'CRITICAL');
    const highAlerts = alerts.filter(a => a.level === 'HIGH');

    if (criticalAlerts.length > 0) {
      return 'Recomendamos cancelar esta ação e revisar as implicações de segurança.';
    }

    if (highAlerts.length > 0) {
      return 'Recomendamos revisar cuidadosamente antes de prosseguir.';
    }

    return 'Ação pode prosseguir com atenção.';
  }

  /**
   * Analisa um comando de terminal
   */
  async analyzeCommand(command: string, metadata?: Record<string, any>): Promise<SecurityResult> {
    return this.analyzeAction({
      type: 'COMMAND',
      action: command,
      metadata,
      timestamp: new Date()
    });
  }

  /**
   * Analisa uma operação de arquivo
   */
  async analyzeFileOperation(
    operation: 'read' | 'write' | 'delete',
    filePath: string,
    metadata?: Record<string, any>
  ): Promise<SecurityResult> {
    const action = `${operation} ${filePath}`;
    return this.analyzeAction({
      type: 'FILE',
      action,
      metadata: { filePath, operation, ...metadata },
      timestamp: new Date()
    });
  }

  /**
   * Analisa um download ou acesso de rede
   */
  async analyzeNetworkAction(
    url: string,
    type: 'DOWNLOAD' | 'NETWORK' = 'NETWORK',
    metadata?: Record<string, any>
  ): Promise<SecurityResult> {
    return this.analyzeAction({
      type,
      action: url,
      metadata: { url, ...metadata },
      timestamp: new Date()
    });
  }

  /**
   * Analisa uma instalação de dependência
   */
  async analyzeInstallAction(
    packageName: string,
    packageManager: string,
    metadata?: Record<string, any>
  ): Promise<SecurityResult> {
    const action = `${packageManager} install ${packageName}`;
    return this.analyzeAction({
      type: 'INSTALL',
      action,
      metadata: { packageName, packageManager, ...metadata },
      timestamp: new Date()
    });
  }

  /**
   * Obtém estatísticas de segurança
   */
  getSecurityStats() {
    return {
      totalActions: this.actionHistory.length,
      blockedActions: this.blockedActions.length,
      criticalAlerts: securityMonitor.getAlertsByLevel('CRITICAL').length,
      highAlerts: securityMonitor.getAlertsByLevel('HIGH').length,
      mediumAlerts: securityMonitor.getAlertsByLevel('MEDIUM').length,
      lowAlerts: securityMonitor.getAlertsByLevel('LOW').length,
      isEnabled: this.config.enabled
    };
  }

  /**
   * Obtém histórico de ações
   */
  getActionHistory(limit: number = 50): SecurityAction[] {
    return this.actionHistory.slice(-limit);
  }

  /**
   * Obtém ações bloqueadas
   */
  getBlockedActions(): SecurityAction[] {
    return [...this.blockedActions];
  }

  /**
   * Limpa histórico de ações
   */
  clearHistory(): void {
    this.actionHistory = [];
    this.blockedActions = [];
  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig: Partial<SecurityMiddlewareConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Adiciona comando à lista de bloqueados
   */
  blockCommand(command: string): void {
    if (!this.config.blockedCommands.includes(command)) {
      this.config.blockedCommands.push(command);
    }
  }

  /**
   * Remove comando da lista de bloqueados
   */
  unblockCommand(command: string): void {
    this.config.blockedCommands = this.config.blockedCommands.filter(cmd => cmd !== command);
  }

  /**
   * Adiciona domínio à lista de bloqueados
   */
  blockDomain(domain: string): void {
    if (!this.config.blockedDomains.includes(domain)) {
      this.config.blockedDomains.push(domain);
    }
  }

  /**
   * Remove domínio da lista de bloqueados
   */
  unblockDomain(domain: string): void {
    this.config.blockedDomains = this.config.blockedDomains.filter(d => d !== domain);
  }
}

// Instância global do middleware de segurança
export const securityMiddleware = new SecurityMiddleware();

/**
 * Hook para usar o middleware de segurança em componentes React
 */
export function useSecurityMiddleware() {
  const [stats, setStats] = React.useState(securityMiddleware.getSecurityStats());
  const [history, setHistory] = React.useState<SecurityAction[]>([]);

  React.useEffect(() => {
    setHistory(securityMiddleware.getActionHistory());
  }, []);

  const analyzeCommand = React.useCallback(async (command: string, metadata?: Record<string, any>) => {
    const result = await securityMiddleware.analyzeCommand(command, metadata);
    setStats(securityMiddleware.getSecurityStats());
    setHistory(securityMiddleware.getActionHistory());
    return result;
  }, []);

  const analyzeFileOperation = React.useCallback(async (
    operation: 'read' | 'write' | 'delete',
    filePath: string,
    metadata?: Record<string, any>
  ) => {
    const result = await securityMiddleware.analyzeFileOperation(operation, filePath, metadata);
    setStats(securityMiddleware.getSecurityStats());
    setHistory(securityMiddleware.getActionHistory());
    return result;
  }, []);

  const analyzeNetworkAction = React.useCallback(async (
    url: string,
    type: 'DOWNLOAD' | 'NETWORK' = 'NETWORK',
    metadata?: Record<string, any>
  ) => {
    const result = await securityMiddleware.analyzeNetworkAction(url, type, metadata);
    setStats(securityMiddleware.getSecurityStats());
    setHistory(securityMiddleware.getActionHistory());
    return result;
  }, []);

  const analyzeInstallAction = React.useCallback(async (
    packageName: string,
    packageManager: string,
    metadata?: Record<string, any>
  ) => {
    const result = await securityMiddleware.analyzeInstallAction(packageName, packageManager, metadata);
    setStats(securityMiddleware.getSecurityStats());
    setHistory(securityMiddleware.getActionHistory());
    return result;
  }, []);

  const clearHistory = React.useCallback(() => {
    securityMiddleware.clearHistory();
    setStats(securityMiddleware.getSecurityStats());
    setHistory([]);
  }, []);

  return {
    stats,
    history,
    analyzeCommand,
    analyzeFileOperation,
    analyzeNetworkAction,
    analyzeInstallAction,
    clearHistory,
    getBlockedActions: securityMiddleware.getBlockedActions.bind(securityMiddleware),
    updateConfig: securityMiddleware.updateConfig.bind(securityMiddleware),
    blockCommand: securityMiddleware.blockCommand.bind(securityMiddleware),
    unblockCommand: securityMiddleware.unblockCommand.bind(securityMiddleware),
    blockDomain: securityMiddleware.blockDomain.bind(securityMiddleware),
    unblockDomain: securityMiddleware.unblockDomain.bind(securityMiddleware)
  };
}

// Import do React para o hook
import React from 'react'; 