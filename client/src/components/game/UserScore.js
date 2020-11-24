import React, { useEffect, useState } from 'react'

export const UserScore = ({ socket, roomid, users }) => {
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (users) {
      const user = users.filter((user) => Object.keys(user)[0] === socket.id)[0]
      setScore(Object.values(user)[0].points)
    }
  }, [socket.id, users])

  return (
    <div>
      <h4>SCORE: {score}</h4>
    </div>
  )
}
