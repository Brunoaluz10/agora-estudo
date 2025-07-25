# Documentação Técnica - Agora Estudo

## Arquitetura

### Frontend
- **Framework:** Next.js 15 com App Router
- **Estilização:** Tailwind CSS v4 + shadcn/ui
- **Estado:** Context API / Zustand (quando necessário)
- **Validação:** Zod + React Hook Form

### Backend
- **API Routes:** Next.js Route Handlers
- **Validação:** Middleware com Zod
- **Autenticação:** [A definir]
- **Rate Limiting:** [Implementar]

### Segurança
- **CSP Headers:** Configurados
- **CORS:** Configurado por endpoint
- **Input Sanitization:** Zod validation
- **SQL Injection Prevention:** Prepared statements
- **XSS Protection:** Headers configurados

## Padrões de Código

### Estrutura de Pastas
```
src/
├── app/                 # App Router (Next.js 15)
├── components/          # Componentes React
│   └── ui/             # Componentes shadcn/ui
├── data/               # Dados mock e tipos
├── lib/                # Utilitários e configurações
├── types/              # Definições TypeScript
├── hooks/              # Custom hooks
└── utils/              # Funções utilitárias
```

### Convenções
- **Componentes:** PascalCase
- **Funções utilitárias:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Arquivos:** kebab-case

## APIs e Endpoints

### Padrões de API
- **Versionamento:** /api/v1/
- **Autenticação:** Bearer token
- **Rate Limiting:** 100 req/min
- **CORS:** Configurado apropriadamente

### Endpoints Públicos
[Conforme necessário]

## Mock Data Strategy
Inicialmente, o projeto utiliza dados mockados para desenvolvimento rápido:
- Dados armazenados em `/src/lib/mock-data/`
- Simular delays de rede para realismo
- Estrutura preparada para migração futura para banco de dados

## Segurança

### Headers HTTP
```typescript
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}
```

### Validações
Toda entrada de dados deve ser validada com Zod antes do processamento.

## Performance

### Otimizações
- **Lazy Loading:** Para imagens
- **React.memo():** Quando apropriado
- **Bundle Optimization:** Otimizar tamanho do bundle
- **Caching:** Estratégia de cache

## Deploy

### Plataforma Recomendada
- **Vercel:** Para deploy e hosting
- **Configuração:** Automática via GitHub

## Monitoramento

### Métricas
- Performance: LCP, FID, CLS
- Segurança: Vulnerabilidades, tentativas de acesso
- UX: Taxa de conclusão, tempo de sessão 