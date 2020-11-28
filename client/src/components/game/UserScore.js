import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from '../../context/gameContext'

export const UserScore = () => {
  const [score, setScore] = useState(0)
  const { socket, gameState } = useContext(GameContext)

  useEffect(() => {
    if (gameState.users) {
      const user = gameState.users.filter(
        (user) => Object.keys(user)[0] === socket.id
      )[0]
      setScore(Object.values(user)[0].points)
    }
  }, [gameState.users, socket.id])

  return (
    <div>
      <h4>SCORE: {score}</h4>
    </div>
  )
}
