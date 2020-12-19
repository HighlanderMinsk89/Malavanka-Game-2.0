import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { AuthContext } from '../context/authContext'

const LandingPage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const HomePage = () => {
  const history = useHistory()
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <LandingPage>
      <h1>Вас вітае Маляванка!</h1>
      <h2>....................</h2>
      <button
        className='btn btn-large red'
        onClick={() =>
          history.push(`${isAuthenticated ? '/selectroom' : '/auth'}`)
        }
      >
        Гуляць
      </button>
    </LandingPage>
  )
}
