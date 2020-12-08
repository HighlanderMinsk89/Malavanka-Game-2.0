import React, { useState, useEffect } from 'react'

import { CanvasMain } from '../../components/canvas/CanvasMain'
import { Chat } from '../chat/Chat'
import { GameContext } from '../../context/gameContext'
import { RoomUsers } from '../canvas/RoomUsers'
import { GameResultsModal } from './GameResultsModal'
import { RoundResultsModal } from './RoundResultsModal'
import { SecretWord } from './SecretWord'
import { SelectWordModal } from './SelectWordModal'

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
    <GameContext.Provider value={{ socket, roomid, yourTurn, gameState }}>
      <div className='game-room-c'>
        <div className='game-info'>
          {!gameState.isPlaying ? (
            <h5 className='blink-me'>Waiting for other users...</h5>
          ) : (
            <div className='round-word'>
              <h5>ROUND {gameState && gameState.round}</h5>
              {gameState.word ? (
                <SecretWord word={gameState.word} yourTurn={yourTurn} />
              ) : null}
            </div>
          )}
        </div>
        {yourTurn &&
        gameState.roundFinished === false &&
        gameState.gameFinished === false &&
        gameState.isPlaying ? (
          <SelectWordModal socket={socket} roomid={roomid} />
        ) : null}
        {gameState.roundFinished ? <RoundResultsModal /> : null}

        {gameState.gameFinished ? <GameResultsModal /> : null}
        <div className='draw-cont'>
          <RoomUsers />
          <div className='canvas-chat-cont'>
            <CanvasMain
              socket={socket}
              yourTurn={yourTurn}
              isPlaying={gameState.isPlaying}
              word={gameState.word}
            />
            <Chat />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  )
}
