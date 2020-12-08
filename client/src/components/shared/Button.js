import React from 'react'
import styled from 'styled-components'

export const ButtonStyled = styled.button`
  border: 2px solid ${(props) => props.theme.darkBlue};
  border-radius: 3px;
  font: inherit;
  line-height: 1;
  padding: 0.3em 1em;
  background-color: ${(props) => props.theme.lightGrey};

  &:active {
    position: relative;
    top: 1px;
    background-color: blue;
  }

  &:hover {
    background-color: ${(props) => props.theme.red};
    cursor: pointer;
  }

  &:focus {
    background-color: ${(props) => props.theme.red};
  }

  &:focus:hover {
    border: 2px solid black;
    background-color: ${(props) => props.theme.red};
  }
`
