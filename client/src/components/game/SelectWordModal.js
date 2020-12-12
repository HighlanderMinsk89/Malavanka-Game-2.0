import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { WordModal } from './WordsModal'

export const SelectWordModal = ({ socket, roomid }) => {
  const [words, setWords] = useState([])
  const [selectedWord, setSelectedWord] = useState(false)
  const { request, loading, error, clearError } = useHttp()
  const message = useMessage()

  const fetchWords = useCallback(async () => {
    if (roomid) {
      const response = await request(`/api/word/getrandom3/${roomid}`, 'get')
      if (response) setWords(response)
    }
  }, [request, roomid])

  const handleClickWordSelected = (word) => (e) => {
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
      handleClickWordSelected={handleClickWordSelected}
      loading={loading}
      roomid={roomid}
      socket={socket}
    />
  ) : null
}
