import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AlertContext } from "../../contexts/AlertContext/index.jsx";
import api from "../../services/api/index.js";

function AlertProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [emotes, setEmotes] = useState({});
  const [personalEmotes, setPersonalEmotes] = useState({});

  const { token } = useParams();

  const loadData = useCallback(async () => {
    try {
      const {
        data: { user_id, settings },
      } = await api.auth.getAlertSettingsByToken(token);
      setUser(user_id);
      setSettings(settings);

      const { dataEmotes, dataPersonalEmotes } = await api.emote.getFullEmotes(user_id);
      setEmotes(dataEmotes);
      setPersonalEmotes(dataPersonalEmotes);
    } finally {
      setIsLoaded(true);
    }
  }, [token]);

  useEffect(() => settings && document.documentElement.style.setProperty("--alert-bg", settings.background_color), [settings]);

  useEffect(() => loadData(), [loadData]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      token,
      user,
      emotes,
      personalEmotes,
      settings,
      setUser,
      setEmotes,
      setPersonalEmotes,
      setSettings,
    }),
    [isLoaded, token, user, emotes, personalEmotes, settings, setUser, setEmotes, setPersonalEmotes, setSettings]
  );

  return <AlertContext.Provider value={contextValue}>{props.children}</AlertContext.Provider>;
}

export default AlertProvider;
