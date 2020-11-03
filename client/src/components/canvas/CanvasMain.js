import React, { useState, useRef, useEffect } from 'react'
import { EditDrawTools } from './EditDrawTools'

export const CanvasMain = () => {
  const [isDrawing, setIsDrawing] = useState(false)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const changeColor = (color) => {
    contextRef.current.strokeStyle = color
  }

  const changeLineWeight = (weight) => {
    contextRef.current.lineWidth = weight
  }

  const clearCanvas = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.width = `${window.innerWidth / 2}px`
    canvas.style.height = `${window.innerHeight / 2}px`
    canvas.style.backgroundColor = 'black'

    const context = canvas.getContext('2d')
    // context.scale(1, 1)
    context.lineCap = 'round'
    context.strokeStyle = 'red'
    context.lineWidth = 4

    contextRef.current = context
  }, [])

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX * 2, offsetY * 2)
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    setIsDrawing(false)
    contextRef.current.closePath()
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.lineTo(offsetX * 2, offsetY * 2)
    contextRef.current.stroke()
  }

  return (
    <div className='canvas-cont'>
      <EditDrawTools
        width={`${window.innerWidth / 2}px`}
        changeColor={changeColor}
        changeLineWeight={changeLineWeight}
        clearCanvas={clearCanvas}
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
