import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/env';
import { useState } from 'react';
import { apiFetch } from '../api';

function Home() {
  const { user, session } = useAuth();
  const [msg, setMsg] = useState();

  const createSession = async () => {
    console.log("CLICKED")
    try {
      const response = await apiFetch(`${API_URL}/api/v1/session/create`, {
        method: "put",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ "question_id": "1" })
      });

      if (!response.ok) {
        console.error("NOT OK!")
      }

      const data = await response.json()
      console.log(data)


    } catch (error) {
      console.error("PUT FAILED")
    }

  };

  const sendMessage = async () => {
    console.log("CLICKED")
    try {
      const response = await apiFetch(`${API_URL}/api/v1/message/send/${6}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ 
          "content": "Wassup dawg"
        }),
      });

      if (!response.ok) {
        console.error("NOT OK!")
      }

      const data = await response.json()
      console.log(data)


    } catch (error) {
      console.error("POST FAILED")
    }
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen text-3xl">
      {(session && user) ?
          <>
            <Link to="/editor" className='text-blue-500 underline'>Go to Editor</Link>
            <button className="bg-black cursor-pointer" onClick={createSession}>CREATE SESSION</button>
            <button className="bg-black cursor-pointer" onClick={sendMessage}>SEND MESSAGE</button>
          </> :
          <h1>Sign in to access the editor</h1>
      }
    </div>
  );
}

export default Home;