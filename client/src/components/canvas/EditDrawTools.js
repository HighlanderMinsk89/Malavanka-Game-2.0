import React, { useState } from 'react'

const colors = ['red', 'purple', 'green', 'yellow', 'blue', 'brown', 'white']
const lineWeight = [4, 10, 16, 24, 30]

export const EditDrawTools = ({
  width,
  changeColor,
  changeLineWeight,
  clearCanvas,
}) => {
  const [colorSelected, setColorSelected] = useState('red')
  const [lineSelected, setLineSelected] = useState(4)

  const onColorChange = (e) => {
    setColorSelected(e.target.getAttribute('color'))
    changeColor(e.target.getAttribute('color'))
  }

  const onLineChange = (e) => {
    setLineSelected(+e.target.getAttribute('lineweight'))
    changeLineWeight(+e.target.getAttribute('lineweight'))
  }
  return (
    <div className='edit-draw-cont' style={{ width }}>
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
        onClick={clearCanvas}
        className='btn btn-small waves-effect waves-light red'
        style={{ marginLeft: '1rem', height: '100%' }}
      >
        Clear
      </button>
    </div>
  )
}
