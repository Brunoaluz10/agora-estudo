"use client";

import React, { useState } from 'react';
import { SecurityDashboard } from '@/components/ui/security-alert';
import { useSecurityMiddleware } from '@/lib/security-middleware';
import { useSecurityMonitor } from '@/lib/security';
import { SecurityAlert } from '@/lib/security';
import { Shield, Terminal, FileText, Globe, Package, Settings } from 'lucide-react';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'test' | 'settings'>('dashboard');
  const [testCommand, setTestCommand] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [testFile, setTestFile] = useState('');
  const [testPackage, setTestPackage] = useState('');
  
  const securityMonitor = useSecurityMonitor();
  const securityMiddleware = useSecurityMiddleware();

  const handleTestCommand = async () => {
    if (!testCommand.trim()) return;
    
    const result = await securityMiddleware.analyzeCommand(testCommand);
    
    if (result.alerts.length > 0) {
      alert(`⚠️ ALERTA DE SEGURANÇA!\n\n${result.alerts.map(a => `${a.message}\n${a.details}`).join('\n\n')}`);
    } else {
      alert('✅ Comando analisado - Nenhum risco detectado');
    }
  };

  const handleTestUrl = async () => {
    if (!testUrl.trim()) return;
    
    const result = await securityMiddleware.analyzeNetworkAction(testUrl, 'DOWNLOAD');
    
    if (result.alerts.length > 0) {
      alert(`⚠️ ALERTA DE SEGURANÇA!\n\n${result.alerts.map(a => `${a.message}\n${a.details}`).join('\n\n')}`);
    } else {
      alert('✅ URL analisada - Nenhum risco detectado');
    }
  };

  const handleTestFile = async () => {
    if (!testFile.trim()) return;
    
    const result = await securityMiddleware.analyzeFileOperation('write', testFile);
    
    if (result.alerts.length > 0) {
      alert(`⚠️ ALERTA DE SEGURANÇA!\n\n${result.alerts.map(a => `${a.message}\n${a.details}`).join('\n\n')}`);
    } else {
      alert('✅ Operação de arquivo analisada - Nenhum risco detectado');
    }
  };

  const handleTestPackage = async () => {
    if (!testPackage.trim()) return;
    
    const result = await securityMiddleware.analyzeInstallAction(testPackage, 'npm');
    
    if (result.alerts.length > 0) {
      alert(`⚠️ ALERTA DE SEGURANÇA!\n\n${result.alerts.map(a => `${a.message}\n${a.details}`).join('\n\n')}`);
    } else {
      alert('✅ Instalação analisada - Nenhum risco detectado');
    }
  };

  const handleDismissAlert = (alert: SecurityAlert) => {
    // Implementar lógica para descartar alerta
    console.log('Alerta descartado:', alert);
  };

  const handleConfirmAlert = (alert: SecurityAlert) => {
    // Implementar lógica para confirmar ação
    console.log('Ação confirmada:', alert);
  };

  const handleDenyAlert = (alert: SecurityAlert) => {
    // Implementar lógica para negar ação
    console.log('Ação negada:', alert);
  };

  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: Shield },
    { id: 'test', label: 'Testes', icon: Terminal },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Segurança
          </h1>
          <p className="text-gray-600">
            Monitoramento e proteção contra interações potencialmente perigosas
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <SecurityDashboard
              alerts={securityMonitor.alerts}
              isEnabled={securityMonitor.isEnabled}
              onToggleMonitoring={securityMonitor.setEnabled}
              onClearAlerts={securityMonitor.clearAlerts}
              onDismiss={handleDismissAlert}
              onConfirm={handleConfirmAlert}
              onDeny={handleDenyAlert}
            />

            {/* Estatísticas do Middleware */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Estatísticas do Sistema</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{securityMiddleware.stats.totalActions}</div>
                  <div className="text-xs text-blue-600">Total de Ações</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{securityMiddleware.stats.blockedActions}</div>
                  <div className="text-xs text-red-600">Ações Bloqueadas</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {securityMiddleware.stats.totalActions - securityMiddleware.stats.blockedActions}
                  </div>
                  <div className="text-xs text-green-600">Ações Permitidas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {securityMiddleware.stats.isEnabled ? 'Ativo' : 'Inativo'}
                  </div>
                  <div className="text-xs text-purple-600">Status</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Tab */}
        {activeTab === 'test' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Teste de Comandos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comando de Terminal
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testCommand}
                      onChange={(e) => setTestCommand(e.target.value)}
                      placeholder="Ex: rm -rf /tmp/test"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTestCommand}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Testar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Teste de URLs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL para Download
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="Ex: http://example.com/file.exe"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTestUrl}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Testar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Teste de Arquivos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caminho do Arquivo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testFile}
                      onChange={(e) => setTestFile(e.target.value)}
                      placeholder="Ex: .env.local"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTestFile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Testar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Teste de Pacotes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Pacote
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testPackage}
                      onChange={(e) => setTestPackage(e.target.value)}
                      placeholder="Ex: malicious-package"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTestPackage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Testar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemplos de Teste */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Exemplos para Teste</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Comandos Perigosos:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <code>rm -rf /</code></li>
                    <li>• <code>sudo format C:</code></li>
                    <li>• <code>regedit</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">URLs Suspeitas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <code>http://malware.com/file.exe</code></li>
                    <li>• <code>ftp://suspicious.com/script.bat</code></li>
                    <li>• <code>https://example.com/virus.ps1</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Configurações de Segurança</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monitoramento Ativo</h4>
                    <p className="text-sm text-gray-600">Habilita o monitoramento de segurança</p>
                  </div>
                  <button
                    onClick={() => securityMonitor.setEnabled(!securityMonitor.isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securityMonitor.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securityMonitor.isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bloqueio Automático</h4>
                    <p className="text-sm text-gray-600">Bloqueia automaticamente ações críticas</p>
                  </div>
                  <button
                    onClick={() => securityMiddleware.updateConfig({ autoBlock: !securityMiddleware.stats.isEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securityMiddleware.stats.isEnabled ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securityMiddleware.stats.isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Histórico de Ações</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {securityMiddleware.history.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma ação registrada</p>
                ) : (
                  securityMiddleware.history.map((action, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{action.type}</span>
                          <p className="text-xs text-gray-600">{action.action}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {securityMiddleware.history.length > 0 && (
                <button
                  onClick={securityMiddleware.clearHistory}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Limpar Histórico
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 