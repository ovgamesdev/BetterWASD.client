import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { ChatContext } from "../../contexts/ChatContext/index.jsx";
import api from "../../services/api/index.js";

function ChatProvider(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [emotes, setEmotes] = useState([]);
  const [personalEmotes, setPersonalEmotes] = useState({});
  const [subBadges, setSubBadges] = useState({ "1mon": "", "3mon": "", "6mon": "", "9mon": "", "12mon": "", "18mon": "", "24mon": "" });
  const [paints, setPaints] = useState([]);

  const { token } = useParams();

  const loadData = useCallback(async () => {
    try {
      const {
        data: { user_id, settings },
      } = await api.auth.getChatSettingsByToken(token);
      setUser(user_id);
      setSettings(settings);

      const dataPaint = await api.paint.getPaints();
      const { dataEmotes, dataSubBadges, dataPersonalEmotes } = await api.emote.getFullEmotes(user_id);

      setPaints(dataPaint);
      setSubBadges(dataSubBadges || subBadges);
      setEmotes(dataEmotes);
      setPersonalEmotes(dataPersonalEmotes)
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
      subBadges,
      paints,
      settings,
      setUser,
      setEmotes,
      setPersonalEmotes,
      setSubBadges,
      setPaints,
      setSettings,
    }),
    [isLoaded, token, user, emotes, personalEmotes, subBadges, paints, settings, setUser, setEmotes, setPersonalEmotes, setSubBadges, setPaints, setSettings]
  );

  return <ChatContext.Provider value={contextValue}>{props.children}</ChatContext.Provider>;
}

export default ChatProvider;
