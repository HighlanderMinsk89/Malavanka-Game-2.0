import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export const useSocketIO = () => {
  const [yourId, setYourId] = useState(null)
  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io.connect('/', { forceNew: true })
    socketRef.current.on('your id', (id) => {
      setYourId(id)
      console.log('USEREF HOOK. YOUR ID ---->', id)
    })
  }, [setYourId])

  return { socket: socketRef.current, yourId }
}
