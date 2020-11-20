import React, { useCallback, useEffect, useState, useRef } from 'react'
import { WordModal } from './WordsModal'
import { useHttp } from '../../hooks/http.hook'

export const SelectWordModal = ({ socket, roomid }) => {
  const [words, setWords] = useState([])
  const [selectedWord, setSelectedWord] = useState(false)
  const { request, loading } = useHttp()

  const mountedRef = useRef(true)

  const fetchWords = useCallback(async () => {
    try {
      const response = await request('/api/word/getrandom3', 'get')
      if (mountedRef.current) setWords(response)
    } catch (e) {
      console.error(e)
    }
  }, [request])

  const handleClick = (e) => {
    setSelectedWord(e.target.innerHTML)
    socket.emit('wordSelected', {
      selectedWord: e.target.innerHTML,
      roomid,
    })
  }

  useEffect(() => {
    fetchWords()
  }, [fetchWords])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return !selectedWord ? (
    <WordModal
      words={words}
      handleClick={handleClick}
      loading={loading}
      roomid={roomid}
      socket={socket}
    />
  ) : null
}
