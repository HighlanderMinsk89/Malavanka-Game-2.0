import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { GuestForm } from '../components/auth/GuestForm'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import {
  ResultsModal,
  ResultsModalWrapper,
} from '../components/game/results/RoundResultsModal'
const AuthModalWrapper = styled(ResultsModalWrapper)``

const AuthModal = styled(ResultsModal)`
  max-width: 600px;
  width: 80vw;
  top: 10%;
  padding: 0;
`

const FormsHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  background-color: ${(props) => props.theme.white};
  height: 2em;
  & div {
    width: 100%;
    display: flex;
    justify-content: center;
    border-bottom: 2px solid ${(props) => props.theme.white};
    font-size: 1.1em;
    align-self: center;
    height: 100%;
  }

  & div:hover {
    cursor: pointer;
    border-bottom: 2px solid ${(props) => props.theme.red};
  }

  & div[id$=${(props) => props.active}] {
    background-color: ${(props) => props.theme.red};
    border-bottom: 2px solid ${(props) => props.theme.red};
  }
`

export const AuthPage = () => {
  const [selectedForm, setSelectedForm] = useState('login')

  const handleFormChange = (e) => setSelectedForm(e.target.id)

  return (
    <AuthModalWrapper>
      <AuthModal>
        <FormsHeader onClick={handleFormChange} active={selectedForm}>
          <div id='login'>Увайсці</div>
          <div id='signup'>Рэгістрацыя</div>
          <div id='guest'>Быць госцем</div>
        </FormsHeader>
        {selectedForm === 'login' ? <LoginForm /> : null}
        {selectedForm === 'signup' ? (
          <RegisterForm toLogin={setSelectedForm} />
        ) : null}
        {selectedForm === 'guest' ? <GuestForm /> : null}
      </AuthModal>
    </AuthModalWrapper>
  )
}
