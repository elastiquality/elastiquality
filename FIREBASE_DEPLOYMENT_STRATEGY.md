# 🚀 Estratégia de Deploy - Elastiquality

## ❌ Build 100% Estático NÃO é Adequado

### Por quê?
- ❌ Não suporta API Routes do Next.js (Firebase, Stripe, Auth)
- ❌ Não suporta renderização dinâmica
- ❌ Sem autenticação server-side
- ❌ Limita integração com Firestore
- ❌ Webhooks não funcionam

---

## ✅ Solução: **Híbrido** (Recomendado)

### Arquitetura Proposta

#### 🟢 Estático (SSG)
- Homepage (`/`)
- Páginas institucionais (`/about`, `/help`, `/contact`, etc.)
- Páginas de serviço (`/services`, `/professionals`)

#### 🔵 Dinâmico (SSR/API Routes)
- Autenticação (`/auth/*`)
- Dashboard (`/dashboard`)
- Perfis (`/profile/*`)
- Chat/Mensagens
- Propostas e solicitações

---

## 📊 Configuração Next.js

### Configuração Atual vs Ideal

**Atual:**
```javascript
// next.config.js
output: 'export' // ❌ 100% estático
```

**Ideal:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  // output: 'export', // ❌ REMOVER!
  // ✅ Next.js irá gerar automaticamente:
  // - SSG para páginas estáticas
  // - SSR para páginas dinâmicas
}

module.exports = nextConfig
```

---

## 🔥 Firebase Hosting vs Cloud Run

### Opção 1: Firebase Hosting (Simples)

**Vantagens:**
- ✅ Fácil setup
- ✅ CDN global
- ✅ SSL automático
- ✅ Grátis até certo limite

**Desvantagens:**
- ❌ Apenas arquivos estáticos
- ❌ Não suporta API Routes
- ❌ Limitado

### Opção 2: Cloud Run + Firebase Hosting (Recomendado)

**Arquitetura:**
```
Usuário
  ↓
Firebase Hosting (CDN) → páginas estáticas
  ↓
Cloud Run (Next.js) → páginas dinâmicas + API Routes
  ↓
Firestore / Storage
```

**Vantagens:**
- ✅ Totalmente compatível com Next.js
- ✅ API Routes funcionam
- ✅ Renderização server-side
- ✅ Escalável automaticamente
- ✅ Paga apenas pelo que usa

---

## 🏗️ Setup Recomendado

### 1. Estrutura de Deploy

```bash
elastiquality/
├── .firebaserc          # Projeto Firebase
├── firebase.json        # Config deploy
├── Dockerfile           # Container Cloud Run
├── cloudbuild.yaml      # Build automático
└── next.config.js       # Config Next.js híbrido
```

### 2. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'localhost'],
  },
  trailingSlash: true,
  // ✅ Híbrido: Next.js decide automaticamente
}

module.exports = nextConfig
```

### 3. firebase.json

```json
{
  "hosting": {
    "public": ".next/static",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "nextjs-app",
          "region": "europe-west1"
        }
      }
    ]
  }
}
```

### 4. Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 🚀 Scripts de Deploy

### package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:all": "npm run build && firebase deploy",
    
    "deploy:cloud-run": "gcloud run deploy",
    "update-postal-codes": "node scripts/update-postal-codes.js"
  }
}
```

---

## 📋 Plano de Ação

### Fase 1: Preparação (Agora)
1. ✅ Remover `output: 'export'` do `next.config.js`
2. ✅ Criar `firebase.json` configurado
3. ✅ Preparar estrutura de pastas

### Fase 2: Deploy Inicial (Próximo)
1. Deploy no Firebase Hosting (páginas estáticas)
2. Testar se carrega corretamente
3. Configurar domínio personalizado

### Fase 3: Cloud Run (Futuro)
1. Build Docker container
2. Deploy Cloud Run
3. Configurar rewrites no Firebase Hosting
4. Testar API Routes

---

## 💡 Comparação Final

| Aspecto | Build Estático | Híbrido |
|---------|---------------|---------|
| **Complexidade** | ⭐ Simples | ⭐⭐ Médio |
| **Custo** | Grátis | Baixo (Cloud Run) |
| **Performance** | ⭐⭐⭐ Excelente | ⭐⭐⭐ Excelente |
| **Funcionalidades** | ⭐ Limitado | ⭐⭐⭐ Completo |
| **API Routes** | ❌ Não | ✅ Sim |
| **Auth Server-side** | ❌ Não | ✅ Sim |
| **Webhooks** | ❌ Não | ✅ Sim |
| **SEO** | ⭐⭐⭐ | ⭐⭐⭐ |

---

## ✅ Recomendação Final

**Use Híbrido:**
1. Comece com páginas estáticas no Firebase Hosting
2. Implemente API Routes gradualmente
3. Migre para Cloud Run quando necessário

**Não use build 100% estático** pois limita muito as funcionalidades futuras.

---

## 🔗 Próximos Passos

1. Ler este documento
2. Atualizar `next.config.js`
3. Criar conta Firebase
4. Seguir `FIREBASE_SETUP.md`
5. Deploy inicial

