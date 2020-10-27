import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { Navbar } from './components/Navbar'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/authContext'

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
  console.log('isAuthenticated', isAuthenticated)
  const routes = useRoutes(isAuthenticated)

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
      <Router>
        <Navbar />
        <div className='container'>{routes}</div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
