const express = require('express');
const app = express();
const port = 3000;
const { createAllTables } = require('./tables.js');
const router = require('./router.js'); // Importer le router
require('dotenv').config();

/* Exécuter le fichier table.js pour créer les tables */
createAllTables();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json()); 

// Utiliser le router dans l'app
app.use(router); // C'est ici que nous enregistrons toutes les routes

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});