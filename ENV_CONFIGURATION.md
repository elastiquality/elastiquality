# Configuração de Variáveis de Ambiente

## 📋 Variáveis Necessárias

### Firebase

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDn9PDh_0kUduVCLQgmw-zW1VgSOi7JhHc"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="serviceelastiquality.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="serviceelastiquality"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="serviceelastiquality.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="142160836053"
NEXT_PUBLIC_FIREBASE_APP_ID="1:142160836053:web:9ea6978f5326923f58f95c"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-9PRJM081DJ"
```

### Stripe

```env
# Chaves CONFIGURADAS (Produção - LIVE)
# ⚠️ IMPORTANTE: A chave atual é uma Restricted Key rotativa
# Obtenha a Secret Key regular em: https://dashboard.stripe.com/apikeys

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_live_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="configure-no-stripe-dashboard"

# ⚠️ ATENÇÃO: Obtenha uma Secret Key regular (sk_live_)
# Não use Restricted Keys (rk_live_) - elas são temporárias
```

### Outras

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔧 Como Configurar

### 1. Criar arquivo `.env.local`

No diretório raiz do projeto, crie um arquivo chamado `.env.local` e adicione todas as variáveis acima com seus valores reais.

**IMPORTANTE:** O arquivo `.env.local` está no `.gitignore` e não será commitado.

### 2. Obter Chaves do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Vá em **Developers > API Keys**
3. Copie:
   - **Publishable key** (começa com `pk_test_` ou `pk_live_`)
   - **Secret key** (começa com `sk_test_` ou `sk_live_`)

### 3. Obter Webhook Secret

1. Vá em **Developers > Webhooks**
2. Crie um novo endpoint (ou use o existente)
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Copie o **Signing secret** (começa com `whsec_`)

### 4. Para Produção (Vercel)

1. Acesse [Vercel Dashboard](https://vercel.com/)
2. Vá em seu projeto > **Settings > Environment Variables**
3. Adicione todas as variáveis
4. **IMPORTANTE:** Use chaves diferentes para produção (`pk_live_`, `sk_live_`)

## ⚠️ Segurança

- ✅ Nunca commite arquivos `.env.local` ou `.env` com chaves reais
- ✅ Use chaves de **teste** para desenvolvimento
- ✅ Use chaves de **produção** (`_live_`) apenas em produção
- ✅ Mantenha suas chaves secretas seguras
- ✅ Nunca exponha `STRIPE_SECRET_KEY` no frontend

## 📝 Template Completo

Crie `\.env.local` na raiz do projeto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDn9PDh_0kUduVCLQgmw-zW1VgSOi7JhHc"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="serviceelastiquality.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="serviceelastiquality"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="serviceelastiquality.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="142160836053"
NEXT_PUBLIC_FIREBASE_APP_ID="1:142160836053:web:9ea6978f5326923f58f95c"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-9PRJM081DJ"

# Stripe (CONFIGURE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧪 Testar Configuração

### Verificar Firebase

O Firebase já está configurado e funcionando. Para testar:
1. Acesse http://localhost:3000/auth/signup
2. Crie uma conta
3. Verifique no Firebase Console se o usuário foi criado

### Verificar Stripe

Para testar pagamentos com Stripe:
1. Use o cartão de teste: `4242 4242 4242 4242`
2. Qualquer CVV e data futura funcionam
3. Veja logs em: https://dashboard.stripe.com/logs

## 📞 Ajuda

Se tiver problemas:
1. Verifique se `.env.local` existe
2. Verifique se as chaves estão corretas
3. Reinicie o servidor: `npm run dev`
4. Veja logs no console

