import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AlertContext } from "../../contexts/AlertContext/index.jsx";
import api from "../../services/api/index.js";

function AlertProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [emotes, setEmotes] = useState([]);

  const { token } = useParams();

  const loadData = useCallback(async () => {
    try {
      const {
        data: { user_id, settings },
      } = await api.auth.getAlertSettingsByToken(token);
      setUser(user_id);
      setSettings(settings);

      const wasdEmotes = await api.wasd.smiles();
      const wasdSmiles = wasdEmotes
        .map((c) =>
          c.smiles.map((s) => ({
            _id: s.id,
            code: s.token,
            visibility_simple: [],
            url: { x1: s.image_url, x2: s.image_url_retina, x3: s.image_preview_url_retina },
            width: { x1: 28, x2: 28, x3: 28 },
            height: { x1: 28, x2: 28, x3: 28 },
          }))
        )
        .flat();

      const { data } = await api.emote.getUserEmotesById(user_id);
      setEmotes([...data.sharedEmotes, ...data.channelEmotes, ...data.global, ...wasdSmiles]);
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
      settings,
      setUser,
      setEmotes,
      setSettings,
    }),
    [isLoaded, token, user, emotes, settings, setUser, setEmotes, setSettings]
  );

  return <AlertContext.Provider value={contextValue}>{props.children}</AlertContext.Provider>;
}

export default AlertProvider;
