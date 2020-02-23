import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import User from '../lib/user/usermodel.js'
import bcrypt from 'bcrypt-nodejs'
import createError from 'http-errors'

const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

/* Authenticate the user, then go to next route */
app.get('/', async (req, res, next) => {
  try {
    const authToken = req.header('Authorization')
    const user = await User.findOne({ accessToken: authToken })
    if (user) {
      next()
    } else {
      throw new createError(403, 'you are not authorized to access this') // TODO fix status code in error handling
    }
  } catch (err) {
    next(err)
  }
})

/* Main endpoint for logged in users */
app.get('/', async (req, res, next) => {
  const data = [
    'This is a secret message',
    'This is another secret message',
    `This is a third secret message, don't tell`
  ]
  res.json(data)
})

/* Admin endpoint - to be removed */
app.get('/user', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

app.post('/registration', async (req, res, next) => {
  console.log(req.body)
  try {
    let { name, email, password } = req.body
    name = name.replace(name.slice(0, 1), name.slice(0, 1).toUpperCase())
    const newUser = await new User({ name, email, password: bcrypt.hashSync(password) }).save()
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
})

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
    if (user && bcrypt.compareSync(password, user.password)) {
      user.password = undefined /* we don't want to send the password hash to the client */
      res.json(user)
    } else {
      throw new Error(`user not found or password doesn't match`)
    }
  } catch (err) {
    next(err)
  }
})

app.use((req, res) => {
  res.status(404).json({ error: `route ${req.originalUrl} doesn't exist` })
})

/* Error handling */
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message })
})

module.exports = app
