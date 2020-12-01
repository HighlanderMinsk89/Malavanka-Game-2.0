import { createContext } from 'react'

function noop() {}

export const CanvasContext = createContext({
  clearCanvas: noop,
  lineSelected: null,
  colorSelected: null,
  roomid: null,
  setLineSelected: noop,
  setColorSelected: noop,
})
