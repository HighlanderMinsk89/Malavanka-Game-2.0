const revealWord = (secretWord, wordToReveal) => {
  const totalLettersToReveal = Math.ceil(secretWord.length / 2)
  const alreadyRevealed = (wordToReveal.match(/[^_]/gi) || []).length
  let defaultRevallNum = Math.ceil(totalLettersToReveal / 3)
  let numToReveal
  if (totalLettersToReveal - alreadyRevealed < defaultRevallNum) {
    numToReveal = totalLettersToReveal - alreadyRevealed
  } else {
    numToReveal = defaultRevallNum
  }

  const secretSplitted = secretWord.split('')
  const wordToShowSplitted = wordToReveal.split('')

  const closedLetterIndexes = []
  for (let i = 0; i < wordToShowSplitted.length; i++) {
    if (wordToShowSplitted[i] === '_') closedLetterIndexes.push(i)
  }

  while (numToReveal) {
    const randomIndex = Math.floor(Math.random() * closedLetterIndexes.length)
    wordToShowSplitted[closedLetterIndexes[randomIndex]] =
      secretSplitted[closedLetterIndexes[randomIndex]]
    closedLetterIndexes.splice(randomIndex, 1)
    numToReveal--
  }

  return wordToShowSplitted.join('')
}

module.exports = { revealWord }
