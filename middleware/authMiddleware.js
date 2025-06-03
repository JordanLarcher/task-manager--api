const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({ message: 'Access token missing or invalid'});
    }

    const token = authHeader.split(" ")[1];
    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }catch (error) {
        res.status(403).json( { message: 'Token is not valid or has expired'});
    }
}