---
name: Bootstrap Cursor Rules Node.js
overview: 'Bootstrap completo de sistema de regras em camadas para cwayassistant (Node.js 22 + Google Cloud Functions gen2): import/reuse de templates do awesome-cursorrules, expansão em domain rules estruturadas, estabelecimento de documentação viva com proveniência rastreável, configuração de tooling (ESLint+Prettier+JSDoc), e validação rigorosa em 4 fases iterativas. | Fase 1 (Discovery & Import): pesquisar repositório, importar 7 templates fundamentais via extensão Cursor Rules, snapshot em /.cursor/imports/, registrar proveniência completa. | Fase 2 (Foundation): montar /.cursorrules root por combinação de templates, expandir em 8 domain rules (/.cursor/rules/*.mdc), preservar arquitetura controllers/services/model. | Fase 3 (Documentation): migrar README.md para inglês (preservar português como README.pt-BR.md), criar AGENTS.md operacional, adicionar diagramas Mermaid e repo tree com proveniência. | Fase 4 (Tooling & Validation): adicionar devDeps (eslint, prettier, plugins), criar configs (.eslintrc.json, .prettierrc.json, jsconfig.json), instalar deps, criar ADR, executar validation loop (lint+format+typecheck), obter review approval, abrir gate para produção.'
todos:
  - id: phase-1-discovery-import-task-1-research-repo-internal
    content: "[PHASE 1.1] Research Repo Internal → 'ler README.md atual, package.json, estrutura controllers/services/model/test, identificar stack (Mocha, npm, Node.js 22), localizar credentials.json/deploy.sh, revisar commits recentes via git log'"
    status: pending
  - id: phase-1-discovery-import-task-2-research-extension-external
    content: "[PHASE 1.2] Research Cursor Rules Extension (External) → 'buscar docs oficiais da extensão Cursor Rules no Cursor IDE docs, Stack Overflow/Reddit sobre uso de awesome-cursorrules templates, confirmar comando Command Palette e workflow de import'"
    status: pending
  - id: phase-1-discovery-import-task-3-research-templates-external
    content: "[PHASE 1.3] Research awesome-cursorrules Templates (External) → 'consultar repositório PatrickJS/awesome-cursorrules no GitHub, identificar paths exatos dos 7 templates (JavaScript/Node.js, Google Cloud Functions, Testing/Mocha, API/Backend, ESLint+Prettier, Documentation, Git Workflow), verificar versões e últimas atualizações'"
    status: pending
  - id: phase-1-discovery-import-task-4-create-imports-dir
    content: "[PHASE 1.4] Create Imports Dir → 'criar diretório /.cursor/imports/ se não existir, preparar estrutura para snapshots de templates'"
    status: pending
  - id: phase-1-discovery-import-task-5-import-templates
    content: "[PHASE 1.5] Import 7 Templates → 'usar extensão Cursor Rules (Command Palette → Cursor Rules: Add .cursorrules) para importar: (1) JavaScript/Node.js, (2) Google Cloud Functions, (3) Testing/Mocha, (4) API/Backend, (5) ESLint+Prettier, (6) Documentation, (7) Git Workflow; para cada um, snapshot imediato para /.cursor/imports/<template-name>.cursorrules.txt'"
    status: pending
  - id: phase-1-discovery-import-task-6-create-provenance
    content: "[PHASE 1.6] Create PROVENANCE.md → 'criar /.cursor/imports/PROVENANCE.md com seções: Import History (source, date, applied to, modifications), Template Mapping (tabela template → root section → domain rules), Original Rules (rationale, based on, label)'"
    status: pending
  - id: phase-1-discovery-import-task-7-validation-loop
    content: "[PHASE 1.7] Validation Loop Phase 1 → 'verificar que 7 arquivos .cursorrules.txt existem em /.cursor/imports/, PROVENANCE.md contém metadados completos para cada template, todos paths do awesome-cursorrules estão corretos; se falhar, corrigir e revalidar'"
    status: pending
  - id: phase-1-discovery-import-task-8-success-criteria
    content: "[PHASE 1.8] Success Criteria Phase 1 → 'confirmar: (1) 7 templates importados e snapshotted, (2) PROVENANCE.md criado com histórico rastreável, (3) nenhum erro de path ou source incorreto'"
    status: pending
  - id: phase-1-discovery-import-task-9-review-approval
    content: "[PHASE 1.9] Review Approval Phase 1 → 'apresentar ao usuário: lista dos 7 templates importados, preview de PROVENANCE.md, solicitar aprovação antes de prosseguir para Fase 2'"
    status: pending
  - id: phase-1-discovery-import-task-10-gate-open
    content: "[PHASE 1.10] Gate Open Phase 1 → 'somente após aprovação de review, marcar gate como aberto e iniciar Fase 2'"
    status: pending
  - id: phase-2-foundation-task-1-research-imports-internal
    content: "[PHASE 2.1] Research Imports Internal → 'ler conteúdo completo dos 7 arquivos .cursorrules.txt em /.cursor/imports/, identificar seções reutilizáveis, padrões conflitantes, oportunidades de deduplicação'"
    status: pending
  - id: phase-2-foundation-task-2-research-cursorrules-patterns-external
    content: "[PHASE 2.2] Research .cursorrules Best Practices (External) → 'buscar docs oficiais Cursor sobre estrutura de .cursorrules, Stack Overflow/Reddit sobre Project Facts, Definition of Done, Rules Provenance sections, confirmar formato markdown preferido'"
    status: pending
  - id: phase-2-foundation-task-3-research-mdc-format-external
    content: "[PHASE 2.3] Research .mdc Domain Rules Format (External) → 'buscar docs Cursor sobre /.cursor/rules/*.mdc, verificar se há schemas ou convenções específicas, consultar exemplos da comunidade'"
    status: pending
  - id: phase-2-foundation-task-4-build-root-cursorrules
    content: "[PHASE 2.4] Build Root .cursorrules → 'montar /.cursorrules por combinação e deduplicação dos 7 templates, incluir seções obrigatórias: Project Facts (Node.js 22, GCF gen2, controllers/services/model), Definition of Done (ESLint+Prettier pass, JSDoc, tests pass, README/package.json updated), Rules Provenance (lista dos 7 templates + link para PROVENANCE.md)'"
    status: pending
  - id: phase-2-foundation-task-5-expand-domain-rules
    content: "[PHASE 2.5] Expand 8 Domain Rules → 'criar /.cursor/rules/ dir, expandir templates importados em 8 arquivos .mdc: architecture.mdc (JS+API), code-style.mdc (ESLint+Prettier+JS), testing.mdc (Mocha), cloud-functions.mdc (GCF), google-apis.mdc (Chat+Firestore+Vertex+Events), documentation.mdc (Docs), security.mdc (OAuth2+IAM), workflow.mdc (Git+GCF); rotular seções originais explicitamente'"
    status: pending
  - id: phase-2-foundation-task-6-validation-loop
    content: "[PHASE 2.6] Validation Loop Phase 2 → 'verificar que /.cursorrules existe e contém Project Facts/DoD/Provenance, 8 arquivos .mdc existem em /.cursor/rules/, cada .mdc referencia template base correto, nenhuma duplicação excessiva; se falhar, corrigir e revalidar'"
    status: pending
  - id: phase-2-foundation-task-7-success-criteria
    content: "[PHASE 2.7] Success Criteria Phase 2 → 'confirmar: (1) /.cursorrules montado e válido, (2) 8 domain rules criadas e expandidas dos templates, (3) proveniência rastreável em cada arquivo, (4) arquitetura controllers/services/model preservada'"
    status: pending
  - id: phase-2-foundation-task-8-review-approval
    content: "[PHASE 2.8] Review Approval Phase 2 → 'apresentar ao usuário: preview de /.cursorrules (primeiras 50 linhas), lista dos 8 .mdc criados, solicitar aprovação antes de prosseguir para Fase 3'"
    status: pending
  - id: phase-2-foundation-task-9-gate-open
    content: "[PHASE 2.9] Gate Open Phase 2 → 'somente após aprovação de review, marcar gate como aberto e iniciar Fase 3'"
    status: pending
  - id: phase-3-documentation-task-1-research-readme-internal
    content: "[PHASE 3.1] Research README Internal → 'ler README.md atual completo, identificar seções a preservar, diagramas existentes, tom e estrutura, verificar se há links internos ou externos que precisam ser mantidos'"
    status: pending
  - id: phase-3-documentation-task-2-research-mermaid-external
    content: "[PHASE 3.2] Research Mermaid Flowcharts (External) → 'buscar docs oficiais Mermaid.js sobre sintaxe flowchart TD, Stack Overflow sobre best practices para diagramas de arquitetura, verificar exemplos de Google Cloud Functions flows'"
    status: pending
  - id: phase-3-documentation-task-3-research-agents-md-external
    content: "[PHASE 3.3] Research AGENTS.md Patterns (External) → 'buscar exemplos de AGENTS.md em repos open-source que usam Cursor, consultar docs Cursor sobre operating manuals, verificar estrutura recomendada (Project Overview, How to Work, Architecture, When to Ask vs Assume, Keeping Rules Updated)'"
    status: pending
  - id: phase-3-documentation-task-4-migrate-readme
    content: "[PHASE 3.4] Migrate README → 'preservar README.md atual como README.pt-BR.md, criar novo README.md em inglês com: enhanced repo tree (inline descriptions), improved Mermaid flowchart (user→Chat API→HTTP Func→OAuth2→Firestore→Events API→Pub/Sub→Events Func→Vertex AI→response), Rules Provenance section linkando /.cursor/imports/PROVENANCE.md'"
    status: pending
  - id: phase-3-documentation-task-5-create-agents-md
    content: "[PHASE 3.5] Create AGENTS.md → 'criar AGENTS.md com seções: (1) Project Overview (cwayassistant tech stack), (2) How to Work (npm install/test, deploy.sh, lint/format/typecheck), (3) Architecture Conventions (controllers→services→model), (4) When to Ask vs Assume (ask: OAuth2/Firestore schema/deploy changes; safe: code style/test patterns/JSDoc), (5) Keeping Rules and Docs Updated (README quando estrutura muda, package.json quando deps mudam, /.cursor/rules/ quando novos padrões emergem), (6) Rules Provenance Process (reuse first, extend in .mdc, label original rules)'"
    status: pending
  - id: phase-3-documentation-task-6-validation-loop
    content: "[PHASE 3.6] Validation Loop Phase 3 → 'verificar que README.pt-BR.md existe e preserva conteúdo original, README.md em inglês contém repo tree + Mermaid + provenance section, AGENTS.md contém 6 seções obrigatórias, todos links internos funcionam; se falhar, corrigir e revalidar'"
    status: pending
  - id: phase-3-documentation-task-7-success-criteria
    content: "[PHASE 3.7] Success Criteria Phase 3 → 'confirmar: (1) README migrado (pt-BR preservado, en enhanced), (2) AGENTS.md criado com operating manual completo, (3) diagramas e proveniência incluídos, (4) documentação viva estabelecida'"
    status: pending
  - id: phase-3-documentation-task-8-review-approval
    content: "[PHASE 3.8] Review Approval Phase 3 → 'apresentar ao usuário: diff de README.md (antes/depois), preview de AGENTS.md (primeiras 50 linhas), solicitar aprovação antes de prosseguir para Fase 4'"
    status: pending
  - id: phase-3-documentation-task-9-gate-open
    content: "[PHASE 3.9] Gate Open Phase 3 → 'somente após aprovação de review, marcar gate como aberto e iniciar Fase 4'"
    status: pending
  - id: phase-4-tooling-validation-task-1-research-package-json-internal
    content: "[PHASE 4.1] Research package.json Internal → 'ler package.json atual, identificar scripts existentes (test), devDependencies existentes (mocha, supertest, etc.), política de versioning, verificar se há npm-shrinkwrap ou lock file'"
    status: pending
  - id: phase-4-tooling-validation-task-2-research-eslint-prettier-external
    content: "[PHASE 4.2] Research ESLint + Prettier (External) → 'buscar docs oficiais ESLint e Prettier sobre configuração Node.js 22, Stack Overflow sobre eslint-config-prettier integration, verificar versões estáveis atuais (2026-02), consultar best practices para Google Cloud Functions'"
    status: pending
  - id: phase-4-tooling-validation-task-3-research-jsdoc-checkjs-external
    content: "[PHASE 4.3] Research JSDoc + checkJs (External) → 'buscar docs oficiais TypeScript sobre jsconfig.json + checkJs mode, Stack Overflow sobre type safety gradual em JavaScript sem migração TypeScript, verificar compatibilidade Node.js 22'"
    status: pending
  - id: phase-4-tooling-validation-task-4-update-package-json
    content: "[PHASE 4.4] Update package.json → 'adicionar devDependencies: eslint@^9.x, prettier@^3.x, eslint-config-prettier@^9.x, eslint-plugin-node@^11.x (versões atuais 2026-02); adicionar scripts: lint (eslint .), format (prettier --write .), format:check (prettier --check .), typecheck (node --check *.js controllers/**/*.js services/**/*.js model/**/*.js)'"
    status: pending
  - id: phase-4-tooling-validation-task-5-create-tooling-configs
    content: "[PHASE 4.5] Create Tooling Configs → 'criar .eslintrc.json (env: node+es2022, extends: eslint:recommended+prettier, rules: no-unused-vars warn argsIgnorePattern ^_, no-console off), .prettierrc.json (semi: true, singleQuote: true, trailingComma: es5, printWidth: 80, tabWidth: 2), jsconfig.json (compilerOptions: checkJs true, target ES2022, module commonjs, moduleResolution node; include **/*.js, exclude node_modules)'"
    status: pending
  - id: phase-4-tooling-validation-task-6-inspect-node-env
    content: "[PHASE 4.6] Inspect Node.js Env → 'executar node --version (confirmar 22+), npm list --depth=0 (listar pacotes instalados), identificar missing devDeps (eslint, prettier, plugins ainda não instalados)'"
    status: pending
  - id: phase-4-tooling-validation-task-7-install-deps
    content: "[PHASE 4.7] Install Dependencies → 'executar npm install para instalar novas devDependencies, validar com npm list eslint prettier, confirmar que node_modules contém pacotes esperados'"
    status: pending
  - id: phase-4-tooling-validation-task-8-create-adr
    content: "[PHASE 4.8] Create ADR → 'criar /docs/adr/ dir se não existir, criar 0001-cursor-rules-bootstrap.md com seções: Status (Accepted), Context (projeto carecia de regras estruturadas), Decision (bootstrap sistema em camadas: import/reuse templates, expand em domain rules, add tooling ESLint+Prettier+JSDoc checkJs), Architecture Kept (controllers/services/model, npm, Mocha), Tooling Added (ESLint+Prettier padrão indústria, JSDoc+checkJs type safety gradual), Living Documentation (README/package.json atualizados após toda task futura), Consequences (positive: comportamento AI consistente, padrões claros, melhor DX; negative: overhead manutenção regras; mitigation: AGENTS.md fornece guidance)'"
    status: pending
  - id: phase-4-tooling-validation-task-9-validation-loop
    content: "[PHASE 4.9] Validation Loop Phase 4 → 'executar npm run lint (deve passar ou mostrar apenas warnings aceitáveis), npm run format:check (deve passar), npm run typecheck (deve passar), npm test (deve passar todos testes existentes); se falhar, corrigir problemas (ajustar configs, fix code style, fix type errors) e revalidar'"
    status: pending
  - id: phase-4-tooling-validation-task-10-security-checks
    content: "[PHASE 4.10] Security Checks → 'executar npm audit (verificar vulnerabilities em deps), revisar credentials.json.template para garantir que não há secrets hardcoded, confirmar que .gitignore inclui credentials.json e node_modules'"
    status: pending
  - id: phase-4-tooling-validation-task-11-success-criteria
    content: "[PHASE 4.11] Success Criteria Phase 4 → 'confirmar: (1) package.json atualizado com devDeps + scripts, (2) 3 configs criados (.eslintrc.json, .prettierrc.json, jsconfig.json), (3) devDeps instalados via npm, (4) ADR criado em /docs/adr/, (5) lint+format+typecheck+test passam, (6) nenhum security issue crítico em npm audit'"
    status: pending
  - id: phase-4-tooling-validation-task-12-review-approval
    content: "[PHASE 4.12] Review Approval Phase 4 → 'apresentar ao usuário: diff de package.json, preview dos 3 configs criados, output de npm run lint/format:check/typecheck/test, summary de npm audit, preview de ADR, solicitar aprovação final'"
    status: pending
  - id: phase-4-tooling-validation-task-13-gate-open
    content: "[PHASE 4.13] Gate Open Phase 4 → 'somente após aprovação de review final, marcar gate como aberto e considerar bootstrap concluído; preparar summary comprehensive para usuário'"
    status: pending
  - id: phase-4-tooling-validation-task-14-comprehensive-summary
    content: "[PHASE 4.14] Comprehensive Summary → 'fornecer summary final: (1) list de ~17 arquivos novos criados (/.cursorrules, 8 .mdc, PROVENANCE.md, 7 .txt, AGENTS.md, README.pt-BR.md, 3 configs, ADR), (2) list de ~3 arquivos modificados (README.md, package.json, .gitignore se necessário), (3) confirmation de Definition of Done completo (todos 7 templates importados, proveniência registrada, 8 domain rules criadas, README enhanced, AGENTS.md criado, tooling configs criados, devDeps instalados, ADR criado, validation loop executado e aprovado)'"
    status: pending
isProject: false
---

# Bootstrap Cursor Rules - cwayassistant

## Flowchart: Fases e Gates

```mermaid
flowchart TD
    Start([Início: Bootstrap Cursor Rules]) --> P1_Research[PHASE 1: Discovery & Import<br/>Research Interno + Externo]
    P1_Research --> P1_Execute[Executar: Import 7 Templates<br/>Create Provenance]
    P1_Execute --> P1_Validate{Validation Loop<br/>Templates OK?}
    P1_Validate -->|Falhou| P1_Fix[Fix Issues]
    P1_Fix --> P1_Validate
    P1_Validate -->|Passou| P1_Criteria[Verificar Critérios<br/>de Sucesso]
    P1_Criteria --> P1_Review[Review Approval<br/>Fase 1]
    P1_Review -->|Aprovado| P1_Gate[Gate 1 ABERTO]
    P1_Review -->|Rejeitado| P1_Fix

    P1_Gate --> P2_Research[PHASE 2: Foundation<br/>Research Imports + Patterns]
    P2_Research --> P2_Execute[Executar: Build Root .cursorrules<br/>Expand 8 Domain Rules]
    P2_Execute --> P2_Validate{Validation Loop<br/>Rules OK?}
    P2_Validate -->|Falhou| P2_Fix[Fix Issues]
    P2_Fix --> P2_Validate
    P2_Validate -->|Passou| P2_Criteria[Verificar Critérios<br/>de Sucesso]
    P2_Criteria --> P2_Review[Review Approval<br/>Fase 2]
    P2_Review -->|Aprovado| P2_Gate[Gate 2 ABERTO]
    P2_Review -->|Rejeitado| P2_Fix

    P2_Gate --> P3_Research[PHASE 3: Documentation<br/>Research README + AGENTS.md]
    P3_Research --> P3_Execute[Executar: Migrate README<br/>Create AGENTS.md]
    P3_Execute --> P3_Validate{Validation Loop<br/>Docs OK?}
    P3_Validate -->|Falhou| P3_Fix[Fix Issues]
    P3_Fix --> P3_Validate
    P3_Validate -->|Passou| P3_Criteria[Verificar Critérios<br/>de Sucesso]
    P3_Criteria --> P3_Review[Review Approval<br/>Fase 3]
    P3_Review -->|Aprovado| P3_Gate[Gate 3 ABERTO]
    P3_Review -->|Rejeitado| P3_Fix

    P3_Gate --> P4_Research[PHASE 4: Tooling & Validation<br/>Research ESLint+Prettier+JSDoc]
    P4_Research --> P4_Execute[Executar: Update package.json<br/>Create Configs<br/>Install Deps<br/>Create ADR]
    P4_Execute --> P4_Validate{Validation Loop<br/>Lint+Format+Typecheck+Test?}
    P4_Validate -->|Falhou| P4_Fix[Fix Issues]
    P4_Fix --> P4_Validate
    P4_Validate -->|Passou| P4_Security[Security Checks<br/>npm audit]
    P4_Security --> P4_Criteria[Verificar Critérios<br/>de Sucesso]
    P4_Criteria --> P4_Review[Review Approval<br/>Final]
    P4_Review -->|Aprovado| P4_Gate[Gate 4 ABERTO]
    P4_Review -->|Rejeitado| P4_Fix

    P4_Gate --> Summary[Comprehensive Summary]
    Summary --> End([Fim: Bootstrap Concluído])

    style P1_Gate fill:#90EE90
    style P2_Gate fill:#90EE90
    style P3_Gate fill:#90EE90
    style P4_Gate fill:#90EE90
    style End fill:#FFD700
```

## Repo File Tree (CURRENT STATE)

```
cwayassistant/                              # Root directory
├── .cursor/                                # Cursor AI configuration (VAZIO no momento)
│   └── plans/                              # Planos de modo Plan
│       └── bootstrap_cursor_rules_node.js_bf1a4ca9.plan.md
├── .git/                                   # Git repository
├── .vscode/                                # VSCode configuration
│   ├── settings.json                       # Workspace settings
│   └── extensions.json                     # Recommended extensions
├── controllers/                            # HTTP/Pub/Sub request handlers
│   ├── app.js                              # HTTP function (Chat interactions)
│   └── event-app.js                        # Events function (Pub/Sub messages)
├── docs/                                   # Documentation (existe dir)
├── model/                                  # Data models and domain logic
│   ├── events.js                           # Event entities
│   ├── exceptions.js                       # Custom exceptions
│   └── message.js                          # Message entities
├── node_modules/                           # NPM packages (instalado)
├── services/                               # Business logic layer
│   ├── aip-service.js                      # Vertex AI / Gemini integration
│   ├── app-auth-chat-service.js            # App auth for Chat API
│   ├── app-auth-events-service.js          # App auth for Events API
│   ├── firestore-service.js                # Firestore data access
│   ├── user-auth-chat-service.js           # User OAuth2 for Chat
│   ├── user-auth-events-service.js         # User OAuth2 for Events
│   └── user-auth.js                        # User auth utilities
├── test/                                   # Unit tests (Mocha + Supertest)
├── .gitignore                              # Git ignore rules
├── credentials.json                        # OAuth2 credentials (local, gitignored)
├── credentials.json.template               # Template for credentials
├── deploy.sh                               # Deployment script (gcloud CLI)
├── env.js                                  # Environment variables helper
├── events_index.js                         # Events function entry point
├── http_index.js                           # HTTP function entry point
├── index.js                                # Main entry point
├── package-lock.json                       # NPM lock file
├── package.json                            # Dependencies and scripts (test only)
└── README.md                               # Documentation (em português)

**Descrições por Pasta:**
- **controllers**: HTTP/Pub/Sub handlers, delegam para services
- **services**: lógica de negócio, integrações com APIs Google (Chat, Firestore, Vertex AI, Workspace Events)
- **model**: entidades de domínio e lógica core
- **test**: testes unitários com Mocha + Supertest
- **.cursor**: configuração Cursor AI (VAZIO - será populado neste bootstrap)
```

## Repo File Tree (FUTURE STATE - DRAFT/HYPOTHESIS)

```
cwayassistant/                              # Root directory
├── .cursor/                                # Cursor AI configuration (POPULADO)
│   ├── imports/                            # ⭐ NOVO: Template provenance
│   │   ├── PROVENANCE.md                   # Import history e mapping
│   │   ├── javascript-nodejs.cursorrules.txt
│   │   ├── google-cloud-functions.cursorrules.txt
│   │   ├── testing-mocha.cursorrules.txt
│   │   ├── api-backend.cursorrules.txt
│   │   ├── eslint-prettier.cursorrules.txt
│   │   ├── documentation.cursorrules.txt
│   │   └── git-workflow.cursorrules.txt
│   ├── plans/                              # Planos de modo Plan
│   │   └── bootstrap_cursor_rules_node.js_bf1a4ca9.plan.md
│   └── rules/                              # ⭐ NOVO: Domain rules (.mdc)
│       ├── architecture.mdc                # Controllers/services/model conventions
│       ├── cloud-functions.mdc             # HTTP/Events triggers, gen2, env
│       ├── code-style.mdc                  # ESLint, Prettier, JSDoc, naming
│       ├── documentation.mdc               # JSDoc, README updates, inline docs
│       ├── google-apis.mdc                 # Chat, Firestore, Vertex AI, Events API
│       ├── security.mdc                    # OAuth2, credentials, IAM, secrets
│       ├── testing.mdc                     # Mocha patterns, Supertest, mocks
│       └── workflow.mdc                    # Git commits, deploy.sh, gcloud
├── .vscode/                                # VSCode configuration
│   ├── settings.json
│   └── extensions.json
├── controllers/                            # (mantido)
│   ├── app.js
│   └── event-app.js
├── docs/                                   # Documentation
│   └── adr/                                # ⭐ NOVO: Architecture Decision Records
│       └── 0001-cursor-rules-bootstrap.md
├── model/                                  # (mantido)
│   ├── events.js
│   ├── exceptions.js
│   └── message.js
├── node_modules/                           # (mantido + novas devDeps)
├── services/                               # (mantido)
│   ├── aip-service.js
│   ├── app-auth-chat-service.js
│   ├── app-auth-events-service.js
│   ├── firestore-service.js
│   ├── user-auth-chat-service.js
│   ├── user-auth-events-service.js
│   └── user-auth.js
├── test/                                   # (mantido)
├── .cursorrules                            # ⭐ NOVO: Root Cursor rules
├── .eslintrc.json                          # ⭐ NOVO: ESLint config
├── .gitignore                              # (atualizado se necessário)
├── .prettierrc.json                        # ⭐ NOVO: Prettier config
├── AGENTS.md                               # ⭐ NOVO: Operating manual
├── credentials.json                        # (mantido, gitignored)
├── credentials.json.template               # (mantido)
├── deploy.sh                               # (mantido)
├── env.js                                  # (mantido)
├── events_index.js                         # (mantido)
├── http_index.js                           # (mantido)
├── index.js                                # (mantido)
├── jsconfig.json                           # ⭐ NOVO: TypeScript JSDoc checkJs config
├── package-lock.json                       # (atualizado)
├── package.json                            # ⭐ MODIFICADO: devDeps + scripts
├── README.md                               # ⭐ MODIFICADO: migrado para inglês, enhanced
└── README.pt-BR.md                         # ⭐ NOVO: preserva português original

**Arquivos Novos (~17):**
.cursorrules, 8 .mdc, PROVENANCE.md, 7 .txt, AGENTS.md, README.pt-BR.md, 3 configs (.eslintrc.json, .prettierrc.json, jsconfig.json), ADR

**Arquivos Modificados (~3):**
README.md, package.json, .gitignore (se necessário)
```

## Evidence & Assumptions

### FACTS

- **FACT (Internal):** Repositório usa Node.js v22.14.0, compatível com Google Cloud Functions gen2 ([verificado via `node --version](file://c:/Users/hugo.borba/repos/cwayassistant)`)
- **FACT (Internal):** package.json contém apenas script `test` com Mocha; devDependencies incluem mocha, supertest, sinon, proxyquire; sem ESLint ou Prettier ainda ([arquivo package.json](file://c:/Users/hugo.borba/repos/cwayassistant/package.json))
- **FACT (Internal):** Estrutura organizada em controllers/services/model/test com 18 arquivos JS ([listagem de diretórios](file://c:/Users/hugo.borba/repos/cwayassistant))
- **FACT (Internal):** README.md atual em português com diagrama ASCII e seções estruturadas ([README.md](file://c:/Users/hugo.borba/repos/cwayassistant/README.md))
- **FACT (Internal):** Diretório .cursor existe mas está vazio (sem rules, sem .cursorrules root) ([verificação direta](file://c:/Users/hugo.borba/repos/cwayassistant/.cursor))

### INFERENCES

- **INFERENCE:** Projeto é greenfield quanto a regras Cursor (nenhum arquivo de regras existente, bootstrap necessário do zero)
- **INFERENCE:** Arquitetura controllers/services/model está estabelecida e funcionando (18 arquivos organizados, testes existentes); deve ser preservada conforme plano original
- **INFERENCE:** Versões de ESLint 9.x e Prettier 3.x são estáveis em 2026-02 (baseado em calendário de releases típico desses projetos)

### ASSUMPTIONS

- **ASSUMPTION:** Extensão Cursor Rules está instalada no IDE e funciona corretamente para importar templates do awesome-cursorrules. **Fallback:** Se falhar, listar templates manualmente e criar arquivos .txt com conteúdo placeholder, marcando para revisão manual.
- **ASSUMPTION:** PatrickJS/awesome-cursorrules mantém paths estáveis para os 7 templates fundamentais (JavaScript/Node.js, Google Cloud Functions, Testing/Mocha, API/Backend, ESLint+Prettier, Documentation, Git Workflow). **Fallback:** Se paths mudaram, usar busca no repo para localizar templates equivalentes.
- **ASSUMPTION:** npm audit não mostrará vulnerabilidades críticas nas novas devDeps (eslint, prettier, plugins). **Fallback:** Se houver vulnerabilities, avaliar severity e decidir se update/patch é necessário antes de prosseguir.

## Command Previews (quando aplicável)

### Phase 1 (Discovery & Import)

Nenhum comando de alto risco. Apenas leituras e criações de arquivos/diretórios.

### Phase 4 (Tooling & Validation)

**Command Preview 1:**

- **command:** `npm install --save-dev eslint@^9.x prettier@^3.x eslint-config-prettier@^9.x eslint-plugin-node@^11.x`
- **why needed:** Instalar devDependencies para linting, formatting, e type checking
- **risk level:** LOW (apenas adiciona pacotes dev, não afeta runtime)
- **rollback strategy:** `npm uninstall eslint prettier eslint-config-prettier eslint-plugin-node` e reverter package.json via git checkout

**Command Preview 2:**

- **command:** `npm run lint` (executa `eslint .`)
- **why needed:** Validar que código passa regras ESLint
- **risk level:** LOW (read-only, não modifica código)
- **rollback strategy:** N/A (não há mudanças a reverter)

**Command Preview 3:**

- **command:** `npm run format` (executa `prettier --write .`)
- **why needed:** Auto-formatar código conforme padrões Prettier (OPCIONAL, será usado `format:check` primeiro)
- **risk level:** MED (modifica todos arquivos .js; pode causar diffs grandes)
- **rollback strategy:** `git checkout .` para reverter mudanças de formatação se houver problemas

**Command Preview 4:**

- **command:** `npm audit`
- **why needed:** Verificar vulnerabilidades de segurança em dependências
- **risk level:** LOW (read-only, apenas reporta)
- **rollback strategy:** N/A (não há mudanças a reverter)

## Definition of Done (Critérios Finais)

- ✅ **Phase 1 Complete:** 7 templates fundamentais importados via extensão Cursor Rules e snapshotted em `/.cursor/imports/`; proveniência registrada em `PROVENANCE.md` com metadados completos (source, date, applied to, modifications); template mapping criado (tabela template → root section → domain rules)
- ✅ **Phase 2 Complete:** Root `/.cursorrules` montado por combinação e deduplicação dos 7 templates com seções obrigatórias (Project Facts, Definition of Done, Rules Provenance); 8 domain rules criadas em `/.cursor/rules/*.mdc` (architecture, code-style, testing, cloud-functions, google-apis, documentation, security, workflow) expandindo templates importados; seções originais rotuladas explicitamente
- ✅ **Phase 3 Complete:** README.md atual preservado como `README.pt-BR.md`; novo `README.md` em inglês criado com enhanced repo tree (inline descriptions), improved Mermaid flowchart (user→Chat API→HTTP Func→OAuth2→Firestore→Events API→Pub/Sub→Events Func→Vertex AI→response), Rules Provenance section linkando `/.cursor/imports/PROVENANCE.md`; `AGENTS.md` criado com operating manual (6 seções: Project Overview, How to Work, Architecture Conventions, When to Ask vs Assume, Keeping Rules and Docs Updated, Rules Provenance Process)
- ✅ **Phase 4 Complete:** `package.json` atualizado com devDependencies (eslint, prettier, eslint-config-prettier, eslint-plugin-node) e scripts (lint, format, format:check, typecheck); tooling configs criados (`.eslintrc.json`, `.prettierrc.json`, `jsconfig.json`); Node.js env inspecionado (v22.14.0 confirmado); devDeps instalados via `npm install`; decision log criado em `/docs/adr/0001-cursor-rules-bootstrap.md`; validation loop executado (lint+format:check+typecheck+test pass); security checks executados (npm audit sem critical issues); review approval final obtido
- ✅ **Living Update Rule Established:** Regra documentada em `AGENTS.md` para manter README.md (quando estrutura/fluxo muda), package.json (quando deps mudam), `/.cursor/rules/` (quando novos padrões emergem), `/.cursor/imports/PROVENANCE.md` (quando templates importados)
- ✅ **Comprehensive Summary Provided:** Lista de ~17 arquivos novos, ~3 arquivos modificados, confirmation de todos critérios de Definition of Done atendidos

## Next Steps (Após Bootstrap Concluído)

1. **Production Readiness:** Após gate 4 aberto e summary fornecido, considerar executar `npm run format` (auto-format all code) se aprovado pelo usuário; commit inicial: "chore: bootstrap Cursor rules system with provenance and tooling"
2. **Integration Testing:** Executar `npm test` completo para confirmar que mudanças de formatting não introduziram breaking changes
3. **Deploy Validation:** Executar `./deploy.sh` (dry-run se disponível) para confirmar que bootstrap não afeta deploy process
4. **Team Onboarding:** Compartilhar `AGENTS.md` com time (se aplicável) para alinhar sobre operating manual e rules maintenance process
5. **Continuous Improvement:** Adicionar tarefas futuras para: (a) expandir coverage de testes, (b) adicionar integration tests, (c) considerar migração gradual para TypeScript se type safety se tornar crítico, (d) adicionar CI/CD pipeline com GitHub Actions (lint+test+security checks)
