import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

const load = keyframes`
  30%{
    width: 0px;
    margin-right: 10px;
  }
`

const LoaderWrapper = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 5, 43, 0.8);
`

const StyledLoader = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  margin: 0;
  text-align: center;

  & span {
    display: block;
    background: ${(props) => props.theme.white};
    width: 100px;
    height: 15px;
    animation: ${load} 1s infinite;
  }

  & span:nth-child(1) {
    animation-delay: 50ms;
  }
  & span:nth-child(2) {
    animation-delay: 100ms;
    background: ${(props) => props.theme.brightRed};
  }
  & span:nth-child(3) {
    animation-delay: 150ms;
  }
`

export const Loader = () => {
  return (
    <LoaderWrapper>
      <StyledLoader>
        <span></span>
        <span></span>
        <span></span>
      </StyledLoader>
    </LoaderWrapper>
  )
}
