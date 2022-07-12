import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api/index.js";

function AuthProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setTokenData] = useState(null);
  const [editor, setEditor] = useState(null);

  const setToken = useCallback((tokenData) => {
    setTokenData(tokenData);

    if (tokenData) {
      localStorage["auth-token"] = tokenData;
    } else {
      delete localStorage["auth-token"];
    }
  }, []);

  const logOut = useCallback(() => {
    setUser(null);
    setToken(null);
  }, [setToken]);

  const loadData = useCallback(async () => {
    const tokenData = localStorage["auth-token"];
    setTokenData(tokenData);

    try {
      if (tokenData) {
        const { data } = await api.auth.getProfile();
        setUser(data);
      }
    } catch {
      // setToken(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
      token,
      editor,
      setUser,
      setToken,
      logOut,
      setEditor,
    }),
    [isLoaded, user, token, editor, setUser, setToken, logOut, setEditor]
  );

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthProvider;
