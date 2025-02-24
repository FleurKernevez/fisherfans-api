# Fisher Fans API

## Description
API pour la gestion des utilisateurs, bateaux, sorties en mer et réservations pour l'application Fisher Fans, une plateforme permettant le partage de places sur un bateau pour des sorties pêche ou chasse sous-marine, ainsi que la location et réservation de bateaux.

## Technologies utilisées
- Node.js
- Express.js
- SQLite
- JWT pour l'authentification

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone <URL_DU_REPO>
   cd fisher-fans-api
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Démarrer le serveur**
   ```sh
   npm start
   ```

Le serveur démarre sur `http://localhost:3000/api/v2`

## Routes principales

### Utilisateurs
- `POST /api/v2/user` : Créer un utilisateur
- `GET /api/v2/user/:id` : Récupérer un utilisateur
- `PUT /api/v2/user/:id` : Mettre à jour un utilisateur
- `DELETE /api/v2/user/:id` : Supprimer un utilisateur

### Bateaux
- `POST /api/v2/boat` : Ajouter un bateau
- `GET /api/v2/boat` : Récupérer tous les bateaux
- `GET /api/v2/boat/:id` : Récupérer un bateau spécifique
- `PUT /api/v2/boat/:id` : Mettre à jour un bateau
- `DELETE /api/v2/boat/:id` : Supprimer un bateau

### Sorties en mer
- `POST /api/v2/boatTrip` : Créer une sortie
- `GET /api/v2/boatTrip` : Récupérer toutes les sorties
- `GET /api/v2/boatTrip/:id` : Récupérer une sortie spécifique
- `PUT /api/v2/boatTrip/:id` : Mettre à jour une sortie
- `DELETE /api/v2/boatTrip/:id` : Supprimer une sortie

### Réservations
- `POST /api/v2/reservation` : Créer une réservation
- `GET /api/v2/reservation` : Récupérer toutes les réservations
- `GET /api/v2/reservation/:id` : Récupérer une réservation spécifique
- `PUT /api/v2/reservation/:id` : Modifier une réservation
- `DELETE /api/v2/reservation/:id` : Supprimer une réservation

### Carnet de pêche
- `POST /api/v2/fishingBook` : Créer un carnet de pêche
- `GET /api/v2/fishingBook/:id` : Récupérer un carnet
- `POST /api/v2/fishingBook/page` : Ajouter une page au carnet
- `GET /api/v2/fishingBook/:fishingBookId/pages` : Récupérer les pages d'un carnet
- `PUT /api/v2/fishingBook/page/:id` : Modifier une page du carnet
- `DELETE /api/v2/fishingBook/:fishingBookId/page/:id` : Supprimer une page du carnet

## Sécurité
L'API utilise l'authentification JWT (`bearer token`). Chaque requête nécessitant une authentification doit inclure un header `Authorization` comme suit :
```sh
Authorization: Bearer <TOKEN>
```


