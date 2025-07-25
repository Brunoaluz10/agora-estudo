# Sistema de Segurança - Agora Estudo

## 🛡️ Visão Geral

O Sistema de Segurança implementado no projeto "Agora Estudo" é uma solução abrangente para monitorar e proteger contra interações potencialmente perigosas. Ele foi projetado para alertar sobre comandos, operações de arquivo, downloads e instalações que podem comprometer a segurança do computador.

## 🎯 Funcionalidades Principais

### 1. **Monitoramento Inteligente**
- Detecção automática de comandos perigosos
- Análise de URLs suspeitas
- Verificação de operações de arquivo sensíveis
- Monitoramento de instalações de dependências

### 2. **Sistema de Alertas**
- **Níveis de Severidade:**
  - 🔴 **CRÍTICO**: Ações que podem causar danos irreversíveis
  - 🟠 **ALTO**: Ações com alto risco de segurança
  - 🟡 **MÉDIO**: Ações que requerem atenção
  - 🔵 **BAIXO**: Ações informativas

### 3. **Categorias de Monitoramento**
- **SYSTEM**: Comandos de sistema e privilégios elevados
- **FILE**: Operações em arquivos sensíveis
- **NETWORK**: Downloads e acessos de rede
- **DEPENDENCY**: Instalações de pacotes
- **CONFIG**: Modificações em configurações críticas

## 📁 Estrutura do Sistema

```
src/
├── lib/
│   ├── security.ts              # Core do sistema de segurança
│   └── security-middleware.ts   # Middleware de interceptação
├── components/ui/
│   ├── security-alert.tsx       # Componentes de interface
│   └── navigation.tsx           # Navegação com link de segurança
└── app/
    └── security/
        └── page.tsx             # Página de demonstração
```

## 🔧 Como Usar

### 1. **Acessando o Sistema**
Navegue para `/security` no projeto para acessar o painel de segurança.

### 2. **Monitoramento Automático**
O sistema monitora automaticamente:
- Comandos de terminal executados
- Operações de arquivo
- Downloads e URLs acessadas
- Instalações de dependências

### 3. **Configurações**
- **Monitoramento Ativo**: Habilita/desabilita o sistema
- **Bloqueio Automático**: Bloqueia ações críticas automaticamente
- **Histórico**: Visualiza todas as ações monitoradas

## 🚨 Regras de Segurança Implementadas

### Comandos Críticos
```bash
# Remoção recursiva de arquivos
rm -rf /path/to/files

# Formatação de disco
format C:
mkfs.ext4 /dev/sda1

# Privilégios elevados
sudo dangerous-command

# Modificação de registro (Windows)
regedit
```

### Arquivos Sensíveis
```
.env                    # Variáveis de ambiente
.env.local             # Configurações locais
config.json            # Arquivos de configuração
*.yaml, *.yml          # Arquivos de configuração
```

### URLs Suspeitas
```
http://malware.com/file.exe    # Downloads não seguros
ftp://suspicious.com/script.bat # Protocolos não seguros
*.exe, *.bat, *.ps1            # Executáveis suspeitos
```

### Dependências
```
npm install malicious-package
yarn add suspicious-package
pip install dangerous-package
```

## 🛠️ Implementação Técnica

### 1. **SecurityMonitor Class**
```typescript
// Análise de ações
const alerts = securityMonitor.analyzeAction("rm -rf /");

// Análise de arquivos
const fileAlerts = securityMonitor.analyzeFile("read", ".env");

// Análise de URLs
const urlAlerts = securityMonitor.analyzeUrl("http://malware.com/file.exe");
```

### 2. **SecurityMiddleware Class**
```typescript
// Interceptação de comandos
const result = await securityMiddleware.analyzeCommand("sudo rm -rf /");

// Verificação de permissão
if (!result.allowed) {
  console.log("Ação bloqueada:", result.reason);
}
```

### 3. **React Hooks**
```typescript
// Hook para monitor de segurança
const { alerts, analyzeAction, clearAlerts } = useSecurityMonitor();

// Hook para middleware
const { stats, analyzeCommand, blockCommand } = useSecurityMiddleware();
```

## 🎨 Interface do Usuário

### Painel Principal
- **Dashboard**: Visão geral dos alertas e estatísticas
- **Testes**: Interface para testar diferentes cenários
- **Configurações**: Gerenciamento do sistema

### Componentes Visuais
- **Alertas Coloridos**: Diferentes cores para cada nível de severidade
- **Ícones Intuitivos**: Ícones específicos para cada categoria
- **Estatísticas em Tempo Real**: Contadores de alertas por nível

## 🔒 Configurações de Segurança

### Personalização de Regras
```typescript
// Adicionar regra personalizada
securityMonitor.addCustomRule({
  id: 'custom-rule',
  name: 'Regra Personalizada',
  pattern: /dangerous-pattern/,
  category: 'SYSTEM',
  level: 'HIGH',
  message: 'Ação personalizada detectada',
  details: 'Descrição do risco',
  action: 'Ação recomendada',
  requiresConfirmation: true
});
```

### Bloqueio de Comandos
```typescript
// Bloquear comando específico
securityMiddleware.blockCommand("dangerous-command");

// Bloquear domínio
securityMiddleware.blockDomain("malware.com");
```

## 📊 Estatísticas e Relatórios

O sistema fornece estatísticas detalhadas:
- Total de ações monitoradas
- Ações bloqueadas vs permitidas
- Distribuição de alertas por nível
- Histórico de ações com timestamps

## 🚀 Integração com o Projeto

### 1. **Navegação**
O sistema está integrado à navegação principal do projeto através do componente `Navigation`.

### 2. **Monitoramento Automático**
O sistema monitora automaticamente todas as operações do projeto sem interferir no fluxo normal.

### 3. **Configuração Persistente**
As configurações são salvas no localStorage e persistem entre sessões.

## 🔮 Funcionalidades Futuras

### Planejadas
- [ ] Integração com antivírus
- [ ] Análise de comportamento anômalo
- [ ] Relatórios detalhados de segurança
- [ ] Integração com sistemas de logs
- [ ] Machine Learning para detecção de ameaças

### Melhorias
- [ ] Interface mais avançada
- [ ] Notificações em tempo real
- [ ] Backup automático de configurações
- [ ] Integração com APIs de segurança

## 🛡️ Boas Práticas

### Para Desenvolvedores
1. **Sempre revise** alertas antes de executar ações
2. **Configure regras personalizadas** para seu ambiente
3. **Mantenha o sistema atualizado** com novas ameaças
4. **Monitore regularmente** as estatísticas

### Para Usuários
1. **Não ignore alertas críticos**
2. **Confirme apenas ações que você entende**
3. **Reporte falsos positivos** para melhorias
4. **Mantenha backups** antes de ações arriscadas

## 📞 Suporte

Para dúvidas ou problemas com o sistema de segurança:
1. Verifique a documentação
2. Teste com exemplos fornecidos
3. Consulte os logs de erro
4. Entre em contato com a equipe de desenvolvimento

---

**⚠️ IMPORTANTE**: Este sistema é uma camada adicional de proteção, mas não substitui outras medidas de segurança como antivírus, firewall e boas práticas de segurança. 