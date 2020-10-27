import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../Loader'

export const RoomCard = ({ room }) => {
  const history = useHistory()
  const { userName, userId, location, guestId } = useContext(AuthContext)
  const { request, loading } = useHttp()

  const handeleJoin = async (id) => {
    const user = { userName, userId, location, guestId }
    const response = await request(`/api/room/${id}/adduser`, 'post', user)
    if (response) history.push(`/room/${id}`)
  }

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
          <div>{room.users.length} users online</div>
          <button
            className='btn green darken-3'
            onClick={() => handeleJoin(room._id)}
          >
            Join
          </button>
        </div>
      </div>
    </li>
  )
}
