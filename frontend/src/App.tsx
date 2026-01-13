import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { apiFetch } from './api';

interface User {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
}

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [text, setText] = useState<string>('');

  const fetchUserData = async () => {
    try {
      const data = await apiFetch(`${API_URL}/api/protected/user`);
      if (!data.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await data.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
      {!session && 
        <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signIn}>Sign In with Google</button>
      }

      {session && 
        <button className='cursor-pointer bg-black px-5 py-3 text-white' onClick={signOut}>Sign Out</button>
      }
      
      <div className=''>{`Hello, ${user?.first_name}!`}</div>
      <div className=''>{user?.email}</div>

      {text && <div className='mt-4 p-4 bg-gray-100 rounded'>{text}</div>}
    </div>
  );
}

export default App;