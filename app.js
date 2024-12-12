const express = require('express');
const app = express();
const port = 3000;
const { createAllTables } = require('./tables.js');
app.get('/', (req, res) => {
  res.send('Hello World!');
});

/* Exectuer le fichier table.js pour créer les tables */
createAllTables();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});