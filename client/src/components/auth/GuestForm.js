import React, { useContext, useState } from 'react'
import randomCryptoId from 'crypto-random-string'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useMessage } from '../../hooks/message.hook'
import styled from 'styled-components/macro'

export const AuthFormWrapper = styled.div`
  padding: 0.2em 1em;
  width: 100%;

  & button {
    margin-bottom: 0.5em;
  }
`

export const GuestForm = () => {
  const { login } = useContext(AuthContext)
  const message = useMessage()
  const history = useHistory()
  const [form, setForm] = useState({
    name: '',
    location: '',
  })

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleGuestLogin = () => {
    if (!form.name.length) message('Увядзіце сваё імя')
    else {
      login(
        null,
        null,
        form.name,
        form.location,
        randomCryptoId({ length: 25, type: 'base64' })
      )

      history.push('/selectroom')
    }
  }

  return (
    <AuthFormWrapper>
      <div className='input-field '>
        <input
          id='nameG'
          type='text'
          name='name'
          value={form.name}
          onChange={handleChange}
        />
        <label htmlFor='nameG' className='white-text'>
          Імя *
        </label>
      </div>
      <div className='input-field'>
        <input
          id='locationG'
          type='text'
          name='location'
          value={form.location}
          onChange={handleChange}
        />
        <label htmlFor='locationG' className='white-text'>
          Адкуль Вы?
        </label>
      </div>

      <div className='btn-form'>
        <button
          className='btn white black-text waves-effect'
          onClick={handleGuestLogin}
        >
          Гуляць!
        </button>
      </div>
    </AuthFormWrapper>
  )
}
