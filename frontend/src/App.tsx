import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

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

  const [text, setText] = useState('');

  // Dummy API call to test backend
  const getText = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/hello`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        },
      );

      if (!response.ok) {
        console.error('Network response failed:', response.statusText);
        throw new Error('Network response failed');
      } else {
        const data = await response.json();
        setText(data.message);
      }

    } catch (error) {
      setText('Error fetching data');
    }
  };

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
      {!session && <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signIn}>Sign In with Google</button>}
      {session && <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signOut}>Sign Out</button>}
      <div className=''>{session?.user?.email}</div>
    </div>
  );
}

export default App;
