import React from 'react'
import { ButtonStyled } from '../components/shared/Button'
import styled from 'styled-components'

const ProgressBar = styled.div`
  height: 20px;
  width: 100%;
  background-color: ${(props) => props.theme.darkBlue};
  margin-top: 2rem;
  border-radius: 15px;
`

const ProgressInner = styled.div`
  height: 100%;
  width: ${(props) => props.completed};
  background-color: ${(props) => props.theme.brightRed};
  border-radius: inherit;
`

export const ScoresPage = () => {
  return (
    <div>
      <h1>Scores Page</h1>
      <ButtonStyled className='default-shadow '>Hello</ButtonStyled>
      <ProgressBar>
        <ProgressInner completed='80%' />
      </ProgressBar>
    </div>
  )
}
