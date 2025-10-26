# Teste de Cloud Functions - Elastiquality

## 📋 Status

### ✅ Preparado para Deploy

As Cloud Functions foram simplificadas e estão prontas para teste.

## 🚀 Como Testar

### 1. Deploy das Funções

```bash
cd C:\elastiquality3
firebase deploy --only functions
```

### 2. Testar Função Hello World

Após o deploy, acesse:
```
https://us-central1-serviceelastiquality.cloudfunctions.net/helloWorld
```

Você deve ver:
```
✅ Hello from Firebase Cloud Functions! Elastiquality is ready!
```

### 3. Testar Função Callable

No frontend, você pode chamar:
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getServerTime = httpsCallable(functions, 'getServerTime');

const result = await getServerTime();
console.log(result.data);
```

### 4. Testar Triggers

1. Crie um usuário no site
2. Verifique logs no Firebase Console
3. Você deve ver: "✅ New user created"

## 📊 Funções Criadas

1. **helloWorld** (HTTP) - Teste simples
2. **getServerTime** (Callable) - Retorna timestamp do servidor
3. **onUserCreate** (Firestore Trigger) - Log quando usuário é criado
4. **onProposalCreate** (Firestore Trigger) - Log quando proposta é criada
5. **stripeWebhook** (HTTP) - Para webhooks do Stripe

## ⚠️ Observações

### Antes de Fazer Deploy

1. **Instale dependências:**
   ```bash
   cd functions
   npm install
   ```

2. **Verifique se está logado:**
   ```bash
   firebase login
   ```

3. **Confirme o projeto:**
   ```bash
   firebase use serviceelastiquality
   ```

### Durante o Deploy

- Pode levar 2-5 minutos
- Você verá a URL da função no final
- Guarde a URL para testes

### Após o Deploy

1. Teste cada função pelo navegador ou código
2. Veja logs em: Firebase Console > Functions > Logs
3. Se houver erro, corriga e faça redeploy

## 🔧 Próximas Funções

Depois que as funções básicas funcionarem, podemos adicionar:

1. **Emails** - Envio de emails de boas-vindas
2. **Notificações** - Sistema de notificações in-app
3. **Image Processing** - Redimensionar/otimizar imagens
4. **Scheduled Functions** - Limpeza automática de dados
5. **Stripe Integration** - Processar pagamentos e assinaturas

## 📞 Troubleshooting

### Erro: "Could not load the default credentials"

Configure o Firebase Admin:
```bash
firebase login:ci
```

### Erro: "Deploy failed"

Verifique:
- Node version (deve ser 18)
- Dependências instaladas
- Logs do Firebase Console

### Função não aparece

- Aguarde alguns minutos
- Verifique em: Firebase Console > Functions
- Faça redeploy se necessário

## ✅ Checklist

- [ ] `npm install` executado em `functions/`
- [ ] Firebase CLI logado
- [ ] Projeto correto selecionado
- [ ] Deploy executado com sucesso
- [ ] Função helloWorld testada
- [ ] Logs verificados no Console

