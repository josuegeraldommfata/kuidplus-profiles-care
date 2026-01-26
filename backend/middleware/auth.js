const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
 const authHeader = req.headers['authorization']; // Ex: "Bearer <token>"
 const token = authHeader && authHeader.split(' ')[1];

 if (!token) {
 return res.status(401).json({ error: 'Token não fornecido' });
 }

 jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
 if (err) {
 console.error('Erro ao verificar token:', err);
 return res.status(403).json({ error: 'Token inválido ou expirado' });
 }

 console.log('Payload do token decodificado:', decoded);

 // Garante formato consistente para o restante do código
 req.user = {
 id: decoded.id,
 role: decoded.role,
 };

 next();
 });
}

module.exports = { authenticateToken };

