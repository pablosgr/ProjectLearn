import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<string | null>("");

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await fetch('http://localhost/track-learn/php_scripts/user/user.php');
        const data = await response.json();
        console.log(data);
        if (data) {
          setUser(data.users[0].name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchApiData();
    
  }, [count]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Track & Learn</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Click to fetch users from API and show them in console
        </button>
        <p>
          {user} is the first user
        </p>
      </div>
    </>
  )
}

export default App
