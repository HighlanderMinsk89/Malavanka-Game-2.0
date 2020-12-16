import styled, { keyframes } from 'styled-components/macro'

const blink = keyframes`
    20%, 24% {
    color: #EF233C;
    text-shadow: none;
};

0%,
19%,
25%,
56%,
100% {
    text-shadow: 0 0 2px #D90429, 0 0 3px #D90429, 0 0 5px #D90429, 0 0 10px #D90429, 0 0 15px #D90429, 0 0 3px #D90429, 0 0 20px #D90429;
    color: #2B2D42;
    font-style: normal;
  };
}
`

export const StyledLogo = styled.p`
  margin: 0;
  font-size: 1.5em;
  color: ${(props) => props.theme.red};
  font-family: 'Pacifico', cursive;
  font-style: italic;
  text-align: center;
  animation: ${blink} 12s infinite;
  -webkit-animation: ${blink} 12s infinite;
`
