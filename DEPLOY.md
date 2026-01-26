# Guia de Deploy para VPS

## 📋 Checklist de Deploy

### 1. Preparação do Ambiente

- [ ] Node.js instalado (v18+)
- [ ] PostgreSQL instalado e rodando
- [ ] PM2 instalado globalmente: `npm install -g pm2`
- [ ] Nginx instalado (para proxy reverso)

### 2. Configuração do Banco de Dados

```bash
# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE kuid;
\q

# Executar migrations
cd backend
node run_migrations.js

# Executar seed
node seed.js
```

### 3. Variáveis de Ambiente

Criar arquivo `backend/.env`:

```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kuid
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# Frontend URL
FRONTEND_URL=https://seu-dominio.com

# SMTP (Opcional - para envio de emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# Mercado Pago (se usar)
MP_ACCESS_TOKEN=seu_token_mercadopago
```

### 4. Build do Frontend

```bash
# Na raiz do projeto
npm install
npm run build

# O build será gerado em ./dist
```

### 5. Instalação de Dependências do Backend

```bash
cd backend
npm install --production
```

### 6. Configuração do PM2

Criar arquivo `ecosystem.config.js` na raiz:

```js
module.exports = {
  apps: [
    {
      name: 'kuid-backend',
      script: './backend/server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'kuid-frontend',
      script: 'serve',
      args: '-s dist -l 8080',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true
    }
  ]
};
```

Instalar serve globalmente:
```bash
npm install -g serve
```

Iniciar com PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Configuração do Nginx

Criar arquivo `/etc/nginx/sites-available/kuid`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirect HTTP to HTTPS (opcional)
    # return 301 https://$server_name$request_uri;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Ativar site:
```bash
sudo ln -s /etc/nginx/sites-available/kuid /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Certificado SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### 9. Comandos Úteis

```bash
# Ver logs
pm2 logs

# Reiniciar aplicação
pm2 restart all

# Parar aplicação
pm2 stop all

# Status
pm2 status

# Ver logs específicos
pm2 logs kuid-backend
pm2 logs kuid-frontend
```

### 10. Estrutura de Diretórios no Servidor

```
/home/usuario/kuidplus-profiles-care/
├── backend/
│   ├── .env
│   ├── server.js
│   ├── routes/
│   ├── uploads/
│   └── ...
├── dist/              # Build do frontend
├── logs/              # Logs do PM2
├── ecosystem.config.js
└── package.json
```

### 11. Atualizações

```bash
# 1. Fazer pull das atualizações
git pull

# 2. Instalar dependências
npm install
cd backend && npm install

# 3. Build do frontend
npm run build

# 4. Reiniciar aplicação
pm2 restart all
```

## 🔒 Segurança

- [ ] Configurar firewall (UFW)
- [ ] Usar HTTPS
- [ ] Configurar senhas seguras
- [ ] Limitar acesso ao banco de dados
- [ ] Configurar backups automáticos

## 📝 Notas

- O frontend roda na porta 8080
- O backend roda na porta 5000
- Nginx faz proxy reverso na porta 80/443
- Uploads ficam em `backend/uploads/`

