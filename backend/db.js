const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/cryptic_backend";

const connectToMongo = async () => {
    try {
        mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
    }

module.exports = connectToMongo;