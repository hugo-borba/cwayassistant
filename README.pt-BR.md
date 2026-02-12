# cwayassistant - AI Knowledge Assistant para Google Chat

Este é um assistente de conhecimento com IA para Google Chat que responde perguntas com base no histórico de conversas dos espaços. O app usa Vertex AI com Gemini para análise e geração de respostas, monitora mensagens em tempo real via Workspace Events API + Pub/Sub e armazena o histórico no Firestore.

## 📋 Visão Geral

O **cwayassistant** é um app do Google Chat que:
- Responde perguntas baseadas no histórico de conversas do espaço
- Usa Vertex AI com Gemini para análise e geração de respostas inteligentes
- Monitora mensagens em tempo real via Workspace Events API + PubSub
- Armazena histórico de mensagens no Firestore
- Suporta autenticação OAuth2 de usuários e autenticação de aplicação

## 🏗️ Arquitetura

O app é implementado como duas Google Cloud Functions (Cloud Run gen2):

```
┌─────────────────┐
│  Google Chat    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │   HTTP   │ ◄── Interações do usuário (adição ao espaço, mensagens)
    │ Function │
    └────┬─────┘
         │
    ┌────▼─────────┐
    │   Firestore  │ ◄── Armazenamento de mensagens, espaços e tokens
    └──────────────┘
         
┌──────────────────┐
│ Workspace Events │
│      API         │
└────────┬─────────┘
         │
    ┌────▼────────┐
    │   Pub/Sub   │
    └────┬────────┘
         │
    ┌────▼─────┐
    │  Events  │ ◄── Eventos de mensagens (criação, atualização, exclusão)
    │ Function │
    └────┬─────┘
         │
    ┌────▼──────┐
    │ Vertex AI │ ◄── Análise de perguntas e geração de respostas
    └───────────┘
```

### Componentes Principais

- **HTTP Function (`app`)**: Processa interações diretas do Google Chat (adição ao espaço, mensagens, remoções)
- **Events Function (`eventsApp`)**: Processa eventos de assinatura via Pub/Sub (mensagens criadas/atualizadas/deletadas, renovações de assinatura)
- **Firestore**: Armazena spaces, mensagens e tokens OAuth2 dos usuários
- **Vertex AI**: Usa Gemini para detectar perguntas e gerar respostas baseadas no histórico
- **Workspace Events API**: Monitora eventos em tempo real nos espaços do Chat

## 🚀 Setup e Deploy

### Pré-requisitos

- Conta Google Workspace Business ou Enterprise
- Projeto Google Cloud com faturamento ativado
- Node.js 20 ou superior
- gcloud CLI instalado e autenticado

### APIs Necessárias

Ative as seguintes APIs no Console do Google Cloud:

```bash
gcloud services enable \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  eventarc.googleapis.com \
  pubsub.googleapis.com \
  firestore.googleapis.com \
  workspaceevents.googleapis.com \
  chat.googleapis.com \
  aiplatform.googleapis.com
```

### Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/hugo-borba/cwayassistant.git
   cd cwayassistant
   ```

2. **Configure o arquivo `env.js`**:
   ```javascript
   const env = {
     project: 'seu-project-id',      // ID do projeto Google Cloud
     location: 'us-central1',          // Região para Vertex AI
     topic: 'events-api',              // Tópico PubSub
     logging: true,
   };
   ```

3. **Configure OAuth2 (`credentials.json`)**:
   - Crie credenciais OAuth2 no Console do Google Cloud
   - Baixe o arquivo JSON e salve como `credentials.json` na raiz
   - Configure o redirect URI: `https://REGION-PROJECT_ID.cloudfunctions.net/app/oauth2`

4. **Crie banco de dados Firestore**:
   - No Console do Google Cloud, vá para Firestore
   - Crie um banco de dados no modo "Native"

5. **Instale dependências**:
   ```bash
   npm install
   ```

### Deploy

Execute o script de deploy:

```bash
./deploy.sh
```

Ou deploy manual:

```bash
# Deploy HTTP function
gcloud functions deploy app \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=app \
  --trigger-http \
  --allow-unauthenticated

# Deploy Events function
gcloud functions deploy events-app \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=eventsApp \
  --trigger-topic=events-api
```

### Configuração do Google Chat App

1. Acesse a API Google Chat no Console do Google Cloud
2. Configure:
   - **Nome**: cwayassistant
   - **URL do Avatar**: (URL da sua imagem)
   - **Descrição**: Assistente de conhecimento com IA
   - **Funcionalidade**: "Participar de espaços e conversas em grupo"
   - **Connection Settings**: URL do endpoint HTTP da função `app`
   - **Visibilidade**: Configure os usuários/domínios autorizados

## 🧪 Testes

Execute os testes unitários:

```bash
npm test
```

## 📚 Tutoriais e Documentação

- [Criar um app HTTP do Google Chat](https://developers.google.com/workspace/add-ons/chat/quickstart-http)
- [Conceitos de IA para apps do Google Chat](https://codelabs.developers.google.com/chat-apps-ai-concepts)
- [Workspace Events API](https://developers.google.com/workspace/events)
- [Vertex AI](https://cloud.google.com/vertex-ai)

Ver também: [docs/TUTORIALS.md](docs/TUTORIALS.md)

## 🔄 Sincronização com Upstream

Este projeto é um fork de [googleworkspace/add-ons-samples](https://github.com/googleworkspace/add-ons-samples).

Para sincronizar mudanças do repositório original:

```bash
git fetch upstream
git log HEAD..upstream/main --oneline
# Analisar commits relevantes
git cherry-pick <commit-hash>
```

Ver instruções completas: [docs/FORK_SETUP.md](docs/FORK_SETUP.md)

## 📝 Estrutura do Projeto

```
cwayassistant/
├── controllers/          # Controladores (app.js, event-app.js)
├── services/            # Serviços (Firestore, Auth, AIP, Chat, Events)
├── model/               # Modelos de dados (Message, Events, Exceptions)
├── test/                # Testes unitários
├── docs/                # Documentação adicional
├── index.js             # Entry point (exporta ambas as functions)
├── http_index.js        # HTTP Function handler
├── events_index.js      # Events Function handler
├── env.js               # Configurações de ambiente
├── credentials.json     # Credenciais OAuth2 (privado)
├── package.json         # Dependências Node.js
└── deploy.sh            # Script de deploy
```

## 🤝 Contribuindo

Este é um projeto privado para uso interno. Para contribuições:

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 📄 Licença

Apache 2.0 - Ver [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Google Workspace Add-ons](https://developers.google.com/workspace/add-ons)
- [Google Chat API](https://developers.google.com/chat)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
