import React, { useCallback, useEffect, useState, useRef } from 'react'
import { WordModal } from './WordsModal'
import { useHttp } from '../../hooks/http.hook'

export const SelectWordModal = ({ socket, roomid }) => {
  const [words, setWords] = useState([])
  const [selectedWord, setSelectedWord] = useState(false)
  const { request, loading, error } = useHttp()

  const mountedRef = useRef(true)

  const fetchWords = useCallback(async () => {
    try {
      const response = await request('/api/word/getrandom3', 'get')
      if (mountedRef.current) setWords(response)
    } catch (e) {
      console.error(error)
    }
  }, [request, error])

  const handleClick = (word) => (e) => {
    setSelectedWord(word)
    socket.emit('wordSelected', {
      selectedWord: word,
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
