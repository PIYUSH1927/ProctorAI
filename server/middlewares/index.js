const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "mySuperSecretKey12345";

const requireSignIn = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (token) {
        try {
            const user = jwt.verify(token, JWT_SECRET_KEY);
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ msg: "Invalid or expired token" });
        }
    } else {
        return res.status(400).json({ msg: "Authorization token missing" });
    }
};

module.exports = { requireSignIn };