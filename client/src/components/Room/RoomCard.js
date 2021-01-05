import React from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'

import styled from 'styled-components/macro'

import { Loader } from '../Loader'

const StyledRoomCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 310px;
  box-shadow: ${(props) => props.theme.shadow};
  margin: 1em;
  background-color: ${(props) => props.theme.darkBlue};
  color: ${(props) => props.theme.white};
  border-radius: 3px;
  @media (max-width: 500px) {
    width: 90%;
    height: fit-content;
    min-width: 275px;
  }

  &:hover {
    img {
      filter: grayscale(0);
      transform: scale(1.04);
    }
  }
`

const AuthorInfo = styled.div`
  display: flex;
  margin-bottom: 0.3em;
  overflow: hidden;

  & img {
    height: 270px;
    width: 45%;
    padding: 0.3em;
    transition: transform 0.5s, filter 1.5s ease-in-out;
    filter: grayscale(100%);
  }

  & div {
    display: flex;
    flex-direction: column;
    padding: 0.2em;
    max-height: 270px;
  }

  & div h5 {
    align-self: center;
    margin: 0;
    margin-bottom: 0.2em;
  }
  & div p {
    margin: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.red} transparent;
  }

  & div p::-webkit-scrollbar {
    width: 7px;
  }

  & div p::-webkit-scrollbar-track {
    background: transparent;
  }

  & div p::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.red};
    border-radius: 20px;
  }

  @media (max-width: 500px) {
    & img {
      width: 40%;
      height: 170px;
      order: 2;
      float: left;
    }

    & div {
      max-height: 170px;
    }
  }
`

const CardAction = styled.div`
  display: flex;
  justify-content: space-between;
  height: 35px;
  border-top: 1px solid black;
  padding: 0.2em;
  margin-bottom: 0.2em;
  background-color: ${(props) => props.theme.red};
  & h5 {
    margin: 0;
    padding-left: 0.3em;
  }

  & button {
    background-color: ${(props) => props.theme.darkBlue};
    color: ${(props) => props.theme.white};
  }
  & button :hover {
    background-color: ${(props) => props.theme.white};
    color: ${(props) => props.theme.darkBlue};
    cursor: pointer;
  }
`

export const RoomCard = ({ room, capacity }) => {
  const history = useHistory()
  const { loading } = useHttp()
  if (loading) return <Loader />

  return (
    <StyledRoomCard>
      <AuthorInfo>
        <img src={room.authorImage} alt={room.roomName} />
        <div>
          <h5>{room.roomName}</h5>
          <p>{room.description}</p>
        </div>
      </AuthorInfo>
      <CardAction>
        <h5>
          {`${capacity} гул${
            capacity === 1
              ? 'ец'
              : capacity <= 4 && capacity !== 0
              ? 'ьцы'
              : 'ьцоў'
          } анлайн`}
        </h5>
        <button onClick={() => history.push(`/room/${room._id}`)}>
          Далучыцца
        </button>
      </CardAction>
    </StyledRoomCard>
  )
}
