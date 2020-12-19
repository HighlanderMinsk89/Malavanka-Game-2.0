import React, { useMemo, Fragment } from 'react'
import styled, { css } from 'styled-components/macro'
import { TableRow } from './RoundResultsTable'
import { nameShortener } from '../../../utils'

const GameResultsTableRow = styled(TableRow)`
  ${(props) =>
    props.place === 1
      ? css`
          background-color: #ffcb05;
          height: 2.5em;
          & p {
            font-size: 2em;
            color: ${(props) => props.theme.darkBlue};
          }
        `
      : props.place === 2
      ? css`
          background-color: #adb5bd;
          & p {
            font-size: 1.8em;
          }
          height: 2.2em;
        `
      : props.place === 3
      ? css`
          background-color: #7a4419;
          & p {
            font-size: 1.6em;
          }
          height: 2.2em;
        `
      : null}
`

export const GameResultsTable = ({ gameState, socket }) => {
  const getGameResults = (gameState) => {
    if (gameState.users) {
      return gameState.users
        .map((user) => {
          return { ...Object.values(user)[0], socketId: Object.keys(user)[0] }
        })
        .sort((a, b) => b.points - a.points)
    }
    return []
  }

  const memoResults = useMemo(() => getGameResults(gameState), [gameState])

  return (
    <Fragment>
      {memoResults.map((user, idx) => {
        return (
          <GameResultsTableRow
            key={idx}
            yourName={user.socketId === socket.id}
            place={idx + 1}
          >
            <p>{`${idx + 1}. ${nameShortener(user.userName)}`}</p>
            <p>{user.points}</p>
          </GameResultsTableRow>
        )
      })}
    </Fragment>
  )
}
