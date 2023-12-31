const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
// Middleware for handling auth
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const bearer = req.headers.token;
    const token = bearer.split(" ");
    const username = jwt.verify(token[1], JWT_SECRET);
    if (username) {
        next();
    } else {
        res.status(411).json({ msg: "User not authenticated" });
    }
}

module.exports = userMiddleware;
