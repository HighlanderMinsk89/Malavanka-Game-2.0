import { createContext } from 'react'

export const GameContext = createContext({
  socket: null,
  roomid: null,
  gameState: {},
  yourTurn: false,
})
