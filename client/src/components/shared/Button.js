import React from 'react'
import styled from 'styled-components'

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
