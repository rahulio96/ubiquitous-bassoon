import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthChecker({ children }: { children: React.ReactNode }) {
    const { user, session } = useAuth();
    return (
        <>
            {(session && user) ? children : 
                <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
                    Please log in to access this page.
                    <Link to="/" className='text-blue-500 underline'>Go back to Home</Link>
                </div>
            }
        </>
    );
};

export default AuthChecker;