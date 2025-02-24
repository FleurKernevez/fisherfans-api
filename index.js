'use strict';

const path = require('path');
const http = require('http');
const express = require('express');

const oas3Tools = require('oas3-tools');
const serverPort = 8080;

// Configuration du Swagger Router
const options = {
    routing: {
        controllers: path.join(__dirname, './routes/v2') // Associer les routes de la V2
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

// Ajout du middleware JSON pour Express
app.use(express.json());

// Initialisation du serveur HTTP
http.createServer(app).listen(serverPort, function () {
    console.log(`Server is running at http://localhost:${serverPort}`);
});
