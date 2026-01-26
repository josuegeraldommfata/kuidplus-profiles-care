#!/bin/bash

# Script de deploy para VPS Hostinger - KUID+
echo "🚀 Iniciando deploy do KUID+ na VPS..."

# 1. Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js se não estiver instalado
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Instalar PM2 globalmente
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# 4. Instalar Nginx se não estiver instalado
if ! command -v nginx &> /dev/null; then
    echo "📦 Instalando Nginx..."
    sudo apt install -y nginx
fi

# 5. Criar diretórios necessários
echo "📁 Criando diretórios..."
sudo mkdir -p /var/www/html/frontend
sudo mkdir -p /var/www/html/backend
sudo mkdir -p /var/log/pm2

# 6. Copiar arquivos do projeto (assumindo que você fez upload via FTP/SCP)
echo "📋 Copiando arquivos do projeto..."
# Substitua pelo seu método de upload
# scp -r ./* root@seu-ip:/var/www/html/

# 7. Configurar Nginx
echo "🔧 Configurando Nginx..."
sudo cp nginx-kuiddmais.conf /etc/nginx/sites-available/kuiddmais.com.br
sudo ln -sf /etc/nginx/sites-available/kuiddmais.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd /var/www/html/backend
npm install --production

# 9. Build do frontend
echo "🔨 Fazendo build do frontend..."
cd /var/www/html/frontend
npm install
npm run build

# 10. Iniciar aplicações com PM2
echo "🚀 Iniciando aplicações..."
cd /var/www/html
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 11. Verificar status
echo "✅ Verificando status..."
pm2 status
sudo systemctl status nginx

echo "🎉 Deploy concluído!"
echo "📱 Frontend: https://kuiddmais.com.br"
echo "🔧 Backend API: https://kuiddmais.com.br/api/"
echo ""
echo "💡 Comandos úteis:"
echo "  pm2 restart kuid-backend    # Reiniciar backend"
echo "  pm2 logs kuid-backend       # Ver logs do backend"
echo "  sudo nginx -t && sudo systemctl reload nginx  # Reload Nginx"
