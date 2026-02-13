# cwayassistant

Assistente de IA para Google Chat construído seguindo o tutorial [Google Chat Quickstart HTTP](https://developers.google.com/workspace/add-ons/chat/quickstart-http?hl=pt-br).

## Roadmap

1. ✅ **Quickstart HTTP** - Configuração básica com Google Cloud Functions HTTP
2. ⏳ **AI Knowledge Assistant** - Integração com Vertex AI e Firestore (próximo)
3. ⏳ **Chat Apps AI Concepts** - Codelab completo (objetivo final)

## Setup Rápido

### Pré-requisitos

- Node.js 22 LTS
- npm
- Conta Google Cloud com projeto habilitado
- `gcloud` CLI configurado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/hugo-borba/cwayassistant.git
cd cwayassistant

# Instale as dependências
npm install

# Configure credentials.json
cp credentials.json.template credentials.json
# Edite credentials.json com suas credenciais OAuth2
```

### Desenvolvimento Local

```bash
# Execute função HTTP localmente na porta 8080
npm run dev

# Em outro terminal, teste:
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "Hello"}}'
```

### Linting e Formatting

```bash
# Verificar linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Verificar formatação
npm run format:check

# Auto-format código
npm run format

# Type checking com JSDoc
npm run typecheck
```

### Testes

```bash
# Executar testes
npm test

# Com coverage
npm run test:coverage
```

### Deployment

```bash
# Deploy para Google Cloud Functions
gcloud functions deploy app \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs22 \
  --source=. \
  --entry-point=app \
  --trigger-http \
  --allow-unauthenticated
```

## Estrutura do Projeto

```
.
├── index.js              # Entry point da função Cloud
├── app.js                # HTTP handler para Google Chat
├── env.js                # Configuração de environment
├── credentials.json      # OAuth2 credentials (gitignored)
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── jsconfig.json         # JSDoc type checking config
├── package.json          # Dependências
├── test/                 # Testes unitários
├── .cursor/              # Cursor IDE configuration
├── AGENTS.md             # Operating manual
└── README.md             # Este arquivo
```

## Padrão de Código

Este projeto segue o padrão **Controllers/Services/Model**:

- **Controllers**: Lidam com requisições HTTP, delegam lógica para services
- **Services**: Contêm lógica de negócio, chamadas a APIs externas
- **Model**: Estruturas de dados e validações

Veja `AGENTS.md` para detalhes completos.

## Qualidade de Código

Antes de fazer commit, rode:

```bash
npm run lint && npm run format:check && npm run typecheck && npm test
```

## Recursos

- [Google Chat Quickstart HTTP](https://developers.google.com/workspace/add-ons/chat/quickstart-http?hl=pt-br)
- [Google Chat API Documentation](https://developers.google.com/workspace/chat/api/reference)
- [AGENTS.md](AGENTS.md) - Operating manual completo

## License

Apache-2.0
