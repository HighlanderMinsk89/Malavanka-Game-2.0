import React from 'react'

export const SecretWord = ({ word, yourTurn }) => {
  word = !yourTurn ? word.word.replace(/./gi, '_') : word.word
  return (
    <div className='secret-word'>
      <h2>{word}</h2>
    </div>
  )
}
