import { createContext } from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  userName: null,
  guestId: null,
  location: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
})
