# Correções Erros Console - KuidPlus Profiles Care

## ✅ PASSO 1: Criar TODO.md e planejar
- [x] Criar arquivo TODO.md

## ✅ PASSO 2: Fix DashboardStats.tsx (CRASH CRÍTICO) 
- [x] Editado `src/components/DashboardStats.tsx`
  - ✅ `Number(s.profile?.rating || 0).toFixed(1)`

## ✅ PASSO 3: Fix API Profile Location (Backend)
- [x] Editado `backend/routes/profile.js`
  - ✅ SQL corrigido (userResult, result declarados)
  - ✅ PUT → PATCH + campos dinâmicos opcionais
  - ✅ Frontend só precisa enviar lat/lng

## ✅ PASSO 4: Endpoint proposals/my-counts (500 error)
- [x] Editado `backend/routes/proposals.js`
  - ✅ `GET /api/proposals/my-counts` com contadores por role
  - ✅ Fix `MarketplaceSidebar` error

## ⏳ PASSO 5: Testes
- [ ] Backend restart
- [ ] Test DashboardProfissional sem erros
- [ ] Console limpo

**Progresso: 3/5 passos ✅**

## ⏳ PASSO 4: Criar endpoint proposals/my-counts
- [ ] Editar/criar `backend/routes/proposals.js`
  - `GET /api/proposals/my-counts` com contadores default 0

## ⏳ PASSO 5: Melhorias Frontend
- [ ] `src/contexts/AuthContext.tsx` - melhor error handling

## ⏳ TESTES
- [ ] Backend: `cd backend && bun dev`
- [ ] Frontend: DashboardProfissional sem crash
- [ ] Console limpo (sem 404/500)
- [ ] Test geolocation API

**Progresso: 1/7 passos ✅**

