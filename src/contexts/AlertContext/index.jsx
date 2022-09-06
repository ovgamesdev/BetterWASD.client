import { createContext } from "react";

export const AlertContext = createContext({
  isLoaded: false,
  user: null,
  emotes: [],
  settings: null,
  setUser: () => {},
  setEmotes: () => {},
  setSettings: () => {},
});
