# PRD - Agora Estudo

## Visão Geral
Aplicação para organizar, priorizar e acompanhar tópicos de estudo, especialmente para quem estuda para residência médica.

## Objetivos
- **Objetivo principal:** Facilitar o controle do progresso de estudos, priorizando temas importantes, registrando leituras e revisões, e motivando o usuário com visualização clara do avanço.
- **Objetivos secundários:** 
  - Otimizar tempo de estudo através de priorização inteligente
  - Manter histórico completo de revisões
  - Identificar lacunas de conhecimento

## Público-Alvo
Estudantes de medicina preparando-se para residência médica, com foco em:
- Estudantes do 5º e 6º ano de medicina
- Candidatos a programas de residência
- Profissionais em reciclagem para concursos

## Funcionalidades Core

### 1. Dashboard de Progresso
- **Temas Revisados:** Contador de tópicos estudados
- **Tempo de Estudo:** Horas dedicadas por período
- **Taxa de Acerto:** Performance em questões
- **Tendência de Aprendizado:** Progresso ao longo do tempo

### 2. Sistema de Priorização
- **Checklist por Especialidade:** Cardiologia, Neurologia, Pediatria, etc.
- **Níveis de Prioridade:** Alto, Médio, Baixo
- **Sistema de Spaced Repetition:** Revisões programadas

### 3. Controle de Revisões
- **Contador de Leituras:** Por tema/aula
- **Histórico de Revisões:** Datas e frequência
- **Sistema de Tags:** Por especialidade, dificuldade, fonte

### 4. Visualização de Progresso
- **Gráfico Circular:** Progresso geral por especialidade
- **Barras de Progresso:** Por tema específico
- **Timeline:** Histórico de estudos

## Requisitos Técnicos
- **Framework:** Next.js 15 com App Router
- **UI:** Tailwind CSS + shadcn/ui
- **Validação:** Zod + React Hook Form
- **Ícones:** Lucide React
- **Dados:** Mock inicial, preparado para migração futura

## Requisitos de Segurança (OWASP Top 10)
1. **Broken Access Control:** Implementar RBAC e validação de permissões
2. **Cryptographic Failures:** HTTPS obrigatório, dados sensíveis criptografados
3. **Injection:** Validação Zod em todos os inputs, prepared statements
4. **Insecure Design:** Threat modeling, princípio do menor privilégio
5. **Security Misconfiguration:** Headers de segurança, CORS configurado
6. **Vulnerable Components:** Auditoria regular de dependências
7. **Authentication Failures:** Rate limiting, senhas fortes, 2FA
8. **Data Integrity Failures:** Validação de serialização, CSRF tokens
9. **Security Logging:** Logs de segurança, monitoramento
10. **SSRF:** Validação de URLs, whitelist de domínios

## Métricas de Sucesso
- **Performance:** LCP < 2.5s, FID < 100ms
- **Segurança:** 0 vulnerabilidades críticas
- **UX:** Taxa de conclusão > 80%
- **Engajamento:** Retorno diário > 70% 