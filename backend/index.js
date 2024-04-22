const express = require('express')

const connectToMongo = require("./db")

var cors = require('cors')
const app = express()
const port = 5000

connectToMongo();
app.use(express.json());
app.use(cors());

// Avilable routes
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/coins', require('./routes/coins.js'))

app.listen(port, () => {
    console.log(`Echo Vault backend listening at http://localhost:${port}`)
})
  