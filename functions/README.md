# Cloud Functions - Elastiquality

Este diretório contém as Cloud Functions do Firebase para a plataforma Elastiquality.

## 📁 Estrutura

- `index.js` - Arquivo principal que exporta todas as funções
- `emails.js` - Funções para envio de emails (boas-vindas, reset de senha)
- `notifications.js` - Sistema de notificações
- `userTriggers.js` - Triggers para atualização de perfil de usuário
- `payments.js` - Webhooks do Stripe para pagamentos
- `imageProcessing.js` - Processamento de imagens (resize, otimização)

## 🚀 Funções Implementadas

### HTTP Triggers (Callable Functions)

1. **sendWelcomeEmail**
   - Envia email de boas-vindas ao criar conta
   - Parametros: `{ email, name, userType }`

2. **sendNotificationEmail**
   - Cria notificações para usuários
   - Parametros: `{ userId, type, title, body }`

3. **stripeWebhook**
   - Webhook do Stripe para processar pagamentos
   - Tratamento de eventos: `payment_intent.succeeded`, `subscription.created`, `subscription.cancelled`

### Firestore Triggers

1. **onUserCreate**
   - Trigger quando um documento é criado na collection `users`
   - Atualiza display name no Auth
   - Define custom claims

2. **onUserUpdate**
   - Trigger quando um documento `users` é atualizado
   - Sincroniza mudanças com Auth

3. **onProfessionalCreate**
   - Trigger quando um documento é criado na collection `professionals`
   - Processa dados adicionais do profissional

4. **onProposalCreate**
   - Trigger quando uma proposta é criada
   - Cria notificação para o cliente

5. **onMessageCreate**
   - Trigger quando uma mensagem é enviada
   - Atualiza último mensagem no chat room

### Scheduled Functions

1. **cleanupExpiredRequests**
   - Executada a cada 24 horas
   - Marca pedidos expirados como `EXPIRED`

### Storage Triggers

1. **onImageUpload**
   - Trigger quando uma imagem é enviada ao Storage
   - Processa e otimiza imagens

## 📝 Como Usar

### Instalar Dependências
```bash
cd functions
npm install
```

### Testar Localmente
```bash
npm run serve
```

### Deploy
```bash
npm run deploy
```

### Ver Logs
```bash
npm run logs
```

## ⚙️ Configuração

1. Configure o arquivo `.env` ou use Firebase CLI:
   ```bash
   firebase functions:config:set stripe.key="sk_test_..."
   ```

2. Para usar em produção, você precisará:
   - Configurar serviço de email (SendGrid, Mailgun, etc.)
   - Configurar webhook do Stripe
   - Configurar processamento de imagens (sharp, jimp)

## 🔐 Segurança

Todas as funções callable requerem autenticação (`context.auth`). Verifique sempre se o usuário está autenticado antes de processar dados sensíveis.

## 📊 Custom Claims

As funções definem custom claims para usuários:
- `userType`: CLIENT ou PROFESSIONAL
- `verified`: boolean

Estes claims podem ser lidos no frontend para controlar acesso a rotas.

## 🎯 Próximos Passos

1. Implementar serviço de email real (SendGrid)
2. Adicionar mais triggers conforme necessário
3. Implementar processamento de imagens com sharp
4. Adicionar testes unitários
5. Configurar monitoramento e alertas

