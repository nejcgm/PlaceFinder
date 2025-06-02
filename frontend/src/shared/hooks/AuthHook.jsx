import { useState, useCallback, useEffect } from "react";
let logOutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const logIn = useCallback((uid, token, expirationDate) => {
    setUserId(uid);
    setToken(token);
    const tokenExpirationDate =
      expirationDate ||
      new Date(
        new Date().getTime() + 1000 * 60 * 60 // 1 hour
      );
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      logOutTimer = setTimeout(
        logOut,
        tokenExpirationDate.getTime() - new Date().getTime()
      );
    } else {
      clearTimeout(logOutTimer);
    }
  }, [token, logOut, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      logIn(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [logIn]);

  return { token, logIn, logOut, userId };
};
