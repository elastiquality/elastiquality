# 🚀 Guia de Configuração Firebase e Stripe

## 📋 Sumário

Este guia ajudará a configurar:
- ✅ Firebase Hosting (Deploy do site)
- ✅ Firestore Database (Banco de dados)
- ✅ Firebase Storage (Armazenamento de arquivos)
- ✅ Firebase Authentication (Login e emails)
- ✅ Stripe (Pagamentos)

---

## 🔥 PARTE 1: Firebase

### 1.1 Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Add project"
3. Nome do projeto: `elastiquality`
4. Aceite os termos e continue
5. Desative Google Analytics (opcional)
6. Clique em "Create project"

### 1.2 Configurar Firebase Hosting

```bash
# No terminal, no diretório do projeto
npm install -g firebase-tools
firebase login
firebase init hosting
```

**Seleções durante `firebase init hosting`:**
- Use existing project: Yes
- Select project: `elastiquality`
- Public directory: `out`
- Configure as single-page app: No
- Set up automatic builds: Yes
- GitHub repo: (opcional)

### 1.3 Habilitar Firestore Database

1. No Firebase Console → Firestore Database
2. Clique em "Create database"
3. Modo: **Production mode** (para começar)
4. Região: `europe-west` (Portugal)
5. Clique em "Enable"

**Estrutura das coleções sugerida:**

```
users/
  {userId}/
    name: string
    email: string
    userType: 'CLIENT' | 'PROFESSIONAL'
    createdAt: timestamp
    updatedAt: timestamp
    
professionals/
  {userId}/
    bio: string
    specialties: []
    verified: boolean
    rating: number
    totalReviews: number
    location: {
      district: string
      council: string
      parish: string
    }
    
serviceRequests/
  {requestId}/
    title: string
    description: string
    budgetMin: number
    budgetMax: number
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    clientId: string
    createdAt: timestamp
    
proposals/
  {proposalId}/
    requestId: string
    professionalId: string
    price: number
    description: string
    estimatedTime: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
```

### 1.4 Habilitar Firebase Storage

1. No Firebase Console → Storage
2. Clique em "Get started"
3. Regras de segurança: Production mode
4. Região: `europe-west`

**Regras de Storage sugeridas:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null
      allow write: if request.auth != null && request.auth.uid == userId
    }
    match /professionals/{userId}/{allPaths=**} {
      allow read: if request.auth != null
      allow write: if request.auth != null && request.auth.uid == userId
    }
  }
}
```

### 1.5 Configurar Firebase Authentication

1. No Firebase Console → Authentication
2. Clique em "Get started"
3. Habilite os seguintes métodos:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Facebook (opcional)

**Configurar Email Templates:**

1. Authentication → Templates
2. Configure os templates:
   - **Email address verification**
   - **Password reset**
   - **Email change**

### 1.6 Firebase Email Templates

**Email de Boas-vindas (usando Cloud Functions):**

```javascript
// functions/index.js
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')

admin.initializeApp()

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
})

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const mailOptions = {
    from: 'Elastiquality <noreply@elastiquality.pt>',
    to: user.email,
    subject: 'Bem-vindo à Elastiquality!',
    html: `
      <h1>Bem-vindo, ${user.displayName || user.email}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Comece a encontrar os melhores profissionais ou cadastre seu serviço!</p>
      <a href="https://elastiquality.pt">Acessar Plataforma</a>
    `
  }
  
  return transporter.sendMail(mailOptions)
})
```

---

## 💳 PARTE 2: Stripe

### 2.1 Criar Conta Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crie uma conta
3. Complete o onboarding

### 2.2 Obter Chaves da API

1. Dashboard → Developers → API keys
2. Copie:
   - **Publishable key** (pública)
   - **Secret key** (privada - nunca exponha!)

### 2.3 Configurar Produtos e Preços

**No Stripe Dashboard → Products:**

1. Crie produtos para subscrições profissionais:
   - **Profissional Básico**: €9.99/mês
   - **Profissional Premium**: €19.99/mês
   - **Profissional Pro**: €39.99/mês

2. Crie Webhook para eventos:
   - Dashboard → Developers → Webhooks
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Eventos: `payment_intent.succeeded`, `customer.subscription.updated`

### 2.4 Configurar Variáveis de Ambiente

Crie arquivo `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elastiquality.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=elastiquality
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elastiquality.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 📦 PARTE 3: Instalar Dependências

```bash
# Firebase
npm install firebase
npm install @firebase/app @firebase/auth @firebase/firestore @firebase/storage

# Stripe
npm install stripe @stripe/stripe-js
npm install @stripe/react-stripe-js

# Firebase Admin (para server-side)
npm install firebase-admin

# Email
npm install nodemailer

# Cloud Functions
npm install -g firebase-tools
cd functions
npm install
```

---

## 🚀 PARTE 4: Deploy

### 4.1 Build do Projeto

```bash
npm run build
```

### 4.2 Deploy no Firebase Hosting

```bash
firebase deploy --only hosting
```

### 4.3 Deploy Cloud Functions (para emails)

```bash
firebase deploy --only functions
```

---

## 📊 Estrutura Final

```
elastiquality/
├── firebase.json          # Config Firebase
├── firestore.rules        # Regras Firestore
├── storage.rules          # Regras Storage
├── functions/             # Cloud Functions
│   └── index.js
├── lib/
│   └── firebase.js        # Config Firebase
├── app/
│   └── api/
│       ├── stripe/        # API Routes Stripe
│       └── auth/          # API Routes Auth
└── .env.local             # Variáveis ambiente
```

---

## ✅ Checklist

- [ ] Projeto Firebase criado
- [ ] Firestore habilitado com regras
- [ ] Storage habilitado com regras
- [ ] Authentication configurado
- [ ] Conta Stripe criada
- [ ] Produtos Stripe criados
- [ ] Webhook Stripe configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Cloud Functions deployed
- [ ] Site deployed

---

## 🆘 Suporte

Documentação oficial:
- [Firebase Docs](https://firebase.google.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

