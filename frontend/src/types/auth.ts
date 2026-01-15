import type { Session } from "@supabase/supabase-js/dist/index.cjs";
import type { User } from "./user";

type AuthContextType = {
  user: User | null;
  session: Session | null;
};

export type { AuthContextType };