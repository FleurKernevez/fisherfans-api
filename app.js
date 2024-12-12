const express = require('express');
const app = express();
const port = 3000;
const { createAllTables } = require('./tables.js');
const { router } = require('./router.js');

/* Exectuer le fichier table.js pour créer les tables */
createAllTables();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* Rooting du web service */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

exports.app = app;