import React from 'react'
import { CanvasMain } from '../components/canvas/CanvasMain'
import { TestChat } from '../components/canvas/TestChat'

export const RoomPage = () => {
  return (
    <div>
      <h1>Game Page</h1>
      <CanvasMain />
      <TestChat />
    </div>
  )
}
