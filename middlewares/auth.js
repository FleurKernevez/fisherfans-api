const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization); // Log pour vérifier l'en-tête

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Token is missing or invalid');
        return res.status(401).json({ error: 'Access denied: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing from .env');
            return res.status(500).json({ error: 'Internal server error: Missing JWT_SECRET' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log pour vérifier le contenu du token
        req.user = decoded; // Associer les données décodées à la requête
        next();
    } catch (err) {
        console.error('Token validation error:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateUser;
