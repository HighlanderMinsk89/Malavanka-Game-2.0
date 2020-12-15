import React, { useState, useEffect } from 'react'

import { CanvasMain } from '../../components/canvas/CanvasMain'
import { Chat } from '../chat/Chat'
import { GameContext } from '../../context/gameContext'
import { RoomUsers } from '../canvas/RoomUsers'
import { GameResultsModal } from './GameResultsModal'
import { RoundResultsModal } from './RoundResultsModal'
import { SelectWordModal } from './SelectWordModal'
import { GameInfo } from './game_info/GameInfo'
import { nameShortener } from '../../utils'

export const GameMain = ({ socket, roomid }) => {
  const [gameState, setGameState] = useState({})
  const [yourTurn, setYourTurn] = useState(false)

  let activeUserName
  if (gameState.activeUser)
    activeUserName = nameShortener(
      Object.values(gameState.activeUser)[0].userName
    )

  useEffect(() => {
    const callback = (newState) => {
      setGameState(newState)
      if (newState.activeUser) {
        let turn = socket.id === Object.keys(newState.activeUser)[0]
        setYourTurn(turn)
      }
    }
    console.log('gameState.isPlaying', gameState.isPlaying)
    console.log('gameState.roundFinished', gameState.roundFinished)
    socket.on('gameStateUpdate', callback)

    const socketCopy = socket
    return () => {
      socketCopy.removeListener('gameStateUpdate')
    }
  })

  return (
    <GameContext.Provider value={{ socket, roomid, yourTurn, gameState }}>
      <div className='game-room-c'>
        <GameInfo gameState={gameState} yourTurn={yourTurn} />
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
              isRoundFinished={gameState.roundFinished}
              activeUserName={activeUserName}
            />
            <Chat />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  )
}
