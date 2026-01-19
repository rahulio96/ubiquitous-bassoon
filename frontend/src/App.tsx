import supabase from './supabaseClient';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

function App() {
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
    } else {
      console.log('Signed out successfully');
    }
  };

  return (
    <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
      {!session && 
        <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signIn}>Sign In with Google</button>
      }

      {session && 
        <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signOut}>Sign Out</button>
      }
      
      <div className=''>{`Hello, ${user ? `${user.first_name}!` : 'please log in'}`}</div>
      <div className=''>{user?.email}</div>

      <Link to="/editor" className='text-blue-500 underline'>Go to Editor</Link>
    </div>
  );
}

export default App;