// ==========================
// PUERTO
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// ENVIROMENT
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// CADENA DE CONEXIÓN
// ==========================
let urlDB;


if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb+srv://godzilla:k0lRHqzKLGYbEfFd@cluster0-jrmse.mongodb.net/cafe';

process.env.URLDB = urlDB;