import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

import styled from 'styled-components/macro'
import { StyledLogo } from './Logo'

const StyledNavbar = styled.div`
  width: 100%;
  height: 2.8em;
  align-items: center;
  border-top: 0.3em solid ${(props) => props.theme.brightRed};
  position: relative;

  & .nav-wrapper {
    width: 100%;
    position: absolute;
    top: -0.3em;
    left: 0;
    height: 2.8em;
    display: flex;
    justify-content: space-between;
  }

  & .nav-group {
    display: flex;
    align-items: center;
  }

  & .nav-group .nav-item {
    display: flex;
    align-items: center;
    height: 2.8em;
    padding: 0 0.7em;
    border-top: 0.3em solid ${(props) => props.theme.brightRed};
  }
  & .nav-group .nav-item:hover {
    border-bottom: 0.3em solid ${(props) => props.theme.darkBlue};
  }
  & .nav-group:nth-child(1) .nav-item:hover {
    border-bottom: none;
  }
`

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: ${(props) => props.theme.darkBlue};
`

export const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)

  return (
    <StyledNavbar>
      <div className='nav-wrapper'>
        <div className='nav-group'>
          <div className='nav-item'>
            <StyledLink to='/'>
              <StyledLogo>Маляванка</StyledLogo>
            </StyledLink>
          </div>
        </div>
        <div className='nav-group'>
          {isAuthenticated ? (
            <div className='nav-item'>
              <StyledLink to='/scores'>Статыстыка</StyledLink>
            </div>
          ) : null}

          <div className='nav-item'>
            {isAuthenticated ? (
              <StyledLink to='/' onClick={logout}>
                Выйсці
              </StyledLink>
            ) : (
              <StyledLink to='/auth'>Увайсці / Рэгістрацыя</StyledLink>
            )}
          </div>
        </div>
      </div>
    </StyledNavbar>
  )
}
