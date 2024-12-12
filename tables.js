const sqlite3 = require('sqlite3').verbose();

// Créer ou ouvrir la base de données SQLite
const database = new sqlite3.Database("./fisher-fans.db", (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
    } else {
        console.log('Connexion à la base de données réussie');
    }
});

// Créer la table 'user' si elle n'existe pas
const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS "user" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            lastname TEXT,  
            firstname TEXT,
            birthdate DATETIME,              
            email TEXT NOT NULL UNIQUE,
            password TEXT,
            phoneNumber TEXT,
            address TEXT,                         
            postalCode TEXT,
            city TEXT,
            languagesSpoken TEXT,
            insuranceNumber TEXT,
            boatLicenceNumber TEXT,
            status TEXT CHECK(status IN('particulier', 'professionnel')),
            activityType TEXT CHECK(activityType IN('location', 'guide de pêche')),
            urlUserPicture TEXT,
            SIRETNumber TEXT,
            RCNumber TEXT,
            companyName TEXT,
            RCNumber TEXT,
            companyName TEXT,
            boatTrip_id INTEGER,
            reservation_id INTEGER,
            FOREIGN KEY (boatTrip_id) REFERENCES boatTrip(id),
            FOREIGN KEY (reservation_id) REFERENCES reservation(id)                
        );
    `;
    // Exécuter la requête pour créer la table
    database.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table "user":', err.message);
        } else {
            console.log('Table "user" créée ou déjà existante.');
        }
    });
}

// Créer la table 'boat' si elle n'existe pas
const createBoatTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS "boat" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            name TEXT,  
            description TEXT,
            brand TEXT,
            productionYear INTEGER,
            urlBoatPicture TEXT,
            licenceType TEXT CHECK (licenceType IN ('côtier', 'fluvial')),                     
            type TEXT CHECK (type IN ('open', 'cabine', 'catamaran', 'voilier', 'jet-ski', 'canoë')),
            equipment TEXT CHECK (equipment IN ('sondeur', 'vivier', 'échelle', 'GPS', 'porte-cannes', 'radio VHF')),
            cautionAmount REAL,
            capacityMax INTEGER,
            bedsNumber INTEGER,
            homePort TEXT,
            latitude1 REAL,
            longitude1 REAL,
            latitude2 REAL,
            longitude2 REAL,
            engineType TEXT CHECK(engineType IN ('diesel', 'essence', 'aucun')),
            enginePower INTEGER,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `;
    
    // Exécuter la requête pour créer la table
    database.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table "boat":', err.message);
        } else {
            console.log('Table "boat" créée ou déjà existante.');
        }
    });
}

// Créer la table 'boatTrip' si elle n'existe pas
const createBoatTripTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS "boatTrip" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            title TEXT,  
            practicalInformation TEXT,
            type TEXT CHECK(type IN ('journalière', 'récurrente')),                       
            priceType TEXT CHECK(priceType IN ('global', 'par personne')),
            startDate TEXT,
            endDate TEXT,
            passengersNumber INTEGER,
            price REAL,
            user_id INTEGER,
            boat_id INTEGER,
            reservation_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (boat_id) REFERENCES boat(id),
            FOREIGN KEY (reservation_id) REFERENCES reservation(id)   
        );
    `;
    
    // Exécuter la requête pour créer la table
    database.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table "boatTrip":', err.message);
        } else {
            console.log('Table "boatTrip" créée ou déjà existante.');
        }
    });
}

// Créer la table 'reservation' si elle n'existe pas
const createReservationTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS "reservation" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            choosenDate TEXT,
            seatsBooked INTEGER,
            totalPrice REAL,
            user_id INTEGER,
            boatTrip_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id)
            FOREIGN KEY (boatTrip_id) REFERENCES boatTrip(id)
        );
    `;
    
    // Exécuter la requête pour créer la table
    database.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table "reservation":', err.message);
        } else {
            console.log('Table "reservation" créée ou déjà existante.');
        }
    });
}

// Créer la table 'bookPage' si elle n'existe pas
const createBookPageTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS "bookPage" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            fishName TEXT,
            urlFishPicture TEXT,
            comment TEXT,
            size REAL,
            weight REAL,
            fishingPlace TEXT,
            fishingDate TEXT,
            releasedFish BLOB,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `;
    
    // Exécuter la requête pour créer la table
    database.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table "bookPage":', err.message);
        } else {
            console.log('Table "bookPage" créée ou déjà existante.');
        }
    });
}

/**
 * Execute la création des toutes les tables si elles n'existent pas déjà
 *   createUserTable() : Table 'User'
 *   createBoatTable() : Table 'Boat'
 *   createBoatTripTable() : Table 'BoatTrip'
 *   createReservationTable() : Table 'Reservation'
 *   createBookPageTable() : Table 'BookPage'
 */
const createAllTables = () => {
    createUserTable();
    createBoatTable();
    createBoatTripTable();
    createReservationTable();
    createBookPageTable();
}

// Exporter la connexion à la base de données pour utilisation ailleurs dans l'application
module.exports = { database, createAllTables };
