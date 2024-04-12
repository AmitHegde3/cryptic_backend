const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Coin = require("../models/Coin");
const { body, validationResult } = require("express-validator");


// Route 1: Get all the Coins using : GET "/api/coins/fetchallcoins" . Login required

router.get("/fetchallcoins", fetchuser,
    async (req, res) => {
        try {
            const coins = await Coin.find({ user: req.user.id })
            res.json(coins)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error!");
        }
    }
);


// Route 2: Buying a new Coin using : POST "/api/coins/buycoin" . Login required
router.post(
    "/buycoins",
    fetchuser,
    [
      body("title", "Enter a valid Title").isLength({ min: 3 }),
      body("price", "Enter a valid Price").isInt(),
    ],
    async (req, res) => {
      try {
        const { title, description, price } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
          res.send({ errors: error.array() });
          return; //This was the cause of error
        }
  
        const coin = new Coin({
          title,
          description,
          price,
          user: req.user.id,
        });
  
        const saveCoin = await coin.save();
        res.json(saveCoin);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
      }
    }
  );

// Route 3: Purchasing more Coins : PUT "/api/notes/updatecoin" . Login required
router.put("/updatecoin/:id", fetchuser, async (req, res) => {
    try {
      const { title, description, price } = req.body;
      // Create a new Note object
      const newCoin = {};
      if (title) {
        newCoin.title = title;
      }
      if (description) {
        newCoin.description = description;
      }
      if (price) {
        newCoin.price = price;
      }
  
      // Find the Coin to be Purchased and purchase it
      let coin = await Coin.findById(req.params.id);
      if (!coin) {
        return res.status(404).send("Not Found");
      }
      if (coin.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }
  
      coin = await Coin.findByIdAndUpdate(
        req.params.id,
        { $set: newCoin },
        { new: true }
      );
      res.json({ coin });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!");
    }
  });
  
// Route 4: Sell an existing Coin using : DELETE "/api/coins/sellcoin" . Login required
router.delete("/sellcoin/:id", fetchuser, async (req, res) => {
  try {
    // const { title, price } = req.body;
   
    // Find the note to be deleted and delete it
    let coin = await Coin.findById(req.params.id);
    if (!coin) {
      return res.status(404).send("Not Found");
    }
    // Allow deletion only if user owns this Coin
    if (coin.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    coin = await Coin.findByIdAndDelete(req.params.id);
    res.json({ Success: "Coin has been Sold", coin: coin });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;