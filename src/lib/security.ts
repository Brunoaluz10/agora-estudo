/**
 * Sistema de Segurança - Monitoramento de Interações Potencialmente Perigosas
 * 
 * Este módulo implementa regras de segurança para detectar e alertar sobre:
 * - Comandos de sistema perigosos
 * - Acesso a arquivos sensíveis
 * - Modificações em configurações críticas
 * - Operações de rede suspeitas
 * - Alterações em dependências de segurança
 */

export interface SecurityAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'SYSTEM' | 'FILE' | 'NETWORK' | 'DEPENDENCY' | 'CONFIG';
  message: string;
  details: string;
  timestamp: Date;
  action: string;
  requiresConfirmation: boolean;
}

export interface SecurityRule {
  id: string;
  name: string;
  pattern: RegExp | string;
  category: SecurityAlert['category'];
  level: SecurityAlert['level'];
  message: string;
  details: string;
  action: string;
  requiresConfirmation: boolean;
}

// Regras de segurança predefinidas
export const SECURITY_RULES: SecurityRule[] = [
  // Comandos de sistema perigosos
  {
    id: 'system-rm',
    name: 'Remoção de Arquivos',
    pattern: /\brm\s+(-rf?|--recursive|--force)/i,
    category: 'SYSTEM',
    level: 'CRITICAL',
    message: '⚠️ COMANDO PERIGOSO DETECTADO: Remoção recursiva de arquivos',
    details: 'Este comando pode deletar permanentemente arquivos e pastas importantes do sistema.',
    action: 'Confirme se realmente deseja executar este comando de remoção.',
    requiresConfirmation: true
  },
  {
    id: 'system-format',
    name: 'Formatação de Disco',
    pattern: /\b(format|mkfs|fdisk|dd)\b/i,
    category: 'SYSTEM',
    level: 'CRITICAL',
    message: '🚨 COMANDO CRÍTICO: Operação de formatação de disco detectada',
    details: 'Este comando pode apagar completamente dados do disco rígido.',
    action: 'Requer confirmação explícita antes de prosseguir.',
    requiresConfirmation: true
  },
  {
    id: 'system-sudo',
    name: 'Privilégios Elevados',
    pattern: /\bsudo\b/i,
    category: 'SYSTEM',
    level: 'HIGH',
    message: '🔐 PRIVILÉGIOS ELEVADOS: Comando com sudo detectado',
    details: 'Este comando será executado com privilégios de administrador.',
    action: 'Verifique se o comando é seguro antes de confirmar.',
    requiresConfirmation: true
  },
  
  // Acesso a arquivos sensíveis
  {
    id: 'file-env',
    name: 'Arquivo de Ambiente',
    pattern: /\.env/,
    category: 'FILE',
    level: 'HIGH',
    message: '🔑 ARQUIVO SENSÍVEL: Acesso a arquivo .env detectado',
    details: 'Este arquivo pode conter senhas, chaves de API e outras credenciais.',
    action: 'Confirme se o acesso é necessário e seguro.',
    requiresConfirmation: true
  },
  {
    id: 'file-config',
    name: 'Arquivo de Configuração',
    pattern: /(config|\.config|\.json|\.yaml|\.yml)$/i,
    category: 'FILE',
    level: 'MEDIUM',
    message: '⚙️ ARQUIVO DE CONFIGURAÇÃO: Modificação detectada',
    details: 'Alterações em arquivos de configuração podem afetar o comportamento do sistema.',
    action: 'Revise as mudanças antes de aplicar.',
    requiresConfirmation: false
  },
  
  // Operações de rede
  {
    id: 'network-curl',
    name: 'Download de Arquivo',
    pattern: /\bcurl\s+(-O|-o|--output)/i,
    category: 'NETWORK',
    level: 'MEDIUM',
    message: '📥 DOWNLOAD: Download de arquivo via curl detectado',
    details: 'Verifique a origem e integridade do arquivo antes de executar.',
    action: 'Confirme se a fonte é confiável.',
    requiresConfirmation: true
  },
  {
    id: 'network-wget',
    name: 'Download via wget',
    pattern: /\bwget\b/i,
    category: 'NETWORK',
    level: 'MEDIUM',
    message: '📥 DOWNLOAD: Download via wget detectado',
    details: 'Verifique a origem e integridade do arquivo antes de executar.',
    action: 'Confirme se a fonte é confiável.',
    requiresConfirmation: true
  },
  
  // Dependências e pacotes
  {
    id: 'dependency-install',
    name: 'Instalação de Dependência',
    pattern: /\b(npm install|yarn add|pip install|apt install|brew install)\b/i,
    category: 'DEPENDENCY',
    level: 'MEDIUM',
    message: '📦 INSTALAÇÃO: Instalação de dependência detectada',
    details: 'Verifique se o pacote é de uma fonte confiável e não contém malware.',
    action: 'Revise a dependência antes de instalar.',
    requiresConfirmation: false
  },
  
  // Configurações do sistema
  {
    id: 'config-registry',
    name: 'Alteração de Registry',
    pattern: /\b(regedit|registry)\b/i,
    category: 'CONFIG',
    level: 'CRITICAL',
    message: '🔧 REGISTRY: Modificação no registro do Windows detectada',
    details: 'Alterações no registro podem afetar o funcionamento do sistema.',
    action: 'Requer confirmação explícita antes de prosseguir.',
    requiresConfirmation: true
  }
];

export class SecurityMonitor {
  private alerts: SecurityAlert[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.loadSettings();
  }

  /**
   * Analisa um comando ou ação para detectar riscos de segurança
   */
  analyzeAction(action: string): SecurityAlert[] {
    if (!this.isEnabled) return [];

    const detectedAlerts: SecurityAlert[] = [];

    for (const rule of SECURITY_RULES) {
      const pattern = typeof rule.pattern === 'string' 
        ? new RegExp(rule.pattern, 'i') 
        : rule.pattern;
      
      if (pattern.test(action)) {
        const alert: SecurityAlert = {
          level: rule.level,
          category: rule.category,
          message: rule.message,
          details: rule.details,
          timestamp: new Date(),
          action: rule.action,
          requiresConfirmation: rule.requiresConfirmation
        };
        
        detectedAlerts.push(alert);
        this.alerts.push(alert);
      }
    }

    return detectedAlerts;
  }

  /**
   * Analisa um arquivo para detectar riscos de segurança
   */
  analyzeFile(filePath: string, operation: 'read' | 'write' | 'delete'): SecurityAlert[] {
    if (!this.isEnabled) return [];

    const action = `${operation} ${filePath}`;
    return this.analyzeAction(action);
  }

  /**
   * Analisa uma URL para detectar riscos de segurança
   */
  analyzeUrl(url: string): SecurityAlert[] {
    if (!this.isEnabled) return [];

    const alerts: SecurityAlert[] = [];

    // Verificar URLs suspeitas
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|ps1|sh)$/i,
      /(malware|virus|hack|crack)/i,
      /(http:\/\/|ftp:\/\/)/i // URLs não seguras
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        alerts.push({
          level: 'HIGH',
          category: 'NETWORK',
          message: '🌐 URL SUSPEITA: URL potencialmente perigosa detectada',
          details: `A URL "${url}" pode conter conteúdo malicioso.`,
          timestamp: new Date(),
          action: 'Verifique a origem da URL antes de acessar.',
          requiresConfirmation: true
        });
      }
    }

    return alerts;
  }

  /**
   * Obtém todos os alertas registrados
   */
  getAlerts(): SecurityAlert[] {
    return [...this.alerts];
  }

  /**
   * Obtém alertas por nível de severidade
   */
  getAlertsByLevel(level: SecurityAlert['level']): SecurityAlert[] {
    return this.alerts.filter(alert => alert.level === level);
  }

  /**
   * Obtém alertas por categoria
   */
  getAlertsByCategory(category: SecurityAlert['category']): SecurityAlert[] {
    return this.alerts.filter(alert => alert.category === category);
  }

  /**
   * Limpa o histórico de alertas
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Habilita ou desabilita o monitoramento
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.saveSettings();
  }

  /**
   * Verifica se o monitoramento está habilitado
   */
  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Adiciona uma regra personalizada
   */
  addCustomRule(rule: SecurityRule): void {
    SECURITY_RULES.push(rule);
  }

  /**
   * Salva configurações no localStorage
   */
  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('security-monitor-enabled', this.isEnabled.toString());
    }
  }

  /**
   * Carrega configurações do localStorage
   */
  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('security-monitor-enabled');
      this.isEnabled = saved !== 'false'; // Padrão é true
    }
  }
}

// Instância global do monitor de segurança
export const securityMonitor = new SecurityMonitor();

/**
 * Hook para usar o monitor de segurança em componentes React
 */
export function useSecurityMonitor() {
  const [alerts, setAlerts] = React.useState<SecurityAlert[]>([]);
  const [isEnabled, setIsEnabled] = React.useState(securityMonitor.isMonitoringEnabled());

  React.useEffect(() => {
    setAlerts(securityMonitor.getAlerts());
  }, []);

  const analyzeAction = React.useCallback((action: string) => {
    const newAlerts = securityMonitor.analyzeAction(action);
    setAlerts(prev => [...prev, ...newAlerts]);
    return newAlerts;
  }, []);

  const analyzeFile = React.useCallback((filePath: string, operation: 'read' | 'write' | 'delete') => {
    const newAlerts = securityMonitor.analyzeFile(filePath, operation);
    setAlerts(prev => [...prev, ...newAlerts]);
    return newAlerts;
  }, []);

  const analyzeUrl = React.useCallback((url: string) => {
    const newAlerts = securityMonitor.analyzeUrl(url);
    setAlerts(prev => [...prev, ...newAlerts]);
    return newAlerts;
  }, []);

  const clearAlerts = React.useCallback(() => {
    securityMonitor.clearAlerts();
    setAlerts([]);
  }, []);

  const setEnabled = React.useCallback((enabled: boolean) => {
    securityMonitor.setEnabled(enabled);
    setIsEnabled(enabled);
  }, []);

  return {
    alerts,
    isEnabled,
    analyzeAction,
    analyzeFile,
    analyzeUrl,
    clearAlerts,
    setEnabled,
    getAlertsByLevel: securityMonitor.getAlertsByLevel.bind(securityMonitor),
    getAlertsByCategory: securityMonitor.getAlertsByCategory.bind(securityMonitor)
  };
}

// Import do React para o hook
import React from 'react'; 