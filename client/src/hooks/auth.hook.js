import { useCallback, useEffect, useState } from "react";

const localStorageData = "userDataMalavanka";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [guest, setGuest] = useState(false);

  const login = useCallback((jwtToken, userId, guest = false) => {
    setToken(jwtToken);
    setUserId(userId);
    setGuest(guest);
    localStorage.setItem(
      localStorageData,
      JSON.stringify({ token: jwtToken, userId, guest })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setGuest(false);
    localStorage.removeItem(localStorageData);
  }, []);



  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(localStorageData));
    if (data && data.token) login(data.token, data.userId);
    else if (data && data.guest) login(null, null, data.guest);
  }, [login]);

  return { login, logout, token, userId, guest };
};
