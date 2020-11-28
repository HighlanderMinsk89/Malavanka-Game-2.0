import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { EditDrawTools } from './EditDrawTools'

export const CanvasMain = ({ socket, yourTurn }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [colorSelected, setColorSelected] = useState('red')
  const [lineSelected, setLineSelected] = useState(4)
  const { roomid } = useParams()

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const socketRef = useRef(socket)

  const changeColor = (color) => {
    contextRef.current.strokeStyle = color
  }

  const changeLineWeight = (weight) => {
    contextRef.current.lineWidth = weight
  }

  const clearCanvas = useCallback(
    (withEmit) => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
      if (withEmit) socket.emit('clearCanvas', { roomid })
    },
    [socket, roomid]
  )

  useEffect(() => {
    socketRef.current.on('clearCanvasBeforeGame', () => {
      clearCanvas(true)
      socket.emit('colorChange', { newColor: 'red', roomid })
      socket.emit('lineChange', { newLine: 4, roomid })
    })
  }, [clearCanvas, roomid, socket])

  useEffect(() => {
    socketRef.current.on('startDrawingCli', ({ offsetX, offsetY }) => {
      contextRef.current.beginPath()
      contextRef.current.moveTo(offsetX * 2, offsetY * 2)
      setIsDrawing(true)
    })

    socketRef.current.on('finishDrawingCli', () => {
      setIsDrawing(false)
      contextRef.current.closePath()
    })

    socketRef.current.on('drawCli', ({ offsetX, offsetY }) => {
      contextRef.current.lineTo(offsetX * 2, offsetY * 2)
      contextRef.current.stroke()
    })

    socketRef.current.on('clearCanvasCli', () => {
      clearCanvas(false)
    })

    socketRef.current.on('colorChangeCli', ({ newColor }) => {
      changeColor(newColor)
      setColorSelected(newColor)
    })

    socketRef.current.on('lineChangeCli', ({ newLine }) => {
      changeLineWeight(newLine)
      setLineSelected(newLine)
    })
  })

  useEffect(() => {
    const canvas = canvasRef.current

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.width = `${window.innerWidth / 2}px`
    canvas.style.height = `${window.innerHeight / 2}px`
    canvas.style.backgroundColor = 'black'

    const context = canvas.getContext('2d')
    // context.scale(1.5, 1.5)
    context.lineCap = 'round'
    context.strokeStyle = colorSelected
    context.lineWidth = lineSelected

    contextRef.current = context
  }, [])

  const startDrawing = (e) => {
    if (yourTurn) {
      const { offsetX, offsetY } = e.nativeEvent
      contextRef.current.beginPath()
      contextRef.current.moveTo(offsetX * 2, offsetY * 2)
      setIsDrawing(true)

      socket.emit('startDrawing', {
        roomid,
        offsetX,
        offsetY,
      })
    }
  }

  const finishDrawing = () => {
    if (yourTurn) {
      setIsDrawing(false)
      contextRef.current.closePath()

      socket.emit('finishDrawing', { roomid })
    }
  }

  const draw = (e) => {
    if (!isDrawing || !yourTurn) return
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.lineTo(offsetX * 2, offsetY * 2)
    contextRef.current.stroke()

    socket.emit('draw', { offsetX, offsetY, roomid })
  }

  const onResize = () => {
    //TODO:
  }

  return (
    <div className='canvas-cont' {...onResize}>
      <EditDrawTools
        changeColor={changeColor}
        changeLineWeight={changeLineWeight}
        clearCanvas={clearCanvas}
        socket={socket}
        roomid={roomid}
        setLineSelected={setLineSelected}
        setColorSelected={setColorSelected}
        lineSelected={lineSelected}
        colorSelected={colorSelected}
        yourTurn={yourTurn}
      />
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  )
}
