import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

function AuthChecker({ children }: { children: React.ReactNode }) {
    const { user, session } = useAuth();
    return (session && user) ? children : <NotFound />;
};

export default AuthChecker;