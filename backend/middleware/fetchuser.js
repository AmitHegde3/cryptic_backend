const jwt = require("jsonwebtoken");
const JWT_SECRET = "This is a test";

const fetchuser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticte using a valid token1" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticte using a valid token" });
    }
};

module.exports = fetchuser;