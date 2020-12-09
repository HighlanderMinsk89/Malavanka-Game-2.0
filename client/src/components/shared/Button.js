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
    /* border: 2px solid ${(props) => props.theme.darkBlue}; */
    background-color: ${(props) => props.theme.red};
  }
`

// export const ButtonStyledDiv = styled.div`
//   background: yellow;
//   box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.5);
//   display: inline-block;
//   font-size: 2em;
//   padding: 0.5em 2em;
//   text-decoration: none;
//   transform: skew(-20deg);

//   &:hover {
//     background-color: red;
//   }

//   &:active {
//     position: relative;
//     top: 10px;
//     left: 10px;
//     box-shadow: none;
//   }
// `
// const StyledButtonText = styled.span`
//   display: inline-block;
//   transform: skew(20deg);
// `

// export const StyledButton = ({ buttonText }) => {
//   return (
//     <ButtonStyledDiv>
//       <StyledButtonText>{buttonText}</StyledButtonText>
//     </ButtonStyledDiv>
//   )
// }
