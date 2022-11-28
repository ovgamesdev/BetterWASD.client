import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Chat from "../../../../components/UI/Chat";
import Slider from "../../../../components/UI/Slider";
import api from "../../../../services/api";

import firstMessages from "./first_messages.json";
import messages from "./messages.json";
import users from "./users.json";

const ChatPreview = ({ settings, streamer_id }) => {
  const [paints, setPaints] = useState({});
  const [emotes, setEmotes] = useState({});
  const [subBadges, setSubBadges] = useState({ "1mon": "url(https://cdn.betterttv.net/emote/60dca7ad8ed8b373e421bbdd/2x)", "3mon": "", "6mon": "", "9mon": "", "12mon": "", "18mon": "", "24mon": "" });
  const [messages, setMessages] = useState(firstMessages);
  const [spawnTime, setSpawnTime] = useState(2000);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingText("Загрузка цвета имени");
      const dataPaint = await api.paint.getPaints();
      setLoadingText("Загрузка эмоций");
      const { dataEmotes, dataSubBadges } = await api.emote.getFullEmotes(streamer_id);
      setPaints(dataPaint);
      setEmotes(dataEmotes);
      setSubBadges(dataSubBadges || subBadges);
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setLoadingText("Запуск симуляции");

    const interval = setInterval(
      () =>
        setMessages((msgs = []) => {
          if (msgs.length + 1 > 29) msgs.splice(0, 1);
          return [...msgs, generateMessage()];
        }),
      spawnTime
    );

    return () => clearInterval(interval);
  }, [spawnTime, isLoaded]);

  const setLoadingText = (text) => setMessages((msgs) => msgs.map((msg) => (msg.id === "loading" ? { ...msg, message: text } : msg)));

  return (
    <>
      <Chat style={{ height: 200 }} messages={messages} settings={settings} paints={paints} emotes={emotes} subBadges={subBadges} />
      <div className="row">
        <div className="left">
          <label>Симуляция сообщений</label>
        </div>
        <div className="right">
          <Slider min={100} max={30000} step={100} tooltipLabel={(v) => v / 1000 + "сек"} value={spawnTime} onChange={(e) => setSpawnTime(Number(e.target.value))} />
        </div>
      </div>
    </>
  );
};

const generateMessage = () => {
  const m = messages[getRandomInt(0, messages.length - 1)];
  const u = users[getRandomInt(0, users.length - 1)];

  const res = {
    messageType: "message",
    id: uuidv4(),
    user_id: u.user_id,
    user_login: u.user_login,
    user_channel_role: u.user_channel_role,
    other_roles: u.other_roles,
    hash: uuidv4(),
    meta: u.meta || null,
  };

  res.message = typeof m === "string" ? m.replace("better-link:", document.location.origin) : undefined;
  res.sticker = typeof m === "object" ? { sticker_image: m } : undefined;

  return res;
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default ChatPreview;
