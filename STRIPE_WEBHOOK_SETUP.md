# Configuração do Webhook do Stripe

## ⚠️ IMPORTANTE - Chave Rotativa

A chave fornecida (`rk_live_...`) é uma **Restricted Key** rotativa. 

### O que fazer:

1. **Nunca use uma Restricted Key (`rk_live_`)**
2. Use uma **Secret Key** (`sk_live_`) em vez disso
3. Restricted Keys são temporárias e podem expirar

## 🔑 Obter a Chave Correta

### 1. Acesse Stripe Dashboard
https://dashboard.stripe.com/apikeys

### 2. Vá em "Secrets"
- Clique em "Show test key" para desenvolvimento
- Ou "Show live key" para produção

### 3. Copie a Secret Key
- Deve começar com `sk_live_` (produção) ou `sk_test_` (teste)
- NÃO use chaves que começam com `rk_live_` (rotativas)

## 📝 Configuração Correta

### `.env.local` deve ter:

```env
# Stripe - Use sk_live_ para produção
STRIPE_SECRET_KEY="sk_live_51SGe6QL2gcFNnf7z..." # Chave SECRETA regular

# Stripe - Chave pública (já está correta)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51SGe6QL2gcFNnf7zveGqcvR88..." # ✅ Correta

# Webhook Secret (obter no dashboard)
STRIPE_WEBHOOK_SECRET="whsec_..." # Configurar na próxima etapa
```

## 🔗 Configurar Webhook

### 1. Acesse Webhooks
https://dashboard.stripe.com/webhooks

### 2. Adicionar Endpoint

- **URL:** `https://seu-dominio.com/api/webhooks/stripe`
- **Descrição:** Elastiquality Webhook
- **Version:** 2023-10-16

### 3. Selecionar Eventos

Escolha estes eventos:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

### 4. Copiar Signing Secret

Após criar o endpoint, copie o **Signing secret**:
- Começa com `whsec_`
- Adicione ao `.env.local` como `STRIPE_WEBHOOK_SECRET`

## 🧪 Testar Webhook Localmente

Para testar webhooks localmente durante desenvolvimento:

```bash
# Instalar Stripe CLI
# Windows: https://github.com/stripe/stripe-cli/releases

# Fazer login
stripe login

# Escutar eventos localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Em outro terminal, testar evento
stripe trigger payment_intent.succeeded
```

## 📌 Resumo

1. ❌ **NÃO usar** `rk_live_` (Restricted Key)
2. ✅ **USAR** `sk_live_` (Secret Key regular)
3. Obter em: https://dashboard.stripe.com/apikeys
4. Para produção, configure webhook
5. Para local, use `stripe listen`

