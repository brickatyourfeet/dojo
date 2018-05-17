const express = require('express')
const mongoose = require('mongoose')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

//configure database
const db = require('./config/keys').mongoURI

//connect to mongo
mongoose
  .connect(db)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('express express express'))

//use routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server running on port ${PORT} ... BOOYAH!`))
