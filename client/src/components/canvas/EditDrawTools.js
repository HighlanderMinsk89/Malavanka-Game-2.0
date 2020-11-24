import React from 'react'

const colors = ['red', 'purple', 'green', 'yellow', 'blue', 'brown', 'white']
const lineWeight = [4, 10, 18, 28, 36]

export const EditDrawTools = ({
  width,
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
    <div className='edit-draw-cont' style={{ width }} disabled={!yourTurn}>
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
      <button
        onClick={() => clearCanvas(true)}
        className='btn btn-small waves-effect waves-light red'
        style={{ marginLeft: '1rem', height: '100%' }}
      >
        Clear
      </button>
    </div>
  )
}
