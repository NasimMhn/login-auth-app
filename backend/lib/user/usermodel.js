import mongoose from 'mongoose'
import crypto from 'crypto'

const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true

  },
  password: {
    type: String,
    required: true

  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
})


module.exports = User
