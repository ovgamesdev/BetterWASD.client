import { createContext } from "react";

export const ChatContext = createContext({
  isLoaded: false,
  user: null,
  emotes: [],
  subBadges: {},
  paints: [],
  settings: null,
  setUser: () => {},
  setEmotes: () => {},
  setSubBadges: () => {},
  setPaints: [],
  setSettings: () => {},
});
