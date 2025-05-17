import { Outlet, Link, useNavigate } from 'react-router'
import validateSession from './utils/auth_helper';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = async () => {
    try {
      const response = await fetch('/php/user/user_logout.php', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Network response failed');
      }

      navigate('/login');

    } catch (error) {
      console.error('Error loging out:', error);
    }
  }

  const handleLogout = () => {
    logout();
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isValid = await validateSession();
        
        if (!isValid) {
          throw new Error('Session is invalid');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validating session:', error);
        setIsAuthenticated(false);
        // navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div><p>Please authenticate again</p></div>;
  }

  return (
    <div>
      <header>
        <nav>
          <Link to="/home"><button>Inicio</button></Link>
          <Link to="/profile"><button>Perfil</button></Link>
          <button onClick={handleLogout}>Salir</button>
          {/* NavLink for conditional rendering */}
        </nav>
      </header>

      <main>
        <Outlet /> {/* This renders the children pages */}
      </main>
    </div>
  )
}
