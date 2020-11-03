import React from 'react'
import { CanvasMain } from '../components/canvas/CanvasMain'
import { Chat } from '../components/canvas/Chat'

export const RoomPage = () => {
  return (
    <div>
      <h1>Game Page</h1>
      <div className='room-cont'>
        <CanvasMain />
        <Chat />
      </div>
    </div>
  )
}
