import React from 'react'
import styled from 'styled-components/macro'

export const ButtonStyled = styled.button`
  border-radius: 3px;
  width: 5rem;
  padding: 0.3em 1em;
  background-color: ${(props) => props.theme.red};
  box-shadow: ${(props) => props.theme.shadow};

  &:active {
    position: relative;
    top: 1px;
  }

  &:hover {
    background-color: ${(props) => props.theme.brightRed};
    cursor: pointer;
  }

  &:focus {
    background-color: ${(props) => props.theme.red};
  }

  &:focus:hover {
    background-color: ${(props) => props.theme.red};
  }
`
const StyledCustomButton = styled.div`
  transform: skew(-20deg);
  box-shadow: 4px 4px 0 ${(props) => props.theme.lightGrey};
  background-color: ${(props) => props.theme.darkBlue};
  color: ${(props) => props.theme.white};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4em;
  height: 100%;
  position: relative;
  margin: 0 0.5em;
  border-radius: 3px;

  & span {
    padding: 0.5em 0.6em 0 0.5em;
    font-weight: bolder;
    position: relative;
  }

  &:hover {
    background-color: ${(props) => props.theme.red};
    color: ${(props) => props.theme.darkBlue};
    cursor: pointer;
  }

  &:active {
    position: relative;
    top: 4px;
    left: 4px;
    box-shadow: none;
  }
`

export const StyledButton = ({ children, onPress }) => {
  return <StyledCustomButton onClick={onPress}>{children}</StyledCustomButton>
}
