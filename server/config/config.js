// ===============
// puerto
// ===============

process.env.PORT = process.env.PORT || 3000;

// ===============
// entorno
// ===============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============
// Seed
// ===============

process.env.SEED = process.env.SEED || 'TheOldHunterSeedDEV';

// ===============
// vencimiento del jwt
// ===============
// 60 sec
// 60 min
// 24 H
// 30 D

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===============
// Mongo
// ===============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ===============
// Google Client ID
// ===============

process.eventNames.CLIENT_ID = process.eventNames.CLIENT_ID || '38457011505-np20b0c357tm141chper88h2ue1ovc7u.apps.googleusercontent.com';