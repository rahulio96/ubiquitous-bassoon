import supabase from '../supabaseClient';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, session } = useAuth();
  
    // Log user in using Google SSO
    const signIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) {
            console.error('Error signing in:', error);
        }
    };

    // Log user out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    };
    
    return (
        <nav className="flex items-center p-3.5 px-10 z-10 absolute w-full justify-between text-center bg-(--secondary)">
            <Link className='text-green-400' to="/">Home</Link>
            <div className="flex gap-10 justify-end">
                {!session && 
                    <button
                        className='flex cursor-pointer bg-(--primary) px-5 py-2 hover:bg-black transition'
                        onClick={signIn}>
                            Sign In
                    </button>
                }

                {(user && session) &&
                    <div className="flex items-center">{`Hello, ${user.first_name}`}</div>
                }

                {session && 
                    <button 
                        className='flex cursor-pointer bg-(--primary) px-5 py-2 hover:bg-black transition'
                        onClick={signOut}>
                            Sign Out
                    </button>
                }
            </div>
        </nav>
    );
};

export default Navbar;