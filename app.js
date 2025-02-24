const express = require('express');
const app = express();
const port = 3000;
const { createAllTables } = require('./tables.js');
require('dotenv').config();

// Importer uniquement les routes V2
const v2Routes = require('./routes/v2');

// Exécuter le fichier table.js pour créer les tables
createAllTables();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json()); 

// Utiliser uniquement les routes V2
app.use('/api/v2', v2Routes);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api/v2`);
});
