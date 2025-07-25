# Agora Estudo - Dashboard de Revisão para Residência Médica

Aplicação moderna para organizar, priorizar e acompanhar tópicos de estudo, especialmente desenvolvida para estudantes de medicina preparando-se para residência médica.

## 🎯 Objetivo

Facilitar o controle do progresso de estudos, priorizando temas importantes, registrando leituras e revisões, e motivando o usuário com visualização clara do avanço através de um dashboard intuitivo e moderno.

## ✨ Funcionalidades

### 📊 Dashboard Inteligente
- **Métricas em Tempo Real:** Temas revisados, tempo de estudo, taxa de acerto, progresso geral
- **Visualização por Especialidade:** Progresso detalhado por área médica
- **Tendências de Aprendizado:** Gráficos de evolução ao longo do tempo

### 🎯 Sistema de Priorização
- **Checklist por Especialidade:** Cardiologia, Neurologia, Pediatria, Cirurgia Geral, etc.
- **Níveis de Prioridade:** Alto, Médio, Baixo baseado na importância para o exame
- **Sistema de Spaced Repetition:** Revisões programadas automaticamente

### 📚 Controle de Revisões
- **Contador de Leituras:** Por tema/aula com histórico completo
- **Sistema de Tags:** Por especialidade, dificuldade, fonte bibliográfica
- **Observações Personalizadas:** Notas específicas por tópico

### 🔄 Funcionalidades Avançadas
- **Exportação/Importação:** Backup e sincronização de progresso
- **Reset Rápido:** Reiniciar progresso quando necessário
- **Dark Mode:** Interface adaptável para diferentes ambientes
- **Responsivo:** Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Estilização moderna com Dark Mode
- **shadcn/ui** - Componentes UI profissionais
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos e consistentes
- **Zod** - Validação de dados robusta
- **React Hook Form** - Gerenciamento eficiente de formulários

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router (Next.js 15)
├── components/          # Componentes React
│   └── ui/             # Componentes shadcn/ui
├── data/               # Dados mock e tipos
├── lib/                # Utilitários e configurações
│   └── mock-data/      # Dados mock para desenvolvimento
├── types/              # Definições TypeScript
├── hooks/              # Custom hooks
└── utils/              # Funções utilitárias

docs/                   # Documentação do projeto
.ai/                    # Regras para IA
```

## 🚀 Instalação

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Implementação rigorosa das melhores práticas de segurança (OWASP Top 10):
- Validação de inputs com Zod
- Headers de segurança configurados
- Proteção contra XSS e CSRF
- Rate limiting em APIs
- Sanitização de dados

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
