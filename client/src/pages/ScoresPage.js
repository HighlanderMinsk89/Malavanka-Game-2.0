import React, { useContext } from 'react'
import { ButtonStyled } from '../components/shared/Button'
import styled from 'styled-components'
import { SocketContext } from '../context/socketContext'
import { SelectWordModal } from '../components/game/SelectWordModal'

export const ScoresPage = () => {
  const roomid = '5fd289ec57f85e32342e4cbe'
  const { socket } = useContext(SocketContext)

  return (
    <div>
      <h1>Scores Page</h1>
      <p>
        LOH выбірае, <br /> што будзе маляваць...
      </p>
    </div>
  )
}
