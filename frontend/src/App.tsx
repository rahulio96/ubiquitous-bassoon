import { useState, useEffect } from 'react';

function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [text, setText] = useState('');

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
  }

  useEffect(() => {
    getText();
  }, []);


  return (
    <div className='flex justify-center items-center min-h-screen'>{text}</div>
  );
}

export default App;
