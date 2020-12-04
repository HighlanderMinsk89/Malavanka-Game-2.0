import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import { CanvasContext } from '../../context/canvasContext'

export const CanvasComponent = ({
  socket,
  yourTurn,
  contWidth,
  contHeight,
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const {
    setColorSelected,
    setLineSelected,
    colorSelected,
    lineSelected,
    roomid,
    clear,
    setClear,
  } = useContext(CanvasContext)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const socketRef = useRef(socket)

  useEffect(() => {
    console.log('width', contWidth)
    console.log('height', contHeight)
    if (canvasRef.current) {
      canvasRef.current.style.width = contWidth
      canvasRef.current.style.height = contHeight
    }
  }, [contWidth, contHeight])

  useEffect(() => {
    socketRef.current.on('startDrawingCli', ({ offsetX, offsetY }) => {
      contextRef.current.beginPath()
      contextRef.current.moveTo(
        offsetX * 2 * canvasRef.current.width,
        offsetY * 2 * canvasRef.current.height
      )
      setIsDrawing(true)
    })

    socketRef.current.on('finishDrawingCli', () => {
      setIsDrawing(false)
      contextRef.current.closePath()
    })

    socketRef.current.on('drawCli', ({ offsetX, offsetY }) => {
      contextRef.current.lineTo(
        offsetX * 2 * canvasRef.current.width,
        offsetY * 2 * canvasRef.current.height
      )
      contextRef.current.stroke()
    })

    socketRef.current.on('clearCanvasCli', () => {
      clearCanvas(false)
    })

    socketRef.current.on('colorChangeCli', ({ newColor }) => {
      setColorSelected(newColor)
    })

    socketRef.current.on('lineChangeCli', ({ newLine }) => {
      setLineSelected(newLine)
    })
  })

  const setCanvasDimensions = useCallback((image, prevW, prevH) => {
    const canvas = canvasRef.current
    const containerHeight = contHeight
    const containerWidth = contWidth
    console.log('contHeight', containerHeight)
    console.log('contWidth', containerWidth)

    if (contHeight < contWidth * 0.7) {
    }

    contextRef.current.lineCap = 'round'

    if (image) {
      image.onload = () => {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
        contextRef.current.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          (canvas.width * canvas.width) / prevW,
          (canvas.height * canvas.height) / prevH
        )
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    setCanvasDimensions()
  }, [setCanvasDimensions])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = colorSelected
      contextRef.current.lineWidth = lineSelected
    }
  }, [colorSelected, lineSelected])

  //   useEffect(() => {
  //     const onResize = () => {
  //       const image = new Image()
  //       image.src = canvasRef.current.toDataURL()

  //       setCanvasDimensions(
  //         image,
  //         canvasRef.current.width,
  //         canvasRef.current.height
  //       )
  //       contextRef.current.strokeStyle = colorSelected
  //       contextRef.current.lineWidth = lineSelected
  //     }
  //     window.addEventListener('resize', onResize)
  //     return () => window.removeEventListener('resize', onResize)
  //   }, [setCanvasDimensions, colorSelected, lineSelected])

  const startDrawing = (e) => {
    if (yourTurn) {
      const { offsetX, offsetY } = e.nativeEvent
      contextRef.current.beginPath()
      contextRef.current.moveTo(offsetX * 2, offsetY * 2)
      setIsDrawing(true)

      socket.emit('startDrawing', {
        roomid,
        offsetX: offsetX / canvasRef.current.width,
        offsetY: offsetY / canvasRef.current.height,
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

    socket.emit('draw', {
      offsetX: offsetX / canvasRef.current.width,
      offsetY: offsetY / canvasRef.current.height,
      roomid,
    })
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
    socket.on('clearCanvasBeforeGame', () => {
      clearCanvas(true)
      socket.emit('colorChange', { newColor: 'red', roomid })
      socket.emit('lineChange', { newLine: 4, roomid })
    })
  }, [clearCanvas, roomid, socket])

  useEffect(() => {
    if (clear) {
      clearCanvas(true)
      setClear(false)
    }
  }, [clear, setClear, clearCanvas])

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  )
}
