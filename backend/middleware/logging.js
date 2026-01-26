const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${req.method} ${req.url} - IP: ${req.ip}\n`;

  // Log to console
  console.log(`${timestamp} - ${req.method} ${req.url}`);

  // Log to file
  fs.appendFile(path.join(logsDir, 'requests.log'), logEntry, (err) => {
    if (err) console.error('Erro ao escrever log:', err);
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorEntry = `${timestamp} - ERROR: ${err.message} - ${req.method} ${req.url} - Stack: ${err.stack}\n`;

  console.error(`${timestamp} - ERROR: ${err.message}`);

  fs.appendFile(path.join(logsDir, 'errors.log'), errorEntry, (err) => {
    if (err) console.error('Erro ao escrever log de erro:', err);
  });

  next(err);
};

module.exports = {
  requestLogger,
  errorLogger
};
