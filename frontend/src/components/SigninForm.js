import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import { auth } from '../reducers/auth'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const url = process.env.API_URL || 'http://localhost:8080'

const handleSubmit = (event, email, password, setLoginFailed, dispatch) => {
  event.preventDefault()
  fetch(`${url}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "email": email,
      "password": password
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.json())
      }
    })
    .then(json => {
      dispatch(auth.actions.logInUser(json))

    })
    .catch(err => {
      setLoginFailed(true)
    })
}

export const SigninForm = () => {
  const dispatch = useDispatch()


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginFailed, setLoginFailed] = useState(false)

  return (
    <div className="form-container">
      <h2>Sign in</h2>
      <p>Or <button className="redirect-button" onClick={() => { dispatch(auth.actions.toggleSigninForm()) }}> create an account</button></p>
      <form onSubmit={event => handleSubmit(event, email, password, setLoginFailed, dispatch)}>
        {loginFailed &&
          <p className="failed-login">The e-mail or password can't be found. Please try again.</p>}
        <TextField className="standard-basic" label="E-mail" type="email" onChange={(event) => setEmail(event.target.value)} />
        <TextField className="standard-basic" label="Password" type="password" onChange={(event) => setPassword(event.target.value)} />
        <Button variant="contained" disableElevation type="submit">Sign in</Button>
      </form>
    </div>
  )
}