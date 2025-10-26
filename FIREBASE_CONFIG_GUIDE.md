# 🔥 Guia Rápido: Configurar Firebase

## 📋 **Passo a Passo para Configurar Firebase**

### **1. Criar Conta Firebase** (5 min)

1. Acesse: [console.firebase.google.com](https://console.firebase.google.com/)
2. Clique em "Add project"
3. **Nome do projeto**: `elastiquality`
4. **Região**: Europa (europe-west)
5. Continue e confirme

### **2. Obter Credenciais** (3 min)

No Firebase Console → **Project Overview** → **Project settings**

Na aba **"General"**, copie:

```env
# Adicione estes valores ao arquivo .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elastiquality.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=elastiquality
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elastiquality.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### **3. Habilitar Firestore** (2 min)

1. Firebase Console → **Firestore Database**
2. Clique "Create database"
3. **Modo**: Production
4. **Região**: `europe-west1` (Bélgica - mais próximo de Portugal)
5. Confirmar

### **4. Habilitar Storage** (2 min)

1. Firebase Console → **Storage**
2. Click "Get started"
3. **Regras**: Production
4. **Região**: `europe-west`
5. Confirmar

### **5. Habilitar Authentication** (3 min)

1. Firebase Console → **Authentication**
2. Click "Get started"
3. Habilite:
   - ✅ Email/Password
   - ✅ Google (opcional)
   - ✅ Facebook (opcional)

### **6. Criar Arquivo `.env.local`**

No seu projeto, crie o arquivo `.env.local`:

```bash
# Copie do exemplo abaixo
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais reais do Firebase.

---

## 🗄️ **Estrutura do Firestore**

### **Coleções Criadas Automaticamente**

#### **users/**
```typescript
{
  id: "abc123",
  name: "João Silva",
  email: "joao@example.com",
  userType: "PROFESSIONAL",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **professionals/**
```typescript
{
  userId: "abc123",
  bio: "Eletricista com 8 anos de experiência...",
  specialties: ["Instalações", "Reparações"],
  verified: true,
  rating: 4.9,
  location: {
    district: "Lisboa",
    council: "Lisboa",
    parish: "Areeiro"
  }
}
```

#### **serviceRequests/**
```typescript
{
  id: "req123",
  clientId: "client456",
  title: "Preciso de eletricista",
  description: "...",
  status: "PENDING",
  budgetMin: 50,
  budgetMax: 150,
  location: { district, council, parish }
}
```

#### **proposals/**
```typescript
{
  id: "prop123",
  requestId: "req123",
  professionalId: "abc123",
  price: 120,
  description: "Posso fazer por €120...",
  status: "PENDING"
}
```

#### **messages/**
```typescript
{
  id: "msg123",
  roomId: "room456",
  senderId: "abc123",
  text: "Olá! Quando podemos marcar?",
  read: false
}
```

#### **chatRooms/**
```typescript
{
  id: "room456",
  participants: [
    { userId: "abc123", name: "João", type: "PROFESSIONAL" },
    { userId: "client456", name: "Maria", type: "CLIENT" }
  ],
  lastMessage: { text: "...", timestamp, senderId }
}
```

---

## 🔐 **Regras de Segurança Firestore**

Crie o arquivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Professionals collection
    match /professionals/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Service requests
    match /serviceRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.clientId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.clientId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'PROFESSIONAL');
    }
    
    // Proposals
    match /proposals/{proposalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.professionalId;
    }
    
    // Chat messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    match /chatRooms/{roomId} {
      allow read, write: if request.auth != null;
    }
    
  }
}
```

### **Aplicar Regras**

```bash
firebase deploy --only firestore:rules
```

---

## 📦 **Storage Rules**

Crie o arquivo `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Professional files
    match /professionals/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public portfolio
    match /portfolio/{userId}/{allPaths=**} {
      allow read: if true; // Public
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ✅ **Checklist de Setup**

- [ ] Conta Firebase criada
- [ ] Projeto "elastiquality" criado
- [ ] Firestore habilitado
- [ ] Storage habilitado
- [ ] Authentication habilitado
- [ ] Arquivo `.env.local` criado com credenciais
- [ ] Regras Firestore aplicadas
- [ ] Regras Storage aplicadas
- [ ] Testar conexão

---

## 🧪 **Testar Conexão**

Crie `app/test-firebase/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function TestFirebase() {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocs(collection(db, 'users'))
        setConnected(true)
      } catch (err: any) {
        setError(err.message)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste Firebase</h1>
      {connected && <p className="text-green-600">✅ Conectado ao Firestore!</p>}
      {error && <p className="text-red-600">❌ Erro: {error}</p>}
    </div>
  )
}
```

Acesse: `http://localhost:3000/test-firebase`

---

## 📚 **Próximos Passos**

Depois de configurar o Firebase:

1. ✅ Leia `FIREBASE_SETUP.md` para detalhes avançados
2. ✅ Configure Cloud Functions (emails)
3. ✅ Configure Stripe (pagamentos)
4. ✅ Deploy para Vercel

**Tempo total de setup: 15-20 minutos** 🚀

