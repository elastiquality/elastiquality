# Elastiquality - Website de Oferta e Procura de Serviços

Este é o website Elastiquality, uma plataforma que conecta clientes com profissionais de serviços em Portugal.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React para desenvolvimento web
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS para estilização
- **Firebase** - Plataforma para hospedagem e serviços backend
- **Lucide React** - Biblioteca de ícones

## 📁 Estrutura do Projeto

```
elastiquality3/
├── app/                    # Páginas e layouts (App Router)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/             # Componentes reutilizáveis
│   ├── Header.tsx         # Cabeçalho do site
│   ├── Footer.tsx         # Rodapé do site
│   ├── Hero.tsx           # Seção hero da página inicial
│   ├── ServiceCategories.tsx # Categorias de serviços
│   ├── HowItWorks.tsx     # Como funciona
│   ├── Testimonials.tsx   # Depoimentos
│   └── CTA.tsx            # Call to action
├── public/                 # Arquivos estáticos
│   ├── logo.png           # Logo da empresa
│   ├── favicon.ico        # Favicon
│   └── ...                # Outros assets
├── lib/                    # Utilitários e configurações
├── types/                  # Definições de tipos TypeScript
└── package.json           # Dependências do projeto
```

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Funcionalidades Implementadas

### ✅ Página Inicial
- Header responsivo com navegação
- Seção Hero com busca de serviços
- Categorias de serviços organizadas
- Seção "Como Funciona"
- Depoimentos de clientes
- Call to Action
- Footer completo

### ✅ Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Navegação mobile com menu hambúrguer
- Componentes otimizados para diferentes tamanhos de tela

### ✅ Componentes Reutilizáveis
- Header com autenticação (preparado para implementação)
- Footer com links e informações de contato
- Sistema de cores consistente com Tailwind CSS

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter

## 🌐 Hospedagem

O projeto está configurado para ser hospedado no **Firebase Hosting**.

### Configuração do Firebase:

1. Instalar Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Fazer login no Firebase:
   ```bash
   firebase login
   ```

3. Inicializar projeto Firebase:
   ```bash
   firebase init hosting
   ```

4. Fazer deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 📋 Próximos Passos

- [ ] Implementar sistema de autenticação
- [ ] Criar páginas de busca e filtros
- [ ] Implementar sistema de perfis de usuários
- [ ] Adicionar sistema de mensagens
- [ ] Implementar sistema de avaliações
- [ ] Criar painel administrativo
- [ ] Desenvolver aplicativo mobile (React Native)

## 🤝 Contribuição

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **Email:** contato@elastiquality.pt
- **Telefone:** +351 21 253 4021
- **Website:** https://elastiquality.pt

---

© 2024 Elastiquality. Todos os direitos reservados.
