@echo off
ren "src\components\layout\Header.tsx" Header-broken.tsx
ren "src\components\layout\Header-fixed.tsx" Header.tsx
echo Header.tsx corrigido! Reinicie bun dev.
pause
