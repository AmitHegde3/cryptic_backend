const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Importing the User model
const { body, validationResult } = require("express-validator"); // Importing validation utilities
const bcrypt = require("bcryptjs"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing JWT for token generation
const fetchuser = require("../middleware/fetchuser")// Importing middleware for fetching user

const JWT_SECRET = "This is a test";
// const JWT_SECRET = process.env.JWT_KEY; 

// console.log("Secret toke is:",JWT_SECRET) 
router.use(express.json()); 

// Router 1: Create a User using : POST "/api/auth/createUser". Doesnt require auth...Create authToken

router.post("/createUser",
    [
        // Validation checks for name, email, and password
        body("name", "Enter a valid Name").isLength({ min: 3 }),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Enter a valid Password").isLength({ min: 5 }),
        body("age", "Enter a valid Age").isInt({ min: 18 }),
    ],
    async (req, res) => {
        // console.log(req.body); 
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
            res.status(400).send({ error, errors: error.array() });
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
                password: secPass,
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

// Router 2: Login for a user. POST "/api/auth/login"

router.post("/login", [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be Blank").exists(),
],
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            res.send({ errors: error.array() });
            return; // Return from the function
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Please try to login with correct credentials" });
            }

            const passCompare = await bcrypt.compare(password, user.password);
            if (!passCompare) {
                return res
                    .status(400)
                    .json({ success, error: "Please try to login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({ authToken });

        }
        
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error!");
        }
        
    }

);


// Router 3: Get logged in user details: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser,
    async (req, res) => {
        // Fetching user details from the request object(which is added by the fetch user middleware)
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");

            res.send(user);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error!");
        }
    }
)



module.exports = router;