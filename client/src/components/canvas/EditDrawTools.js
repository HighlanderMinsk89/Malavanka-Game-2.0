import React from 'react'

const colors = ['red', 'purple', 'white', 'green', 'yellow', 'blue', 'brown']
const lineWeight = [4, 10, 18, 28, 36]

export const EditDrawTools = ({
  setColorSelected,
  setLineSelected,
  changeColor,
  changeLineWeight,
  clearCanvas,
  socket,
  roomid,
  colorSelected,
  lineSelected,
  yourTurn,
}) => {
  const onColorChange = (e) => {
    const newColor = e.target.getAttribute('color')
    setColorSelected(newColor)
    changeColor(newColor)
    socket.emit('colorChange', { newColor, roomid })
  }

  const onLineChange = (e) => {
    const newLine = +e.target.getAttribute('lineweight')
    setLineSelected(newLine)
    changeLineWeight(newLine)
    socket.emit('lineChange', { newLine, roomid })
  }

  return (
    <div className='edit-draw-cont' disabled={!yourTurn}>
      <button
        onClick={() => clearCanvas(true)}
        className='btn btn-small waves-effect waves-light red'
      >
        Clear
      </button>
      <div className='edit-colors'>
        {colors.map((color) => {
          return (
            <div
              className={`color-picker ${
                colorSelected === color ? 'color-selected' : ''
              }`}
              key={color}
              style={{ backgroundColor: color }}
              onClick={onColorChange}
              color={color}
            ></div>
          )
        })}
      </div>
      <div className='edit-line'>
        {lineWeight.map((line) => {
          return (
            <div
              key={line}
              lineweight={line}
              onClick={onLineChange}
              className={`line-picker ${
                lineSelected === line ? 'color-selected' : ''
              }`}
            >
              <div
                lineweight={line}
                onClick={onLineChange}
                className='line-picker-dot'
                style={{ width: line, height: line }}
              ></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
