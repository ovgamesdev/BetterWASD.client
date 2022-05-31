import { createContext } from "react";

export const AuthContext = createContext({
  isLoaded: false,
  user: null,
  editor: null,
  token: null,
  setUser: () => {},
  setEditor: () => {},
  setToken: () => {},
  logOut: () => {},
});
