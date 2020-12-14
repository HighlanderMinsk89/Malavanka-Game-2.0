import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import { CanvasContext } from '../../context/canvasContext'
import RedrawStack from './redrawStack'

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

  const redrawStack = useRef(new RedrawStack())

  // *listen for active user drawings
  useEffect(() => {
    socketRef.current.on('startDrawingCli', ({ offsetX, offsetY }) => {
      setIsDrawing(true)
      contextRef.current.lineCap = 'round'
      contextRef.current.beginPath()
      contextRef.current.moveTo(
        offsetX * 2 * canvasRef.current.width,
        offsetY * 2 * canvasRef.current.height
      )
      contextRef.current.lineTo(
        offsetX * 2 * canvasRef.current.width,
        offsetY * 2 * canvasRef.current.height
      )
      contextRef.current.stroke()
    })

    socketRef.current.on('finishDrawingCli', (stack) => {
      setIsDrawing(false)
      contextRef.current.closePath()
      redrawStack.current.setStack(JSON.parse(stack))
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

  // *reassign canvas coordinates and redraw if needed
  useEffect(() => {
    let newCanvasStyleWidth
    let newCanvasStyleHeight
    if (canvasRef.current && contWidth) {
      if (contHeight < contWidth * 0.7 && contHeight) {
        newCanvasStyleHeight = contHeight
        newCanvasStyleWidth = contHeight / 0.7
      } else if (contHeight === 0) {
        newCanvasStyleWidth = contWidth
        newCanvasStyleHeight = contWidth * 0.7
      }

      canvasRef.current.style.width = newCanvasStyleWidth + 'px'
      canvasRef.current.style.height = newCanvasStyleHeight + 'px'
      canvasRef.current.width = newCanvasStyleWidth * 2
      canvasRef.current.height = newCanvasStyleHeight * 2

      const context = canvasRef.current.getContext('2d')
      context.strokeStyle = colorSelected
      context.lineWidth = lineSelected
      context.lineCap = 'round'
      if (redrawStack.current?.getStack().length) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
      }

      contextRef.current = context

      if (redrawStack.current.getStack().length)
        recreateDrawing(redrawStack.current.getStack())
    }
  }, [contWidth, contHeight])

  const setInitialCanvasSize = (canvas) => {
    const wrapper = document.getElementsByClassName('canvas-cont-wrapper')[0]
    const width = window
      .getComputedStyle(wrapper, null)
      .getPropertyValue('width')
    const height = +width.slice(0, -2) * 0.7 + 'px'

    canvas.style.width = width
    canvas.style.height = height
    canvas.width = +width.slice(0, -2) * 2
    canvas.height = +height.slice(0, -2) * 2
  }

  useEffect(() => {
    const canvas = canvasRef.current
    setInitialCanvasSize(canvas)
    contextRef.current = canvas.getContext('2d')
  }, [])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = colorSelected
      contextRef.current.lineWidth = lineSelected
    }
  }, [colorSelected, lineSelected])

  const startDrawing = (e) => {
    if (yourTurn) {
      const { offsetX, offsetY } = e.nativeEvent
      setIsDrawing(true)
      contextRef.current.beginPath()
      contextRef.current.moveTo(offsetX * 2, offsetY * 2)
      contextRef.current.lineTo(offsetX * 2, offsetY * 2)
      contextRef.current.stroke()

      redrawStack.current &&
        redrawStack.current.addLine(
          offsetX,
          offsetY,
          canvasRef.current.width,
          canvasRef.current.height,
          colorSelected,
          lineSelected
        )

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

      socket.emit('finishDrawing', {
        roomid,
        stack: JSON.stringify(redrawStack.current.getStack()),
      })
    }
  }

  const draw = (e) => {
    if (!isDrawing || !yourTurn) return
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.lineTo(offsetX * 2, offsetY * 2)
    contextRef.current.stroke()

    redrawStack.current && redrawStack.current.trackPath(offsetX, offsetY)

    socket.emit('draw', {
      offsetX: offsetX / canvasRef.current.width,
      offsetY: offsetY / canvasRef.current.height,
      roomid,
    })
  }

  const recreateDrawing = (stack) => {
    const ctx = contextRef.current
    for (let line of stack) {
      ctx.strokeStyle = line.colorSelected
      ctx.lineWidth = line.lineSelected
      ctx.lineCap = 'round'
      const startCoordX = (line.x * canvasRef.current.width) / line.width
      const startCoordY = (line.y * canvasRef.current.height) / line.height
      ctx.beginPath()
      ctx.moveTo(startCoordX, startCoordY)
      ctx.lineTo(startCoordX, startCoordY)
      ctx.stroke()

      for (let draw of line.path) {
        ctx.lineTo(
          (draw.x * canvasRef.current.width) / line.width,
          (draw.y * canvasRef.current.height) / line.height
        )
        ctx.stroke()
      }
      ctx.closePath()
    }
  }

  const clearCanvas = useCallback(
    (withEmit) => {
      redrawStack.current && redrawStack.current.clearStack()
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
      socket.emit('colorChange', { newColor: '#d90429', roomid })
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
