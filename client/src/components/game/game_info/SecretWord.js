import React from 'react'

export const SecretWord = ({ word, yourTurn }) => {
  word = !yourTurn ? word.word.replace(/./gi, '_') : word.word
  return (
    <div className='secret-word'>
      <h4>{word}</h4>
    </div>
  )
}
