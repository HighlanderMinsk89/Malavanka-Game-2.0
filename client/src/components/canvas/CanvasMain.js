import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CanvasComponent } from './CanvasComponent'
import { EditDrawTools } from './EditDrawTools'
import { CanvasContext } from '../../context/canvasContext'
import ReactResizeDetector from 'react-resize-detector'
import { RoundTimer } from '../game/RoundTimer'
import { WhoIsPickingWordMessage } from '../game/game_info/GameInfo'

export const CanvasMain = ({
  socket,
  yourTurn,
  isPlaying,
  word,
  isRoundFinished,
  activeUserName,
}) => {
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
          <EditDrawTools socket={socket} clearCanvas={clearCanvasWithButton} />
        ) : null}

        <ReactResizeDetector
          handleWidth
          handleHeight
          targetRef={sizeWrapper}
          skipOnMount={true}
          refreshMode='throttle'
          refreshRate={10}
        >
          {({ width, height }) => (
            <div className='canvas-cont-wrapper' ref={sizeWrapper}>
              <div className='canvas-cont'>
                {isPlaying && word ? (
                  <div className='canvas-cont-info'>
                    <RoundTimer />
                  </div>
                ) : null}

                {isPlaying && !word && !isRoundFinished && !yourTurn ? (
                  <WhoIsPickingWordMessage className='blink-me'>
                    <p>
                      <em>{activeUserName}</em> выбірае, што будзе маляваць...
                    </p>
                  </WhoIsPickingWordMessage>
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
