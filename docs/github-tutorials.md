# Tutoriais e Recursos de Aprendizagem

Este documento lista tutoriais e recursos úteis para desenvolvimento com Google Chat, Vertex AI e Google Workspace APIs.

## Tutoriais Principais

### Google Chat

#### 1. Criar um app HTTP do Google Chat

- **URL:** [https://developers.google.com/workspace/add-ons/chat/quickstart-http](https://developers.google.com/workspace/add-ons/chat/quickstart-http)
- **Descrição:** Tutorial inicial para criar um app do Google Chat usando endpoints HTTP. Mostra como criar uma função simples que responde a eventos do Chat.
- **O que você aprenderá:**
  - Configurar um projeto do Google Cloud
  - Criar e implantar uma Cloud Function
  - Configurar um app do Google Chat
  - Responder a eventos de interação

#### 2. Integrar conceitos fundamentais de IA aos apps do Google Chat

- **URL:** [https://codelabs.developers.google.com/chat-apps-ai-concepts](https://codelabs.developers.google.com/chat-apps-ai-concepts)
- **Descrição:** Codelab completo sobre como integrar conceitos de IA generativa em apps do Google Chat. Cobre 8 exemplos práticos.
- **O que você aprenderá:**
  - Prompting básico com Gemini
  - Formatação de respostas em rich text
  - Grounding com Google Search
  - Uso do Model Context Protocol (MCP)
  - Conversações multi-turn
  - Custom tools e function calling
  - Streaming de respostas
  - Processamento multimodal (texto + imagens)

### Workspace Events API

#### 3. Workspace Events API - Guia

- **URL:** [https://developers.google.com/workspace/events](https://developers.google.com/workspace/events)
- **Descrição:** Documentação oficial da Workspace Events API para monitorar eventos em tempo real.
- **O que você aprenderá:**
  - Criar subscrições de eventos
  - Processar eventos via Pub/Sub
  - Renovar subscrições
  - Gerenciar ciclo de vida de subscrições

#### 4. Eventos do Google Chat

- **URL:** [https://developers.google.com/workspace/events/guides/events-chat](https://developers.google.com/workspace/events/guides/events-chat)
- **Descrição:** Guia específico sobre eventos do Google Chat na Workspace Events API.
- **Tipos de eventos:**
  - `message.v1.created` — Nova mensagem
  - `message.v1.updated` — Mensagem atualizada
  - `message.v1.deleted` — Mensagem deletada
  - Eventos em batch
  - Lembretes de expiração

### Vertex AI e Gemini

#### 5. Vertex AI - Documentação

- **URL:** [https://cloud.google.com/vertex-ai/docs](https://cloud.google.com/vertex-ai/docs)
- **Descrição:** Documentação completa da Vertex AI para IA generativa.
- **Tópicos importantes:**
  - Modelos Gemini disponíveis
  - Prompting e configuração
  - Function calling
  - Streaming
  - Grounding

#### 6. Gemini API - SDK para Node.js

- **URL:** [https://ai.google.dev/gemini-api/docs/quickstart?lang=node](https://ai.google.dev/gemini-api/docs/quickstart?lang=node)
- **Descrição:** Guia rápido para usar a API Gemini com Node.js.

### Google Cloud Functions

#### 7. Cloud Functions (2ª geração)

- **URL:** [https://cloud.google.com/functions/docs/2nd-gen/overview](https://cloud.google.com/functions/docs/2nd-gen/overview)
- **Descrição:** Documentação das Cloud Functions de 2ª geração (baseadas em Cloud Run).
- **Recursos:**
  - Deploy de funções
  - Configuração de triggers
  - Variáveis de ambiente
  - Autenticação e autorização

## Codelabs Adicionais

### Google Workspace

- **Build a Google Chat app:** [https://codelabs.developers.google.com/codelabs/chat-apps-script](https://codelabs.developers.google.com/codelabs/chat-apps-script)
- **Create a Google Workspace Add-on:** [https://codelabs.developers.google.com/workspace-add-ons-intro](https://codelabs.developers.google.com/workspace-add-ons-intro)

### Firestore

- **Get started with Cloud Firestore:** [https://firebase.google.com/codelabs/firestore-web](https://firebase.google.com/codelabs/firestore-web)

## Documentação de Referência

### APIs

- **Chat API Reference:** [https://developers.google.com/chat/api/reference/rest](https://developers.google.com/chat/api/reference/rest)
- **Workspace Events API Reference:** [https://developers.google.com/workspace/events/reference/rest](https://developers.google.com/workspace/events/reference/rest)
- **Vertex AI API Reference:** [https://cloud.google.com/vertex-ai/docs/reference](https://cloud.google.com/vertex-ai/docs/reference)
- **Firestore Client Libraries:** [https://cloud.google.com/firestore/docs/reference/libraries](https://cloud.google.com/firestore/docs/reference/libraries)

### Conceitos

- **Google Chat Concepts:** [https://developers.google.com/chat/concepts](https://developers.google.com/chat/concepts)
- **Cards and Widgets:** [https://developers.google.com/chat/ui](https://developers.google.com/chat/ui)
- **Authentication:** [https://developers.google.com/chat/api/guides/auth](https://developers.google.com/chat/api/guides/auth)

## Ferramentas e Recursos

### Development Tools

- **Apps Script:** [https://developers.google.com/apps-script](https://developers.google.com/apps-script)
- **clasp (CLI para Apps Script):** [https://github.com/google/clasp](https://github.com/google/clasp)
- **gcloud CLI:** [https://cloud.google.com/sdk/gcloud](https://cloud.google.com/sdk/gcloud)

### Exemplos de Código

- **Google Workspace Add-ons Samples:** [https://github.com/googleworkspace/add-ons-samples](https://github.com/googleworkspace/add-ons-samples)
- **Chat API Samples:** [https://github.com/googleworkspace/google-chat-samples](https://github.com/googleworkspace/google-chat-samples)
- **Vertex AI Samples:** [https://github.com/GoogleCloudPlatform/generative-ai](https://github.com/GoogleCloudPlatform/generative-ai)

## Vídeos e Webinars

- **Google Workspace Developers YouTube:** [https://www.youtube.com/c/GoogleWorkspaceDev](https://www.youtube.com/c/GoogleWorkspaceDev)
- **Google Cloud Tech YouTube:** [https://www.youtube.com/c/GoogleCloudTech](https://www.youtube.com/c/GoogleCloudTech)

## Comunidade e Suporte

- **Stack Overflow** (tag: `google-chat`): [https://stackoverflow.com/questions/tagged/google-chat](https://stackoverflow.com/questions/tagged/google-chat)
- **Stack Overflow** (tag: `google-workspace-addons`): [https://stackoverflow.com/questions/tagged/google-workspace-addons](https://stackoverflow.com/questions/tagged/google-workspace-addons)
- **Google Workspace Developer Community:** [https://www.googlecloudcommunity.com/gc/Google-Workspace/ct-p/google-workspace](https://www.googlecloudcommunity.com/gc/Google-Workspace/ct-p/google-workspace)

## Manter-se Atualizado

- **Google Workspace Developers Blog:** [https://developers.googleblog.com/](https://developers.googleblog.com/)
- **Release Notes:** [https://developers.google.com/workspace/chat/release-notes](https://developers.google.com/workspace/chat/release-notes)
- **Vertex AI Release Notes:** [https://cloud.google.com/vertex-ai/docs/release-notes](https://cloud.google.com/vertex-ai/docs/release-notes)

---

**Dica:** Bookmark esta página e visite regularmente para encontrar novos tutoriais e recursos!
