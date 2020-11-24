import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, CardPanel } from 'react-materialize'
import { Loader } from '../Loader'

export const WordModal = ({ handleClick, words, loading, roomid, socket }) => {
  const [timer, setTimer] = useState(10)

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

  return (
    <Modal
      className={'modal'}
      header='Select Word'
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
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <h4>{timer}</h4>
          {words.map((word) => {
            return (
              <Col key={word._id} m={4} s={12}>
                <CardPanel onClick={handleClick(word)} className='black'>
                  <p className='white-text word-card'>{word.word}</p>
                </CardPanel>
              </Col>
            )
          })}
        </Row>
      )}
    </Modal>
  )
}
