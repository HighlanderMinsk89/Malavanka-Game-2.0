import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { Navbar } from './components/Navbar'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/authContext'
import { SocketContext } from './context/socketContext'
import { useSocketIO } from './hooks/useSocketIO'

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
          <Navbar />
          <div className='body-app'>{routes}</div>
        </Router>
      </SocketContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
