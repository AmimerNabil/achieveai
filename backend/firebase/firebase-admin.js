const admin = require('firebase-admin');
const serviceAccount = require('../service-acount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const verifyIdToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1]; // Get token from "Authorization" header

    if (!idToken) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user info to the request
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

module.exports = {
    admin, verifyIdToken
};
