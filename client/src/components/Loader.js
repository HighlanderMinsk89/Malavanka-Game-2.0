import React from 'react'

export const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '2rem',
        width: '20vw',
        margin: '0 40%',
      }}
    >
      <div className='progress black darken-1'>
        <div className='indeterminate green'></div>
      </div>
    </div>
  )
}
