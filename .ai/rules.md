# Regras para Assistentes de IA - Agora Estudo

## Contexto do Projeto
Agora Estudo - Aplicação para organizar, priorizar e acompanhar tópicos de estudo, especialmente para residência médica.

## Regras Obrigatórias

### 1. Segurança (OWASP Top 10)
- **SEMPRE** validar inputs com Zod
- **NUNCA** expor dados sensíveis em logs
- **SEMPRE** usar prepared statements
- **IMPLEMENTAR** rate limiting em todas as APIs
- **VALIDAR** permissões antes de acessos
- **SANITIZAR** outputs para prevenir XSS

### 2. Padrões de Código
- **USE** TypeScript strict mode
- **SIGA** convenções de nomenclatura do projeto
- **IMPLEMENTE** error boundaries adequados
- **USE** async/await ao invés de callbacks
- **MANTENHA** componentes pequenos e focados

### 3. Performance
- **IMPLEMENTE** lazy loading para imagens
- **USE** React.memo() quando apropriado
- **OTIMIZE** bundle size
- **IMPLEMENTE** caching estratégico

### 4. Documentação
- **COMENTE** lógica complexa
- **ATUALIZE** docs ao modificar APIs
- **MANTENHA** README atualizado
- **DOCUMENTE** decisões arquiteturais

### 5. Git e Versionamento
- **COMMITS** atômicos e descritivos
- **BRANCH** naming: feature/*, bugfix/*, hotfix/*
- **SEMPRE** criar PR antes de merge
- **EXECUTE** testes antes de push

## APIs e Endpoints

### Endpoints Públicos
Configurar CORS apropriadamente para endpoints que precisam ser públicos:
```typescript
// Exemplo para API pública
export async function POST(req: Request) {
  // Configurar CORS para endpoint público
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Validar input
  const validation = schema.safeParse(await req.json());
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400, headers }
    );
  }
  
  // Processar...
}
```

## Mock Data Strategy
Inicialmente, o projeto utiliza dados mockados para desenvolvimento rápido:
- Dados armazenados em `/src/lib/mock-data/`
- Simular delays de rede para realismo
- Estrutura preparada para migração futura para banco de dados

## Contexto Específico do Projeto

### Métricas Adaptadas para Estudos
- **Temas Revisados:** Contador de tópicos estudados
- **Tempo de Estudo:** Horas dedicadas por período  
- **Taxa de Acerto:** Performance em questões
- **Tendência de Aprendizado:** Progresso ao longo do tempo

### Especialidades Médicas
- Cardiologia, Neurologia, Pediatria, Cirurgia Geral
- Medicina Interna, Ginecologia, Psiquiatria
- Radiologia, Anestesiologia, Ortopedia

### Sistema de Priorização
- **Alto:** Temas com maior peso no exame
- **Médio:** Temas importantes mas menos frequentes
- **Baixo:** Temas complementares

## Comportamento do Assistente de IA
- **SEMPRE** considere implicações de segurança
- **SUGIRA** otimizações de performance
- **MANTENHA** consistência de código
- **ATUALIZE** testes quando mudar código
- **DOCUMENTE** lógica complexa 