"use client";

import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Download, Upload, Trash2, Save } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    achievements: true
  });
  const [studySettings, setStudySettings] = useState({
    dailyGoal: 4,
    breakDuration: 15,
    autoSave: true,
    soundEnabled: true
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleStudySettingChange = (key: string, value: any) => {
    setStudySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          </div>
          <p className="text-muted-foreground">
            Personalize sua experiência de estudo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <div className="bg-[#181818] border border-border rounded-lg p-4 sticky top-6">
              <nav className="space-y-2">
                <a href="#perfil" className="flex items-center gap-3 px-3 py-2 text-foreground bg-primary/10 rounded-lg">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </a>
                <a href="#aparencia" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Palette className="h-4 w-4" />
                  <span>Aparência</span>
                </a>
                <a href="#notificacoes" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </a>
                <a href="#estudo" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Settings className="h-4 w-4" />
                  <span>Configurações de Estudo</span>
                </a>
                <a href="#dados" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Database className="h-4 w-4" />
                  <span>Dados</span>
                </a>
                <a href="#seguranca" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span>Segurança</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seção: Perfil */}
            <section id="perfil" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Perfil</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue="Bruno Aluz"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="brunocontastore@gmail.com"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Especialidade
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Medicina Geral</option>
                    <option>Cardiologia</option>
                    <option>Neurologia</option>
                    <option>Pediatria</option>
                    <option>Cirurgia</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Seção: Aparência */}
            <section id="aparencia" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Aparência</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Tema
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        theme === "light"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      Claro
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      Escuro
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        theme === "system"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      Sistema
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tamanho da Fonte
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Pequeno</option>
                    <option selected>Médio</option>
                    <option>Grande</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Seção: Notificações */}
            <section id="notificacoes" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Notificações</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground capitalize">
                        {key === 'email' && 'Notificações por Email'}
                        {key === 'push' && 'Notificações Push'}
                        {key === 'reminders' && 'Lembretes de Estudo'}
                        {key === 'achievements' && 'Conquistas'}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {key === 'email' && 'Receba atualizações por email'}
                        {key === 'push' && 'Notificações no navegador'}
                        {key === 'reminders' && 'Lembretes para estudar'}
                        {key === 'achievements' && 'Notificações de conquistas'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção: Configurações de Estudo */}
            <section id="estudo" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Configurações de Estudo</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Diária (horas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={studySettings.dailyGoal}
                    onChange={(e) => handleStudySettingChange('dailyGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duração do Intervalo (minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={studySettings.breakDuration}
                    onChange={(e) => handleStudySettingChange('breakDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Salvamento Automático</label>
                    <p className="text-xs text-muted-foreground">Salvar progresso automaticamente</p>
                  </div>
                  <button
                    onClick={() => handleStudySettingChange('autoSave', !studySettings.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      studySettings.autoSave ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        studySettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Sons</label>
                    <p className="text-xs text-muted-foreground">Efeitos sonoros durante o estudo</p>
                  </div>
                  <button
                    onClick={() => handleStudySettingChange('soundEnabled', !studySettings.soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      studySettings.soundEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        studySettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Seção: Dados */}
            <section id="dados" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Dados</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Download className="h-4 w-4" />
                    Exportar Dados
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                    <Upload className="h-4 w-4" />
                    Importar Dados
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
                    <Trash2 className="h-4 w-4" />
                    Limpar Dados
                  </button>
                </div>
              </div>
            </section>

            {/* Seção: Segurança */}
            <section id="seguranca" className="bg-[#181818] border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Segurança</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 