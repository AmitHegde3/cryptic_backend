const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Importing the User model
const { query, validationResult } = require("express-validator"); // Importing validation utilities
const bcrypt = require("bcryptjs"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing JWT for token generation
const fetchuser = require("../middleware/fetchuser") // Importing middleware for fetching user

const JWT_SECRET = "This is a test"
console.log("Secret toke is:",JWT_SECRET)
router.use(express.json()); 

// Router 1: Create a User using : POST "/api/auth/createUSer". Doesnt require auth

router.post("/createUser",
    [
        // Validation checks for name, email, and password
        body("name", "Enter a valid Name").isLength({ min: 5 }),
        query("email", "Enter a valid Email").isEmail(),
        query("password", "Enter a valid Password").isLength({ min: 5 }),
        query("age", "Enter a valid Age").isInt({ min: 18 }),
    ],
    async (req, res) => {
        console.log(req.body);
        const error = validationResult(req);

        if (!error.isEmpty()) {
            console.log("Here")
            res.send({ error, errors: error.array() });
            return;
        }


        // Check if user with the same email already exists
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Sorry User with the email already exists" });
            }

            // Hasing the passowrd using bcrypt for security
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            // Create a new user 
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                passowrd: secPass,
                age: req.body.age
            });

            // Generating Json token
            const data = {
                user: {
                    id: user.id,
                },
            };
            
            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({ authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error Occured");
        }
    }

);


module.exports = router;