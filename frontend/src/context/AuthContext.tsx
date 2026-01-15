import { createContext, useContext } from "react";
import type { AuthContextType } from "../types/auth";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

export const useAuth = () => useContext(AuthContext);