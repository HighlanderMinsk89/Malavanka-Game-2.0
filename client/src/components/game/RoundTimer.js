import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { GameContext } from '../../context/gameContext'

const ProgressBar = styled.div`
  height: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.darkBlue};
  box-shadow: ${(props) => props.theme.bigShadow};
`

const ProgressInner = styled.div`
  height: 100%;
  width: ${(props) => props.completed};
  background-color: ${(props) => props.theme.brightRed};
  transition: width 2s ease-in-out;
`

export const RoundTimer = () => {
  const [timer, setTimer] = useState(30)
  const { roomid, socket, yourTurn } = useContext(GameContext)

  let interval = useRef()
  useEffect(() => {
    if (yourTurn) {
      interval.current = setInterval(() => {
        if (timer === 0) {
          socket.emit('drawFinishedNextPlayer', roomid)
        } else {
          socket.emit('roundTimer', { roomid })
        }
      }, 1000)
    }
    return () => clearInterval(interval.current)
  }, [timer, socket, roomid, yourTurn])

  useEffect(() => {
    const socketCopy = socket
    const listener = (seconds) => {
      setTimer(seconds)
    }
    socket.on('roundTimerUpdate', listener)
    return () => {
      socketCopy.removeListener('roundTimeUpdate', listener)
    }
  }, [socket, setTimer])

  return (
    <ProgressBar>
      <ProgressInner completed={`${(timer / 30) * 100}%`} />
    </ProgressBar>
  )
}
