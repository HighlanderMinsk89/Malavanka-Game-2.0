import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { CanvasMain } from '../../components/canvas/CanvasMain'
import { Chat } from '../../components/canvas/Chat'
import { GameContext } from '../../context/gameContext'
import { RoomUsers } from '../canvas/RoomUsers'
import { GameResultsModal } from './GameResultsModal'
import { RoundResultsModal } from './RoundResultsModal'
import { RoundTimer } from './RoundTimer'
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
            <h5 className='blink-me' style={{ alignSelf: 'center' }}>
              Waiting for other users...
            </h5>
          ) : (
            <h5>ROUND: {gameState && gameState.round}</h5>
          )}

          {gameState.isPlaying && gameState.word ? (
            <div>
              <RoundTimer />
              <SecretWord word={gameState.word} yourTurn={yourTurn} />
            </div>
          ) : null}
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
            />
            <Chat />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  )
}
