# TODO - Correção do erro CSS

- [x] 1. Editar src/index.css para corrigir imports das fontes (remover \n literais)
- [ ] 2. Testar servidor Vite (bun dev ou npm run dev)
- [ ] 3. Concluir tarefa

- [x] Fonoaudiólogo(a)
- [x] Fisioterapeuta
- [x] Nutricionista
- [x] Terapeuta Ocupacional

## 2. Novos Planos (✅ Concluído)
- [x] PLANO BASE (R$ 49/mês): Perfil ativo + calendário + feedbacks
- [x] PLANO PROFISSIONAL (R$ 99/mês): Tudo acima + destaque na busca + selo verificado
- [x] PLANO PREMIUM (R$ 179/mês): Tudo acima + aparece no topo + badge de especialista

## 3. Cidades Iniciais (✅ Concluído)
- [x] Campinas
- [x] São Paulo
- [x] Rio de Janeiro
- [x] Belo Horizonte
- [x] Curitiba

## 4. Sistema de Calendário/Agenda (✅ Concluído)
- [x] Criar tabela de agendamentos no banco (migration)
- [x] API para gerenciar disponibilidade
- [x] Frontend do calendário
- [x] Mostrar dias vagos
- [x] Ao clicar no dia, mostrar horários preenchidos/vagos

## 5. Dashboards para Cada Tipo de Profissional (✅ Já Existia)
- [x] Dashboard Profissional existente serve para todos os tipos

## 6. Sistema de Avaliações (✅ Já Existia)
- [x] Avaliações de profissionais por contratantes
- [x] Avaliações de contratantes por profissionais
- [x] Sistema de rating
- [x] Timeline de avaliações

## Arquivos Criados/Atualizados:

### Backend:
- backend/seed_plans.js - Novos planos (BASE R$49, PROFISSIONAL R$99, PREMIUM R$179)
- backend/migrations/20260118_create_schedules_table.sql - Tabela de agendamentos
- backend/routes/schedules.js - API do calendário
- backend/server.js - Registro das novas rotas

### Frontend:
- src/data/mockData.ts - Novos tipos de profissionais + cidades iniciais
- src/pages/Planos.tsx - Interface atualizada com os novos planos
- src/components/ui/Calendar.tsx - Componente de calendário

### Correções de Upload:
- backend/routes/professionals.js - Atualizado para permitir PDF em certificados e antecedentes criminais
- Foto de perfil: JPG, PNG
- Certificados: JPG, PNG, PDF
- Antecedentes criminais: PDF
- Vídeo: MP4
