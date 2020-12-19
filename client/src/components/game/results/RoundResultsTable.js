import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components/macro'
import { nameShortener } from '../../../utils'

export const TableRow = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.white};
  margin-bottom: 0.3em;
  padding: 0 1em;
  display: flex;
  justify-content: space-between;

  & p {
    font-size: 1.5em;
    margin: 0;
    padding: 0.2em;
    line-height: 100%;
    color: ${(props) =>
      props.yourName ? props.theme.brightRed : props.theme.darkBlue};
  }
`

export const RoundResultsTable = ({ gameState, socket }) => {
  const getRoundResults = (gameState) => {
    if (gameState.users) {
      return gameState.users
        .map((user) => {
          return { ...Object.values(user)[0], socketId: Object.keys(user)[0] }
        })
        .sort((a, b) => b.roundPoints - a.roundPoints)
    }
    return []
  }

  const memoResults = useMemo(() => getRoundResults(gameState), [gameState])

  return (
    <Fragment>
      {memoResults.map((user, idx) => {
        return (
          <TableRow key={idx} yourName={user.socketId === socket.id}>
            <p>{nameShortener(user.userName)}</p>
            <p>{user.roundPoints}</p>
          </TableRow>
        )
      })}
    </Fragment>
  )
}
