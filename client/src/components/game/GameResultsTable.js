import React, { Fragment, useMemo } from 'react'
import { Col, Row } from 'react-materialize'

export const GameResultsTable = ({ gameState }) => {
  const getGameResults = (gameState) => {
    if (gameState.users) {
      return gameState.users
        .map((user) => Object.values(user)[0])
        .sort((a, b) => b.points - a.points)
    }
    return []
  }

  const memoResults = useMemo(() => getGameResults(gameState), [gameState])

  return (
    <Fragment>
      {memoResults.map((user, idx) => {
        return (
          <Row key={idx}>
            <Col m={6} s={6}>
              <h3>{user.userName}</h3>
            </Col>
            <Col m={6} s={6}>
              <h3>{user.points}</h3>
            </Col>
          </Row>
        )
      })}
    </Fragment>
  )
}
