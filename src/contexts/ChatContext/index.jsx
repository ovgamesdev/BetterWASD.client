import { createContext } from "react";

export const ChatContext = createContext({
  isLoaded: false,
  user: null,
  emotes: [],
  personalEmotes: {},
  subBadges: {},
  paints: [],
  settings: null,
  setUser: () => {},
  setEmotes: () => {},
  setPersonalEmotes: () => {},
  setSubBadges: () => {},
  setPaints: [],
  setSettings: () => {},
});
