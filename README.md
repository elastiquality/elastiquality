# Elastiquality - Website de Oferta e Procura de Serviços

Este é o website Elastiquality, uma plataforma que conecta clientes com profissionais de serviços em Portugal.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React para desenvolvimento web
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS para estilização
- **Firebase** - Plataforma para hospedagem e serviços backend
- **Stripe** - Processamento de pagamentos
- **Lucide React** - Biblioteca de ícones

## 📁 Estrutura do Projeto

```
elastiquality3/
├── app/                    # Páginas e layouts (App Router)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard do usuário
│   └── services/          # Páginas de serviços
├── components/             # Componentes reutilizáveis
├── lib/                    # Utilitários e configurações
│   ├── firebase.ts        # Configuração do Firebase
│   ├── stripe.ts         # Configuração do Stripe
│   ├── auth.tsx          # Context de autenticação
│   └── ...                # Outros utilitários
├── public/                 # Arquivos estáticos
├── functions/              # Cloud Functions do Firebase
└── types/                  # Definições de tipos TypeScript
```

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias (ver `.env.local` para exemplo)

3. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Abrir no navegador:**
   Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login com email e senha
- Registro de novos usuários
- Recuperação de senha
- Proteção de rotas

### ✅ Dashboard
- Dashboard para clientes e profissionais
- Gerenciamento de perfil
- Histórico de solicitações e propostas

### ✅ Solicitação de Serviços
- Criação de solicitações de orçamento
- Upload de imagens
- Categorização por distritos e códigos postais

### ✅ Sistema de Propostas
- Profissionais podem enviar propostas
- Clientes podem aceitar propostas
- Comunicação via chat

### ✅ Chat em Tempo Real
- Mensagens entre clientes e profissionais
- Notificações Firebase

### ✅ Pagamentos
- Integração com Stripe
- Processamento de pagamentos seguros

## 🌐 Deploy

O projeto está hospedado no **Vercel** e pode ser acessado em:
- **URL de Produção:** https://elastiquality.pt

### Configuração do Vercel:

As variáveis de ambiente estão configuradas no dashboard do Vercel. Para fazer deploy:

```bash
npm run build
vercel --prod
```

## 📋 Status do Projeto

- ✅ Autenticação com Firebase
- ✅ Sistema de solicitações
- ✅ Sistema de propostas
- ✅ Chat em tempo real
- ✅ Upload de imagens
- ✅ Integração com Stripe
- ✅ Deploy na Vercel
- ✅ Speed Insights

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter

## 📞 Contato

- **Email:** contato@elastiquality.pt
- **Telefone:** +351 21 253 4021
- **Website:** https://elastiquality.pt

---

© 2024 Elastiquality. Todos os direitos reservados.
