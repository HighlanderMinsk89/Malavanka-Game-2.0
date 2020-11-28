import React, { useCallback, useEffect, useState } from 'react'
import { WordModal } from './WordsModal'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'

export const SelectWordModal = ({ socket, roomid }) => {
  const [words, setWords] = useState([])
  const [selectedWord, setSelectedWord] = useState(false)
  const { request, loading, error, clearError } = useHttp()
  const message = useMessage()

  const fetchWords = useCallback(async () => {
    const response = await request('/api/word/getrandom3', 'get')
    if (response) setWords(response)
  }, [request])

  const handleClick = (word) => (e) => {
    setSelectedWord(word)
    socket.emit('wordSelected', {
      selectedWord: word,
      roomid,
    })
  }

  useEffect(() => {
    message(error)
    clearError()
  }, [error, clearError, message])

  useEffect(() => {
    fetchWords()
  }, [fetchWords])

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
