import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CanvasComponent } from './CanvasComponent'
import { EditDrawTools } from './EditDrawTools'
import { CanvasContext } from '../../context/canvasContext'

export const CanvasMain = ({ socket, yourTurn }) => {
  const [colorSelected, setColorSelected] = useState('red')
  const [lineSelected, setLineSelected] = useState(4)
  const [clear, setClear] = useState(false)
  const { roomid } = useParams()

  const clearCanvasWithButton = () => {
    setClear(true)
  }

  return (
    <CanvasContext.Provider
      value={{
        colorSelected,
        lineSelected,
        clear,
        setClear,
        roomid,
        setLineSelected,
        setColorSelected,
      }}
    >
      <div className='canvas-cont'>
        {yourTurn ? (
          <EditDrawTools
            socket={socket}
            yourTurn={yourTurn}
            clearCanvas={clearCanvasWithButton}
          />
        ) : null}

        <CanvasComponent socket={socket} yourTurn={yourTurn} />
      </div>
    </CanvasContext.Provider>
  )
}
