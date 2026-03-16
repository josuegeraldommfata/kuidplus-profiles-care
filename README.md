# KuidPlus Profiles Care

## 🚀 Como Executar (Separado - Recomendado)

### Backend apenas (API no http://localhost:3000)
```bash
cd backend
npm install
npm run dev
```

### Frontend apenas (App no http://localhost:8080)
```bash
npm install
npm run dev
```

**Nota**: Frontend tem proxy automático para `/api` → `localhost:3000`. Rode backend primeiro!

### Executar ambos juntos (antigo comportamento)
```bash
npm run dev:all
```

## Desenvolvimento

**npm run dev**: Frontend apenas (:8080)
**npm run dev:backend**: Backend apenas (:3000)
**npm run dev:all**: Frontend + Backend

## Deploy

Veja `DEPLOY.md` ou PM2 (`ecosystem.config.js`).

## Stack
- Frontend: Vite + React + TypeScript + shadcn/ui + Tailwind
- Backend: Node.js + Express + PostgreSQL + Socket.io
