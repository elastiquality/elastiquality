# Sistema de Códigos Postais Locais

## 📋 Visão Geral

Este sistema implementa uma API local para códigos postais portugueses, permitindo autocomplete de localização com freguesia, concelho e distrito, sem depender de APIs externas.

## 🚀 Como Usar

### 1. Baixar os Dados (Executar semanalmente)

```bash
npm run update-postal-codes
```

Este comando irá:
- Baixar todos os códigos postais de Portugal da API dos CTT
- Salvar os dados em `data/postal-codes.json`
- Criar um índice otimizado em `data/postal-codes-index.json`

### 2. Como Funciona

A aplicação tenta usar a API local primeiro, com fallback automático para APIs externas:
1. **API Local** (`/api/postal-codes`) - Mais rápido, dados completos
2. **API CTT** - Backup oficial
3. **API Alternativa** - Backup secundário

### 3. Estrutura de Dados

```json
{
  "postalCode": "1000",
  "postalCodeExt": "001",
  "freguesia": "Areeiro",
  "council": "Lisboa",
  "district": "Lisboa",
  "region": "Área Metropolitana de Lisboa"
}
```

## 📁 Arquivos Criados

- `app/api/postal-codes/route.ts` - API Route do Next.js
- `lib/postal-codes.ts` - Funções utilitárias
- `scripts/update-postal-codes.js` - Script de atualização
- `data/postal-codes.json` - Base de dados completa
- `data/postal-codes-index.json` - Índice para buscas rápidas

## ✅ Benefícios

### Performance
- ✅ Resposta mais rápida (dados locais)
- ✅ Sem limites de API
- ✅ Offline funcionamento
- ✅ Melhor UX

### Dados
- ✅ Todas as moradas de Portugal
- ✅ Freguesia, concelho e distrito
- ✅ Códigos postais com extensão
- ✅ Atualização semanal automática

### Controle
- ✅ Dados próprios
- ✅ Sem dependências externas
- ✅ Facilmente extensível
- ✅ Cache local

## 🔧 Configuração Automática

Para atualizar automaticamente todas as semanas, configure um cron job:

```bash
# No crontab (Linux/Mac)
0 0 * * 1 cd /path/to/project && npm run update-postal-codes

# Ou use GitHub Actions para atualizar automaticamente
```

## 📊 Exemplo de Uso

O sistema já está integrado no componente `Hero.tsx`:

```typescript
// Busca por código postal
Input: "1000"
Output: ["1000-001 Lisboa", "1000-002 Lisboa", ...]

// Busca por nome
Input: "Lisboa"
Output: ["Lisboa, Lisboa", "Lisboa, Setúbal", ...]

// Geolocalização
Click no botão de navegador para usar localização atual
```

## 🎯 Próximos Passos

1. Execute `npm run update-postal-codes` para baixar os dados
2. Teste a funcionalidade no site
3. Configure atualização automática semanal
4. Opcional: Adicionar cache no navegador do utilizador

