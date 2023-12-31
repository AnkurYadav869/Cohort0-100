const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const bearer = req.headers.token;
    const token = bearer.split(" ");
    console.log("hi there", token);

    try {
        const username = jwt.verify(token[1], JWT_SECRET);
        console.log(username);
        if (username) {
            next();
        } else {
            res.status(411).json({ msg: "User not authenticated" });
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = adminMiddleware;
