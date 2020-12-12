import React, { useEffect, useState } from 'react'
import { Modal } from 'react-materialize'
import { Loader } from '../Loader'

import styled, { keyframes } from 'styled-components/macro'

const StyledSelectWordModal = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledSelectWordInfoTimer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & p {
    margin: 0;
    height: 100%;
    font-size: 2em;
    padding: 0.5em;
    color: ${(props) => props.theme.white};
  }

  & p:nth-child(2) {
    color: ${(props) => (props.timer <= 5 ? props.theme.brightRed : null)};
    padding-left: 0;
  }

  @media (max-width: 800px) {
    & p {
      font-size: 1.5em;
      padding: 0;
    }
  }
`

const StyledWordsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2em 0;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`

const StyledWordCard = styled.div`
  background-color: ${(props) => props.theme.white};
  border-radius: 3px;
  height: 2.5rem;
  transform: skew(-20deg);
  box-shadow: 4px 4px 0 ${(props) => props.theme.lightGrey};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  & p {
    color: ${(props) => props.theme.darkBlue};
    font-size: 1.5em;
    font-weight: bolder;
    padding: 0 0.5em;

    margin: 0;
    display: flex;
    align-content: center;
  }

  &:hover {
    background-color: ${(props) => props.theme.brightRed};
    cursor: pointer;
  }

  &:active {
    position: relative;
    top: 4px;
    left: 4px;
    box-shadow: none;
  }
  @media (max-width: 800px) {
    margin-bottom: 2em;
  }
`

const HintIcon = styled.i`
  background: url(${(props) => props.img});
  background-size: cover;
  position: absolute;
  width: 15px;
  height: 15px;
  top: -10px;
  right: 5px;
`

const tooltipFadeIn = keyframes`
  0% {opacity: 0}
  100% {opacity: 1}
`

const HintTooltip = styled.div`
  position: absolute;
  height: 3em;
  width: fit-content;
  background-color: ${(props) => props.theme.white};
  transform: skew(20deg);
  top: -4em;
  left: inherit;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  animation: ${tooltipFadeIn} ease 500ms;

  & p {
    font-size: 1em;
    margin: 0;
    padding: 0 0.3em;
    color: ${(props) => props.theme.darkBlue};
  }

  & p i {
    color: gray;
  }

  @media (max-width: 800px) {
    top: -2em;
    right: -7em;
  }
`

const WordCard = ({ word, onPress }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const toogleTooltip = () => setShowTooltip((prev) => !prev)
  return (
    <StyledWordCard onClick={onPress}>
      <p>{word?.word}</p>
      <HintIcon
        img={process.env.PUBLIC_URL + '/question.png'}
        onMouseEnter={toogleTooltip}
        onMouseLeave={toogleTooltip}
      />
      {showTooltip ? (
        <HintTooltip>
          <p>
            <i>ru: </i>&nbsp;&nbsp;{word.word_ru}
          </p>
          <p>
            <i>en: </i>&nbsp;&nbsp;
            {word.word_en}
          </p>
        </HintTooltip>
      ) : null}
    </StyledWordCard>
  )
}

export const WordModal = ({
  handleClickWordSelected,
  words,
  loading,
  roomid,
  socket,
}) => {
  const [timer, setTimer] = useState(16)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) {
        socket.emit('playerSkippedDrawing', roomid)
      } else {
        setTimer((seconds) => seconds - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, socket, roomid])

  if (loading) return <Loader />

  return (
    <Modal
      className={'modal'}
      id='modal1'
      open={true}
      actions={[]}
      options={{
        dismissible: false,
        inDuration: 500,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%',
      }}
    >
      <StyledSelectWordModal>
        <StyledSelectWordInfoTimer timer={timer}>
          <p>Абярыце слова ды малюйце</p>
          <p>{timer}</p>
        </StyledSelectWordInfoTimer>
        <StyledWordsContainer>
          {words?.map((word) => {
            return (
              <WordCard
                key={word._id}
                word={word}
                onPress={handleClickWordSelected(word)}
              />
            )
          })}
        </StyledWordsContainer>
      </StyledSelectWordModal>
    </Modal>
  )
}
