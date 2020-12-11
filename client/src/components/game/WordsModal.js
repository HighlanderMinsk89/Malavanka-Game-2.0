import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, CardPanel } from 'react-materialize'
import { Loader } from '../Loader'

import styled from 'styled-components/macro'

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

export const WordModal = ({ handleClick, words, loading, roomid, socket }) => {
  const [timer, setTimer] = useState(15)

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
              <StyledWordCard onClick={handleClick(word)} key={word._id}>
                <p>{word.word}</p>
              </StyledWordCard>
            )
          })}
        </StyledWordsContainer>
      </StyledSelectWordModal>
    </Modal>
  )
}
