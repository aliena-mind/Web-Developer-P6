const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes en Ms
  max: 3, // limite chaque IP à 3 requêtes toutes les 15 minutes
  message: 'Too many login attempts, please try again later'
});

module.exports = loginLimiter; // exportation du module
