import React, { useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'

const defaultFormState = { email: '', password: '', name: '', location: '' }

export const RegisterForm = () => {
  const { request, loading, error, clearError } = useHttp()
  const message = useMessage()
  const [form, setForm] = useState(defaultFormState)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleRegister = async () => {
    const data = await request('/api/auth/register', 'post', { ...form })
    if (data) {
      message('Success! Please login now', 'success')
    }
  }

  useEffect(() => {
    message(error)
    clearError()
  }, [message, error, clearError])

  return (
    <div className='row auth-tile'>
      <div className='col s12 m12 card-cont'>
        <div className='card red darken-3'>
          <div className='card-content white-text'>
            <span className='card-title center'>Register</span>
          </div>
          <div className='card-action'>
            <div className='input-field '>
              <input
                id='emailR'
                type='text'
                name='email'
                value={form.email}
                onChange={handleChange}
              />
              <label htmlFor='emailR' className='white-text'>
                Email *
              </label>
            </div>
            <div className='input-field'>
              <input
                id='passwordR'
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
              />
              <label htmlFor='passwordR' className='white-text'>
                Password *
              </label>
            </div>
            <div className='input-field'>
              <input
                id='nameR'
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
              />
              <label htmlFor='nameR' className='white-text'>
                Name *
              </label>
            </div>
            <div className='input-field'>
              <input
                id='locationR'
                type='text'
                name='location'
                value={form.location}
                onChange={handleChange}
              />
              <label htmlFor='locationR' className='white-text'>
                Location
              </label>
            </div>
          </div>
          <div className='btn-form'>
            <button
              className='btn white black-text waves-effect'
              onClick={handleRegister}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
