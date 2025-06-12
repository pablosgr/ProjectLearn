import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useValidateSession } from '../hooks/UseValidateSession.tsx';
import { Link } from 'react-router';
import { LoaderCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { checkSession } = useValidateSession();
  const navigate = useNavigate();

  const validateSession = async () => {
    const isValid = await checkSession();
    return isValid;
  }

  useEffect(() => {
    const init = async () => {
      const isValid = await validateSession();
      if (isValid) {
        navigate('/home', { replace: true });
      }
      setPageLoading(false);
    };

    init();
  }, [navigate, checkSession]);

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

      navigate('/home');
      
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className='w-full pt-90 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Loading..</p>
        </span>
      </div>
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <img 
        src="/project_learn_logo_og.png" 
        alt="Logo" 
        className="w-fit h-28 mb-10"
      />
      <form 
        className="
          flex flex-col gap-6
          max-w-[400px] min-w-[400px]
          h-fit
          text-neutral-600
          rounded-2xl p-10
          shadow-xl bg-white
        "
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          id="username" 
          name="username" 
          placeholder="Username" 
          className="border-1 border-neutral-400 p-2 rounded-lg" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Password" 
          className="border-1 border-neutral-400 p-2 rounded-lg" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <button 
          className="rounded-xl text-white text-lg font-medium bg-[#DDA853] px-3 py-2.5 hover:cursor-pointer hover:bg-[#b98e48] transition-colors disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-neutral-400 text-sm mt-2">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
