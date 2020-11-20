import React, { useState, useEffect } from 'react'

import { CanvasMain } from '../../components/canvas/CanvasMain'
import { Chat } from '../../components/canvas/Chat'
import { GameResultsModal } from './GameResultsModal'
import { RoundResultsModal } from './RoundResultsModal'
import { SelectWordModal } from './SelectWordModal'

export const GameMain = ({ socket, roomid }) => {
  const [gameState, setGameState] = useState({})
  // console.log('gameState', gameState)

  let yourTurn
  if (gameState.activeUser) {
    yourTurn = socket.id === Object.keys(gameState.activeUser)[0]
  }

  console.log('gameStae.round', gameState.round)
  console.log('gameState.rouindFinished', gameState.roundFinished)
  console.log('yourTurn', yourTurn)

  const callback = (gameState) => setGameState(gameState)

  useEffect(() => {
    socket.on('gameStateUpdate', callback)

    const socketCopy = socket
    return () => {
      socketCopy.removeAllListeners()
    }
  }, [roomid, socket])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!gameState.isPlaying ? (
        <h1>Please Wait for other users to join</h1>
      ) : (
        <h1>PLAYING</h1>
      )}
      <h1>ROUND: {gameState && gameState.round}</h1>
      {yourTurn &&
      gameState.roundFinished === false &&
      gameState.gameFinished === false ? (
        <SelectWordModal socket={socket} roomid={roomid} />
      ) : null}
      {gameState.roundFinished ? (
        <RoundResultsModal
          socket={socket}
          roomid={roomid}
          yourTurn={yourTurn}
        />
      ) : null}

      {gameState.gameFinished ? (
        <GameResultsModal socket={socket} roomid={roomid} yourTurn={yourTurn} />
      ) : null}
      <div className='room-cont'>
        <CanvasMain socket={socket} />
        <Chat socket={socket} gameState={gameState} />
      </div>
    </div>
  )
}
