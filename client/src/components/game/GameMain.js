import React, { useState, useEffect } from 'react'

import { CanvasMain } from '../../components/canvas/CanvasMain'
import { Chat } from '../../components/canvas/Chat'
import { GameResultsModal } from './GameResultsModal'
import { RoundResultsModal } from './RoundResultsModal'
import { RoundTimer } from './RoundTimer'
import { SecretWord } from './SecretWord'
import { SelectWordModal } from './SelectWordModal'
import { UserScore } from './UserScore'

export const GameMain = ({ socket, roomid }) => {
  const [gameState, setGameState] = useState({})
  const [yourTurn, setYourTurn] = useState(false)

  useEffect(() => {
    const callback = (newState) => {
      setGameState(newState)
      if (newState.activeUser) {
        let turn = socket.id === Object.keys(newState.activeUser)[0]
        setYourTurn(turn)
      }
    }
    socket.on('gameStateUpdate', callback)

    const socketCopy = socket
    return () => {
      socketCopy.removeListener('gameStateUpdate')
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!gameState.isPlaying ? (
        <h1>Please Wait for other users to join</h1>
      ) : (
        <h1>PLAYING</h1>
      )}
      <h1>ROUND: {gameState && gameState.round}</h1>
      {yourTurn ? <h1 style={{ color: 'greenyellow' }}>YOUR TURN</h1> : null}

      {gameState.isPlaying ? (
        <UserScore roomid={roomid} socket={socket} users={gameState.users} />
      ) : null}

      {gameState.isPlaying && gameState.word ? (
        <div>
          <RoundTimer socket={socket} roomid={roomid} yourTurn={yourTurn} />
          <SecretWord word={gameState.word} yourTurn={yourTurn} />
        </div>
      ) : null}
      {yourTurn &&
      gameState.roundFinished === false &&
      gameState.gameFinished === false &&
      gameState.isPlaying ? (
        <SelectWordModal socket={socket} roomid={roomid} />
      ) : null}
      {gameState.roundFinished ? (
        <RoundResultsModal
          socket={socket}
          roomid={roomid}
          yourTurn={yourTurn}
          round={gameState.round}
        />
      ) : null}

      {gameState.gameFinished ? (
        <GameResultsModal socket={socket} roomid={roomid} yourTurn={yourTurn} />
      ) : null}
      <div className='room-cont'>
        <CanvasMain
          socket={socket}
          yourTurn={yourTurn}
          isPlaying={gameState.isPlaying}
        />
        <Chat socket={socket} gameState={gameState} />
      </div>
    </div>
  )
}
