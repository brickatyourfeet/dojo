const express = require('express')
const mongoose = require('mongoose')

const app = express()

//configure database
const db = require('./config/keys').mongoURI

//connect to mongo
mongoose
  .connect(db)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('express express express'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server running on port ${PORT} ... BOOYAH!`))