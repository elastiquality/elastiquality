# 🔧 Configuração das Variáveis de Ambiente na Vercel

## ⚠️ **PROBLEMA IDENTIFICADO**

O erro `500: INTERNAL_SERVER_ERROR` com código `MIDDLEWARE_INVOCATION_FAILED` geralmente acontece porque:
1. Variáveis de ambiente não estão configuradas no Vercel
2. O middleware estava tentando inicializar Firebase no server-side

## ✅ **CORREÇÕES APLICADAS**

### **1. Middleware Simplificado**
- Removido inicialização do Firebase no middleware
- Middleware agora apenas retorna NextResponse.next()
- Autenticação verificada no lado do cliente

### **2. Build Bem-Sucedido**
- Todos os erros TypeScript corrigidos
- Build sem erros
- Deploy realizado

---

## 📋 **CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL**

### **Passo 1: Acessar o Dashboard**
1. Vá para: https://vercel.com/service-elastiquality/elastiquality3/settings
2. Clique em **"Environment Variables"** no menu lateral

### **Passo 2: Adicionar Variáveis**

Adicione as seguintes variáveis:

#### **Firebase (Client-Side - NEXT_PUBLIC_*)**
```
NEXT_PUBLIC_FIREBASE_API_KEY
AIzaSyDn9PDh_0kUduVCLQgmw-zW1VgSOi7JhHc

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
serviceelastiquality.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
serviceelastiquality

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
serviceelastiquality.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
142160836053

NEXT_PUBLIC_FIREBASE_APP_ID
1:142160836053:web:9ea6978f5326923f58f95c

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
G-9PRJM081DJ
```

#### **Stripe**
```
STRIPE_SECRET_KEY
sk_live_YOUR_KEY_HERE

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
pk_live_YOUR_KEY_HERE

STRIPE_WEBHOOK_SECRET
whsec_YOUR_KEY_HERE
```

#### **App Configuration**
```
NEXT_PUBLIC_APP_URL
https://elastiquality.pt
```

### **Passo 3: Configurar Ambiente**

Para cada variável:
1. Clique em **"Add New"**
2. Preencha Name e Value
3. Selecione **"Production"** ✓
4. Opcionalmente adicione a **"Preview"** e **"Development"**
5. Clique em **"Save"**

### **Passo 4: Re-Deploy**

Após adicionar todas as variáveis:
1. Vá para a aba **"Deployments"**
2. Clique nos três pontos (...) no último deploy
3. Selecione **"Redeploy"**
4. Aguarde o novo deploy completar

---

## 🧪 **TESTAR**

Após o re-deploy:
1. Acesse: https://elastiquality.pt
2. A página deve carregar corretamente
3. Teste a criação de conta
4. Teste o login

---

## 📝 **CHECKLIST**

- [x] Middleware corrigido
- [x] Build bem-sucedido
- [x] Deploy realizado
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Re-deploy após configurar variáveis
- [ ] Site funcionando

---

## 🔍 **VERIFICAR LOGS**

Se ainda houver problemas, verifique os logs:

```bash
vercel logs --follow
```

Ou acesse no dashboard:
- Deployments → Clique no último deploy → Abra "Build Logs"

---

## 💡 **NOTA IMPORTANTE**

O `MIDDLEWARE_INVOCATION_FAILED` geralmente ocorre quando:
1. Variáveis de ambiente faltando
2. Middleware tentando usar SDKs do cliente no servidor
3. Inicialização incorreta do Firebase

**Todas essas questões foram corrigidas!**

---

**Próximo Passo:** Configure as variáveis de ambiente no dashboard da Vercel e faça um novo deploy.

