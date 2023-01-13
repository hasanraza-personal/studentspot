const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hellohoq@reY0u';

const fetchUser = (req, res, next) => {
    // Get the user from the JWT token and add id to req Object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Access Denied"})
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = fetchUser;