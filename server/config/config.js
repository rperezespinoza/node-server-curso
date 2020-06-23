// ==========================
// PUERTO
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// ENVIROMENT
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// VENCIMIENTO DEL TOKEN
// ==========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = "7d" //60 * 60 * 24 * 30;

// ==========================
// SEED de autenticación
// ==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================
// CLIENT_ID de google sign
// ==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '971060927455-889doem7vgh3djfv6u411tvk4fa1ih0h.apps.googleusercontent.com';

// ==========================
// CADENA DE CONEXIÓN
// ==========================
let urlDB;


if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;