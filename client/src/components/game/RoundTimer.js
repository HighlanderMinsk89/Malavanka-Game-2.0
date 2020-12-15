import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { GameContext } from '../../context/gameContext'

const ProgressBar = styled.div`
  height: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.darkBlue};
  /* box-shadow: ${(props) => props.theme.bigShadow}; */
`

const ProgressInner = styled.div`
  height: 100%;
  width: ${(props) => props.completed};
  background-color: ${(props) => props.theme.brightRed};
  /* transition: width 2s ease-in-out; */
`

export const RoundTimer = () => {
  const { roomid, socket, yourTurn, gameState } = useContext(GameContext)
  const roundTimer = gameState.roundTimer
  const secretWord = gameState.word?.word
  const [timer, setTimer] = useState(roundTimer)

  // let interval = useRef()
  // useEffect(() => {
  //   if (yourTurn) {
  //     interval.current = setInterval(() => {
  //       if (timer === 0) {
  //         const body = {
  //           roomid,
  //           userName: 'Malavanka',
  //           message: `Вы адгадвалі слова "${secretWord}"`,
  //         }
  //         socket.emit('send message', body)
  //         socket.emit('drawFinishedNextPlayer', roomid)
  //       } else {
  //         socket.emit('roundTimer', { roomid })
  //       }
  //     }, 1000)
  //   }
  //   return () => clearInterval(interval.current)
  // }, [timer, socket, roomid, yourTurn, secretWord])

  useEffect(() => {
    // const socketCopy = socket
    socket.on('drawingTimer', (seconds) => {
      setTimer(seconds)
    })
    return () => {
      socket.removeAllListeners('drawingTimer')
    }
  }, [socket])

  // useEffect(() => {
  //   setTimer(roundTimer)
  // }, [roundTimer])

  return (
    <ProgressBar>
      <ProgressInner completed={`${(timer / 30) * 100}%`} />
    </ProgressBar>
  )
}
