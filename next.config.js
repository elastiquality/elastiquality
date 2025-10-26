/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'elastiquality.pt'],
    unoptimized: true,
  },
  // trailingSlash: true, // Removido para evitar problemas de rotas
  // Next.js irá gerar automaticamente:
  // - SSG para páginas estáticas (institucionais)
  // - SSR para páginas dinâmicas (dashboard, perfis)
  // - API Routes funcionam perfeitamente
}

module.exports = nextConfig
