import { createContext } from "react";

export const AlertContext = createContext({
  isLoaded: false,
  user: null,
  emotes: {},
  personalEmotes: {},
  settings: null,
  setUser: () => {},
  setEmotes: () => {},
  setPersonalEmotes: () => {},
  setSettings: () => {},
});
