import React, { Fragment, useMemo } from 'react'
import { Col, Row } from 'react-materialize'

export const RoundResultsTable = ({ gameState }) => {
  const getRoundResults = (gameState) => {
    if (gameState.users) {
      return gameState.users
        .map((user) => Object.values(user)[0])
        .sort((a, b) => b.roundPoints - a.roundPoints)
    }
    return []
  }

  const memoResults = useMemo(() => getRoundResults(gameState), [gameState])

  return (
    <Fragment>
      {memoResults.map((user, idx) => {
        return (
          <Row key={idx}>
            <Col m={6} s={6}>
              <h3>{user.userName}</h3>
            </Col>
            <Col m={6} s={6}>
              <h3>{user.roundPoints}</h3>
            </Col>
          </Row>
        )
      })}
    </Fragment>
  )
}
