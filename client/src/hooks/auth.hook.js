import { useCallback, useEffect, useState } from 'react'

const localStorageData = 'userDataMalavanka'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [guestId, setGuestId] = useState(false)
  const [userName, setUserName] = useState(null)
  const [location, setLocation] = useState(null)

  const login = useCallback(
    (jwtToken, userId, userName, location, guestId = false) => {
      setToken(jwtToken)
      setUserId(userId)
      setUserName(userName)
      setGuestId(guestId)
      setLocation(location)
      localStorage.setItem(
        localStorageData,
        JSON.stringify({
          token: jwtToken,
          userId,
          userName,
          location: location ? location : null,
          guestId: guestId ? guestId : null,
        })
      )
    },
    []
  )

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setGuestId(false)
    setUserName(null)
    setLocation(null)
    localStorage.removeItem(localStorageData)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(localStorageData))
    if (data && data.token)
      login(data.token, data.userId, data.userName, data.location)
    else if (data && data.guestId)
      login(null, null, data.userName, data.location, data.guestId)
  }, [login])

  return { login, logout, token, userId, userName, location, guestId }
}
