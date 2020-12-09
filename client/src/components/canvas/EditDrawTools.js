import React, { useContext } from 'react'
import styled, { css } from 'styled-components/macro'
import { CanvasContext } from '../../context/canvasContext'
import { ButtonStyled } from '../shared/Button'

const colors = [
  '#d90429',
  '#4f008d',
  '#38b000',
  '#f3de2c',
  '#0077b6',
  '#774936',
  '#e85d04',
  '#212529',
  '#f8f9fa',
]
const lineWeight = [4, 10, 18, 28, 36]

const ToolsContainer = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;

  & button {
    margin-right: 0.5rem;
    height: 2rem;
  }
`

const EditColorsContainer = styled.div`
  display: flex;
  flex-basis: 60%;
  justify-content: space-between;
  height: 2rem;
  margin-right: 0.5rem;
`

const ColorPicker = styled.div`
  background-color: ${(props) => props.color};
  border-radius: 3px;
  width: 10%;
  margin-left: 0.3rem;
  box-shadow: 4px 4px 0 ${(props) => props.theme.lightGrey};
  transform: skew(-20deg);

  ${(props) =>
    props.isActive
      ? css`
          position: relative;
          top: 4px;
          left: 4px;
          box-shadow: none;
          margin-right: 0.3rem;
        `
      : null}
`

const EditLineContainer = styled(EditColorsContainer)`
  flex-basis: 40%;
  margin-left: 0.5rem;
`
const LinePicker = styled(ColorPicker)`
  background-color: ${(props) => props.theme.darkBlue};
  width: 17%;
  display: flex;
  justify-content: center;
`

const LinePickerDot = styled.div`
  background-color: ${(props) => props.theme.white};
  border-radius: 50%;
  align-self: center;
  width: ${(props) => props.line * 0.7 + 'px'};
  height: ${(props) => props.line * 0.7 + 'px'};
`

export const EditDrawTools = ({ socket, clearCanvas }) => {
  const {
    colorSelected,
    lineSelected,
    setColorSelected,
    setLineSelected,
    roomid,
  } = useContext(CanvasContext)

  const onColorChange = (newColor) => {
    setColorSelected(newColor)
    socket.emit('colorChange', { newColor, roomid })
  }

  const onLineChange = (newLine) => {
    setLineSelected(newLine)
    socket.emit('lineChange', { newLine, roomid })
  }

  return (
    <ToolsContainer>
      <ButtonStyled onClick={clearCanvas}>Clear</ButtonStyled>
      <EditColorsContainer>
        {colors.map((color) => {
          const isActive = color === colorSelected
          return (
            <ColorPicker
              color={color}
              key={color}
              isActive={isActive}
              onClick={() => onColorChange(color)}
            />
          )
        })}
      </EditColorsContainer>
      <EditLineContainer>
        {lineWeight.map((line) => {
          const isActive = line === lineSelected
          return (
            <LinePicker
              isActive={isActive}
              key={line}
              onClick={() => onLineChange(line)}
            >
              <LinePickerDot line={line} />
            </LinePicker>
          )
        })}
      </EditLineContainer>
    </ToolsContainer>
  )
}
