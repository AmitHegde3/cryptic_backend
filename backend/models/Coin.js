const mongoose = require("mongoose");
const { Schema } = mongoose;


// TODO
const coinSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required:true,
  }
});

module.exports = mongoose.model("coins", coinSchema);
