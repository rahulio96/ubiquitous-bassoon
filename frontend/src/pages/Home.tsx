import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user, session } = useAuth();
  return (
    <div className="flex flex-col gap-2 justify-center items-center min-h-screen text-3xl">
      {(session && user) ?
          <Link to="/editor" className='text-blue-500 underline'>Go to Editor</Link> :
          <h1>Sign in to access the editor</h1>
      }
    </div>
  );
}

export default Home;