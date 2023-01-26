const http = require('http'); // importation du package 'http'

const app = require('./app'); // importation de l'app

const normalizePort = val => { // normalisation des ports

  const port = parseInt(val, 10); // parse la chaine de caractères 'port"

  if (isNaN(port)) { // si le port n'est pas un nombre :
    return val;
  }
  if (port >= 0) { // si le port est supérieur ou égal à zéro :
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT); // récupération et normalisation du port depuis le fichier '.env'
app.set('port', port);  // défini le 'port'

const errorHandler = error => { // en cas d'erreur :
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // création du server

server.on('error', errorHandler); 
server.on('listening', () => {  
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); 
});

server.listen(port); // écoute du port 

