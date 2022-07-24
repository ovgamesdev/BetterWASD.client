import { createContext } from "react";

export const AuthContext = createContext({
  isLoaded: false,
  user: null,
  editor: null,
  token: null,
  files: { sounds: { channel: [], global: [], isLoading: true }, images: { channel: [], global: [], isLoading: true } },
  setUser: () => {},
  setEditor: () => {},
  setToken: () => {},
  setFiles: () => {},
  logOut: () => {},
});
