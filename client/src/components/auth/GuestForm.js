import React, { useContext, useState } from 'react'
import randomCryptoId from 'crypto-random-string'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useMessage } from '../../hooks/message.hook'

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
    if (!form.name.length) message('Please enter name')
    login(
      null,
      null,
      form.name,
      form.location,
      randomCryptoId({ length: 25, type: 'base64' })
    )

    history.push('/selectroom')
  }

  return (
    <div className='row auth-tile'>
      <div className='col s12 m12 card-cont'>
        <div className='card red darken-3'>
          <div className='card-content white-text'>
            <span className='card-title center'>Play as Guest</span>
          </div>
          <div className='card-action'>
            <div className='input-field '>
              <input
                id='nameG'
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
              />
              <label htmlFor='nameG' className='white-text'>
                Name *
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
                Location
              </label>
            </div>
          </div>
          <div className='btn-form'>
            <button
              className='btn white black-text waves-effect'
              onClick={handleGuestLogin}
            >
              Play!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
