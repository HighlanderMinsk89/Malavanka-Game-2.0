import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CanvasComponent } from './CanvasComponent'
import { EditDrawTools } from './EditDrawTools'
import { CanvasContext } from '../../context/canvasContext'
import ReactResizeDetector from 'react-resize-detector'

export const CanvasMain = ({ socket, yourTurn }) => {
  const [colorSelected, setColorSelected] = useState('red')
  const [lineSelected, setLineSelected] = useState(4)
  const [clear, setClear] = useState(false)
  const { roomid } = useParams()

  const sizeWrapper = useRef()

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
      <div className='canvas-tools-cont'>
        {yourTurn ? (
          <EditDrawTools
            socket={socket}
            yourTurn={yourTurn}
            clearCanvas={clearCanvasWithButton}
          />
        ) : null}
        <ReactResizeDetector
          handleWidth
          handleHeight
          targetRef={sizeWrapper}
          skipOnMount={true}
          refreshMode='debounce'
          refreshRate={0}
          // refreshOptions={{ trailing: true }}
        >
          {({ width, height }) => (
            <div className='canvas-cont-wrapper' ref={sizeWrapper}>
              <div className='canvas-cont'>
                <CanvasComponent
                  socket={socket}
                  yourTurn={yourTurn}
                  contWidth={width}
                  contHeight={height}
                />
              </div>
            </div>
          )}
        </ReactResizeDetector>
      </div>
    </CanvasContext.Provider>
  )
}
