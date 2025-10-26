# 🚀 Deploy na Vercel - Arquitetura Completa

## ✅ **Vercel É Perfeito Para Este Projeto!**

### **Por quê a Vercel é melhor que Firebase Hosting?**

| Aspecto | Vercel | Firebase Hosting |
|---------|--------|------------------|
| **Next.js** | ⭐⭐⭐ Nativo | ⭐⭐ Via Cloud Run |
| **Setup** | ⭐⭐⭐ 1 click | ⭐⭐ Complexo |
| **API Routes** | ⭐⭐⭐ Automático | ⭐⭐ Config manual |
| **SSL** | ⭐⭐⭐ Automático | ⭐⭐⭐ Automático |
| **Custo** | ⭐⭐ Baixo | ⭐⭐ Baixo |
| **Performance** | ⭐⭐⭐ Edge Network | ⭐⭐⭐ CDN global |

---

## 🏗️ Arquitetura Completa com Vercel

```
Usuário
  ↓
Vercel Edge Network → Next.js App
  ↓                    ├── Páginas estáticas (SSG)
                       ├── Páginas dinâmicas (SSR)
                       └── API Routes
  ↓
Firebase Services:
  ├── Firestore (Database)
  ├── Firebase Storage (Imagens/Arquivos)
  ├── Firebase Auth (Login)
  └── Cloud Functions (Emails, Background Jobs)
  ↓
Stripe (Pagamentos)
  ├── Checkout
  ├── Subscriptions
  └── Webhooks
```

---

## 📦 O Que Vai Onde?

### **Vercel (Hospedagem)**

✅ **Next.js App completo**
- Todas as páginas (estáticas + dinâmicas)
- API Routes (`/api/*`)
- Server Components
- Edge Functions
- Otimização automática de imagens

### **Firebase (Backend-as-a-Service)**

✅ **Firestore** - Database
- Usuários
- Profissionais
- Solicitações de serviço
- Propostas
- Mensagens/Chat

✅ **Firebase Storage** - Arquivos
- Fotos de profissionais
- Certificados
- Portfólio de trabalhos
- Documentos

✅ **Firebase Auth** - Autenticação
- Login Email/Password
- Google Sign-In
- Facebook Sign-In
- Reset de senha
- Email de boas-vindas

✅ **Cloud Functions** - Lógica Server-Side
- Emails transacionais
- Background jobs
- Webhooks processing

### **Stripe (Pagamentos)**

✅ **Checkout Sessions**
- Pagamento único (cliente → profissional)
- Depósitos de garantia

✅ **Subscriptions**
- Planos mensais para profissionais
- Upgrade/downgrade automático

✅ **Webhooks**
- Processamento de pagamentos
- Atualizações de subscrições
- Notificações de eventos

---

## 🚀 Setup na Vercel

### **Passo 1: Criar Conta**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Conecte sua conta GitHub

### **Passo 2: Importar Projeto**

1. No dashboard da Vercel, clique em "Add New Project"
2. Selecione o repositório `elastiquality`
3. Configurações automáticas detectadas:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `.next`

### **Passo 3: Configurar Variáveis de Ambiente**

No dashboard do projeto → Settings → Environment Variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elastiquality.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=elastiquality
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elastiquality.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (Server-side apenas)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@elastiquality.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=elastiquality

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (para Cloud Functions)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@elastiquality.pt
SMTP_PASS=your-app-password
```

### **Passo 4: Deploy Automático**

Após configurar as variáveis:
1. Clique em "Deploy"
2. Vercel vai:
   - Build automático
   - Deploy em Edge Network
   - SSL automático
   - Domínio fornecido: `elastiquality.vercel.app`

### **Passo 5: Domínio Personalizado**

1. Settings → Domains
2. Adicione: `elastiquality.pt`
3. Configure DNS:
   ```
   A     @     76.76.21.21 (Vercel)
   CNAME www   cname.vercel-dns.com
   ```
4. SSL automático ativado

---

## 📂 Estrutura de Arquivos Necessária

```
elastiquality/
├── vercel.json                 # ✅ Config Vercel (opcional)
├── next.config.js              # ✅ Config Next.js
├── package.json                # ✅ Scripts e dependências
│
├── lib/
│   ├── firebase.ts             # 🆕 Firebase client config
│   ├── firebase-admin.ts       # 🆕 Firebase admin config
│   └── stripe.ts               # 🆕 Stripe config
│
├── app/
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/       # 🆕 Criar checkout
│   │   │   ├── webhook/        # 🆕 Processar webhooks
│   │   │   └── subscription/   # 🆕 Gerir subscrições
│   │   │
│   │   ├── auth/               # 🆕 API de autenticação
│   │   │   └── [...nextauth]/
│   │   │
│   │   ├── users/              # 🆕 CRUD usuários
│   │   ├── services/           # 🆕 CRUD serviços
│   │   └── professionals/      # 🆕 CRUD profissionais
│   │
│   └── ... (páginas existentes)
│
└── components/
    └── ... (componentes existentes)
```

---

## 💰 Custos Estimados

### **Vercel**
- **Plano Hobby**: Grátis
  - 100GB bandwidth/month
  - Builds ilimitados
  - SSL automático
  
- **Plano Pro**: $20/mês
  - Bandwidth ilimitado
  - Features avançadas
  - Melhor performance

### **Firebase**
- **Firestore**: Grátis até 1GB storage, 50K reads/day
- **Storage**: Grátis até 5GB, 1GB/day downloads
- **Auth**: Grátis até 50K MAU
- **Functions**: Grátis até 2M invocations/month

### **Stripe**
- **Pagamentos**: 1.4% + €0.25 por transação
- **Subscriptions**: 1.4% + €0.25 + 0.5% recorrente
- **Setup**: Grátis

### **Total Estimado**
- Começo: **Grátis** (todos na faixa gratuita)
- Crescimento: **~$20-30/mês** (Vercel Pro + Firebase minimal)
- Scale: **$100-200/mês** (10K+ usuários)

---

## 🔧 Configurações Necessárias

### **1. Criar `vercel.json`** (Opcional)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://elastiquality.pt"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### **2. Atualizar `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "vercel --prod",
    "update-postal-codes": "node scripts/update-postal-codes.js"
  }
}
```

### **3. Criar `.env.example`**

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

## ✅ Checklist de Deploy

### **Preparação**
- [ ] Conta Vercel criada
- [ ] Conta Firebase criada
- [ ] Conta Stripe criada
- [ ] Repositório GitHub conectado

### **Firebase**
- [ ] Firestore criado
- [ ] Storage configurado
- [ ] Auth habilitado
- [ ] Cloud Functions deployadas

### **Stripe**
- [ ] Produtos criados
- [ ] Webhooks configurados
- [ ] Chaves obtidas

### **Vercel**
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado
- [ ] Deploy realizado
- [ ] Testado produção

---

## 🎯 Resumo Final

### **Onde cada coisa roda:**

| Serviço | Função | Local |
|---------|--------|-------|
| **Next.js App** | Frontend + API | Vercel |
| **Páginas** | HTML/JS | Vercel Edge |
| **API Routes** | Backend | Vercel Serverless |
| **Database** | Dados | Firebase Firestore |
| **Storage** | Arquivos | Firebase Storage |
| **Auth** | Login | Firebase Auth |
| **Emails** | Notificações | Firebase Functions |
| **Pagamentos** | Stripe | Stripe API |
| **Webhooks** | Eventos | Vercel API Routes |

### **Vantagens desta Arquitetura:**

✅ **Simplicidade**: Vercel cuida do deployment
✅ **Performance**: Edge Network global
✅ **Escalabilidade**: Auto-scale
✅ **Custo**: Baixo começo, escala conforme uso
✅ **Developer Experience**: Deploy automático via Git
✅ **Zero Config**: Vercel detecta Next.js automaticamente

---

## 🚀 Próximos Passos

1. ✅ Ler este documento
2. ✅ Seguir `FIREBASE_SETUP.md` para Firebase
3. ✅ Criar conta na Vercel
4. ✅ Conectar repositório GitHub
5. ✅ Deploy automático!

**Tempo estimado: 30 minutos** 🎉

