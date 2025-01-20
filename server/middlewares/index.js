const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "mySuperSecretKey12345"; 

const requireSignIn = (req, res, next) => {
    const token = req.cookies.token; 

    if (token) {
        try {
            const user = jwt.verify(token, JWT_SECRET_KEY);
            req.user = user;
            next();
        } catch (error) {
            console.error("JWT verification error:", error.message);
            return res.status(401).json({ msg: "Invalid or expired token" });
        }
    } else {
        return res.status(400).json({ msg: "Authorization token missing" });
    }
};



module.exports = { requireSignIn };
