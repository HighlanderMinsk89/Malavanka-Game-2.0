import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { Navbar } from './components/Navbar'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/authContext'
import { SocketContext } from './context/socketContext'
import { useSocketIO } from './hooks/useSocketIO'

import { ThemeProvider } from 'styled-components/macro'

const theme = {
  darkBlue: '#2B2D42',
  lightGrey: '#8D99AE',
  white: '#EDF2F4',
  brightRed: '#EF233C',
  red: '#D90429',
  green: '#26c485',
  bigShadow: '4px 4px 15px #2B2D42',
  shadow: '1.5px 1.5px 1.5px #2B2D42',
}

function App() {
  const {
    login,
    logout,
    token,
    userName,
    userId,
    guestId,
    location,
  } = useAuth()
  const isAuthenticated = !!token || !!guestId

  const routes = useRoutes(isAuthenticated)

  const { socket, yourId } = useSocketIO()

  useEffect(() => {
    if (socket) socket.emit('getId')
  }, [socket])

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token,
        userId,
        userName,
        guestId,
        location,
        isAuthenticated,
      }}
    >
      <SocketContext.Provider value={{ socket, yourId }}>
        <Router>
          <ThemeProvider theme={theme}>
            <Navbar />
            <div className='body-app'>{routes}</div>
          </ThemeProvider>
        </Router>
      </SocketContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
