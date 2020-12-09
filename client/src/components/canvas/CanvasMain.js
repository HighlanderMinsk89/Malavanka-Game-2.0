import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CanvasComponent } from './CanvasComponent'
import { EditDrawTools } from './EditDrawTools'
import { CanvasContext } from '../../context/canvasContext'
import ReactResizeDetector from 'react-resize-detector'
import { RoundTimer } from '../game/RoundTimer'

export const CanvasMain = ({ socket, yourTurn, isPlaying, word }) => {
  const [colorSelected, setColorSelected] = useState('#d90429')
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
        {/* {isPlaying && word ? <RoundTimer /> : null} */}
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
                {isPlaying && word ? (
                  <div className='canvas-cont-info'>
                    <RoundTimer />
                  </div>
                ) : null}

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
