import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

export const HomePage = () => {
  const history = useHistory()
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <div>
      <h1>Вас вітае Маляванка!</h1>
      <button
        className='btn btn-large red'
        onClick={() =>
          history.push(`${isAuthenticated ? '/selectroom' : '/auth'}`)
        }
      >
        Гуляць
      </button>
    </div>
  )
}
