import React, { useEffect, useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'

export const CanvasMain = () => {
  //   const [isDrawing, setIsDrawing] = useState(false)

  //   const canvasRef = useRef(null)
  //   const contextRef = useRef(null)

  //   useEffect(() => {
  //     const canvas = canvasRef.current

  //     canvas.width = window.innerWidth
  //     console.log('canvas.width', canvas.width)
  //     canvas.height = window.innerHeight
  //     canvas.style.width = `${window.innerWidth / 2}px`
  //     canvas.style.height = `${window.innerHeight / 2}px`
  //     canvas.style.backgroundColor = 'black'

  //     const context = canvas.getContext('2d')
  //     // context.scale(0.5, 0.5)
  //     context.lineCap = 'round'
  //     context.strokeStyle = 'red'
  //     context.lineWidth = 2

  //     contextRef.current = context
  //   }, [])

  //   const startDrawing = ({ nativeEvent }) => {
  //     const { offsetX, offsetY } = nativeEvent
  //     contextRef.current.beginPath()
  //     contextRef.current.moveTo(offsetX, offsetY)
  //     setIsDrawing(true)
  //   }

  //   const finishDrawing = () => {
  //     setIsDrawing(false)
  //     contextRef.current.closePath()
  //   }

  //   const draw = ({ nativeEvent }) => {
  //     if (!isDrawing) return
  //     const { offsetX, offsetY } = nativeEvent
  //     contextRef.current.lineTo(offsetX, offsetY)
  //     contextRef.current.stroke()
  //   }

  //   return (
  //     <canvas
  //       onMouseDown={startDrawing}
  //       onMouseUp={finishDrawing}
  //       onMouseMove={draw}
  //       ref={canvasRef}
  //     />
  //   )
  return <CanvasDraw brushColor={'black'} canvasWidth={'50rem'} />
}
