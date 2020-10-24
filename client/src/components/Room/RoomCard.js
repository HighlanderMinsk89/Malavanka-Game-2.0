import React from 'react'

export const RoomCard = ({ room }) => {
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
          <button className='btn green darken-3'>Join</button>
        </div>
      </div>
    </li>
  )
}
