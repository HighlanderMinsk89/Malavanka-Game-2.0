import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { AuthContext } from '../context/authContext'

const LandingPage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  color: ${(props) => props.theme.darkBlue};
  & h1 {
    text-align: center;
    margin: 0.5em 0;
  }
`

const Rules = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 90%;

  & p {
    font-size: larger;
  }

  & h3 {
    margin: 0;
  }
`

export const HomePage = () => {
  const history = useHistory()
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <LandingPage>
      <h1>Вас вітае Маляванка!</h1>

      <Rules>
        <h3>Правілы гульні:</h3>
        <p>
          Каб гульня пачалася, патрэбна каб у пакоі было два ці болей гульцоў.
          Гульня складаецца з трох раундаў. У кожным раундзе гулец мае
          магчамасць маляваць абранае ім слова, астатнія гульцы ў гэты час
          спрабуюць адгадаць гэтае слова. Праз пэўны час некаторыя літары ў
          слове будуць адчыняцца, але памятайце: чым хутчэй гулец адгадвае
          слова, тым больш ачкоў ён атрымлівае. Выйграе той, хто набярэ больш
          ачкоў пасля трох раундаў. Удачы!
        </p>
      </Rules>
      <button
        className='btn btn-large red'
        onClick={() =>
          history.push(`${isAuthenticated ? '/selectroom' : '/auth'}`)
        }
      >
        Гуляць
      </button>
    </LandingPage>
  )
}
