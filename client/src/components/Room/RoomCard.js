import React from 'react'

import { useHistory } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'

import { Loader } from '../Loader'

export const RoomCard = ({ room, capacity }) => {
  const history = useHistory()
  const { loading } = useHttp()
  if (loading) return <Loader />

  return (
    <li className='room-row-cont'>
      <div className='room-row'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Belarus_%281918%2C_1991%E2%80%931995%29.svg/250px-Flag_of_Belarus_%281918%2C_1991%E2%80%931995%29.svg.png'
          alt='БЧБ'
        />

        <h5>{room.roomName}</h5>

        <div className='room-row-info'>
          <div>
            {capacity} {`user${capacity === 1 ? '' : 's'} online`}
          </div>
          <button
            className='btn green darken-3'
            onClick={() => history.push(`/room/${room._id}`)}
          >
            Join
          </button>
        </div>
      </div>
    </li>
  )
}
