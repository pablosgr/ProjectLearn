import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('/php/user/user_login.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Login failed');
      }
      
      console.log('Login successful:', data);
      setUsername('');
      setPassword('');
      navigate('/home');
      
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Welcome, please log in</h1>
      <form 
        className="
          flex flex-col gap-3
          rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.8)] 
          shadow-neutral-900 bg-neutral-700
        "
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          id="username" 
          name="username" 
          placeholder="Username" 
          className="border-1 p-1 rounded-lg" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Password" 
          className="border-1 p-1 rounded-lg" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="rounded-3xl bg-neutral-500 px-3 py-2 hover:cursor-pointer hover:bg-neutral-600 disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
    </>
  );
}
