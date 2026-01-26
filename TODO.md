# Correção do Perfil Fantasma no DashboardProfissional

## Problema Identificado
- DashboardProfissional.tsx usa dados mockados em vez de buscar dados reais do profissional logado
- Novos cadastros sempre mostram perfil de "Enfermeiro(a)" porque caem no fallback mockProfessionals[0]

## Solução Implementada
- [x] Modificar DashboardProfissional.tsx para buscar dados reais via API
- [x] Remover uso de dados mockados para usuários logados
- [x] Adicionar estado para perfil profissional
- [x] Implementar chamada para /api/professionals/:id usando user.id
- [x] Atualizar JSX para usar dados reais
- [x] Manter fallback para casos sem login

## Testes Necessários
- [ ] Testar login com profissional recém-cadastrado
- [ ] Verificar se mostra dados corretos (nome, profissão, etc.)
- [ ] Testar com diferentes tipos de profissionais
- [ ] Verificar se não quebra para usuários não logados
