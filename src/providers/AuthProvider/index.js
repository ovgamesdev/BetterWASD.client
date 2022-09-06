import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api/index.js";

function AuthProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setTokenData] = useState(null);
  const [editor, setEditor] = useState(null);
  const [files, setFiles] = useState({ sounds: { channel: [], global: [], isLoading: true }, images: { channel: [], global: [], isLoading: true } });

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

        global.gtag("event", "login_auth_token", { wasd_user_id: data.user_id, user_login: data.user_login });
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

  useEffect(() => {
    const fetchData = async () => {
      setFiles({ sounds: { channel: [], global: [], isLoading: true }, images: { channel: [], global: [], isLoading: true } });
      const { data: dataSounds } = await api.upload.get("sounds", editor?.user_id);
      setFiles({ sounds: { ...dataSounds, isLoading: false }, images: {} });
      const { data: dataImages } = await api.upload.get("images", editor?.user_id);
      setFiles({ sounds: { ...dataSounds, isLoading: false }, images: { ...dataImages, isLoading: false } });
    };
    fetchData();
  }, [editor]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
      token,
      editor,
      files,
      setUser,
      setToken,
      logOut,
      setEditor,
      setFiles,
    }),
    [isLoaded, user, token, editor, files, setUser, setToken, logOut, setEditor, setFiles]
  );

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthProvider;
