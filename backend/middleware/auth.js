const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.token);
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: 'Token is invalid. Please log in.' });
    }
};

module.exports = authMiddleware;
