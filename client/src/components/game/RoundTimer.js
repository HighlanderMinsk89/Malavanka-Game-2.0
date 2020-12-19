import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components/macro'
import { GameContext } from '../../context/gameContext'

const ProgressBar = styled.div`
  height: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.darkBlue};
`

const ProgressInner = styled.div`
  height: 100%;
  width: ${(props) => props.completed};
  background-color: ${(props) => props.theme.brightRed};
`

export const RoundTimer = () => {
  const { socket, gameState } = useContext(GameContext)
  const roundTimer = gameState.roundTimer
  const [timer, setTimer] = useState(roundTimer)

  useEffect(() => {
    socket.on('drawingTimer', (seconds) => {
      setTimer(seconds)
    })
    return () => {
      socket.removeAllListeners('drawingTimer')
    }
  }, [socket])

  return (
    <ProgressBar>
      <ProgressInner completed={`${(timer / 70) * 100}%`} />
    </ProgressBar>
  )
}
