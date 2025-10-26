# Configuração do Stripe - Elastiquality

## 📋 Visão Geral

O Stripe foi integrado ao projeto para processar pagamentos de:
- Assinaturas profissionais (BASIC, PREMIUM, PRO)
- Comissões sobre serviços realizados
- Compras de créditos/moedas

## ✅ Arquivos Criados

### 1. `lib/stripe.ts`
- Configuração do cliente Stripe
- Funções utilitárias para formatação de valores
- Suporte para múltiplas moedas (EUR)
- Versão da API: 2023-10-16

### 2. `app/api/create-payment-intent/route.ts`
- Cria Payment Intent no Stripe
- Suporta pagamentos únicos
- Validação de dados
- Retorna `clientSecret` para processamento no frontend

### 3. `app/api/webhooks/stripe/route.ts`
- Recebe eventos do Stripe
- Valida assinatura do webhook
- Processa eventos:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### 4. Cloud Functions (`functions/payments.js`)
- Integração com Firestore
- Atualiza status de pagamentos
- Gerencia assinaturas
- Cria notificações

## 🔐 Configuração de Ambiente

### 1. Obter Chaves do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Vá em **Developers > API Keys**
3. Copie as chaves:
   - **Secret Key**: Para API server-side
   - **Publishable Key**: Para frontend
   - **Webhook Secret**: Para validação

### 2. Configurar Variáveis de Ambiente

Crie ou atualize `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... em produção)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... em produção)
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### 3. Configurar Webhook no Stripe

1. Acesse [Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Selecione eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** para `.env.local`

## 💳 Tipos de Pagamento

### 1. Assinaturas Profissionais

```typescript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: 'price_xxx' }], // Price ID do plano
  metadata: {
    userId: userId,
    plan: 'PREMIUM'
  }
});
```

### 2. Pagamentos Únicos (Comissões)

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // em centavos
  currency: 'eur',
  metadata: {
    userId,
    serviceRequestId
  }
});
```

## 📊 Planos de Assinatura

### Plano Basic
- Preço: €9.99/mês
- 5 serviços por mês
- Visibilidade básica

### Plano Premium
- Preço: €19.99/mês
- Serviços ilimitados
- Visibilidade destacada
- Analytics avançado

### Plano Pro
- Preço: €39.99/mês
- Todos os recursos Premium
- Suporte prioritário
- Badge verificado

## 🧪 Testar Pagamentos

### Usar Cards de Teste

**Sucesso:**
- Card: `4242 4242 4242 4242`
- CVV: Qualquer 3 dígitos
- Data: Qualquer data futura

**Recusado:**
- Card: `4000 0000 0000 0002`

### Testar Assinaturas

1. Criar produto no Stripe Dashboard
2. Criar price (recurring monthly)
3. Usar `price_xxx` no código

## 📱 Uso no Frontend

### Instalar Stripe.js

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Exemplo de Uso

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const { clientSecret } = await fetch('/api/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify({ amount, userId, serviceRequestId })
}).then(r => r.json());

await stripe?.confirmCardPayment(clientSecret);
```

## 🚀 Deploy

### Variáveis no Vercel/Firebase

Configure as variáveis de ambiente no painel:
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET

### Webhook em Produção

1. Atualize a URL do webhook no Stripe Dashboard
2. Teste o webhook com eventos de teste
3. Monitore logs: `firebase functions:log`

## 📞 Suporte

Para problemas ou dúvidas:
- Documentação Stripe: https://stripe.com/docs
- Logs: Firebase Console > Functions > Logs
- Debug: Use `stripe listen` para testar webhooks localmente

## ⚠️ Importante

1. **Nunca** exponha secret keys no frontend
2. **Sempre** valide webhooks com assinatura
3. **Use** test mode durante desenvolvimento
4. **Teste** todos os fluxos antes de produção
5. **Monitore** logs e métricas no Stripe Dashboard

