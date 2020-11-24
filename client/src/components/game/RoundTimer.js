import React, { useState, useEffect, useRef } from 'react'

export const RoundTimer = ({ roomid, socket, yourTurn }) => {
  const [timer, setTimer] = useState()

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
    <div>
      <h4>{timer} till next player</h4>
    </div>
  )
}
