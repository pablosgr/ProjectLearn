import { Outlet, Link, useNavigate } from 'react-router'
import { useEffect } from 'react';
import { useUserData } from './context/UserContext.tsx';
import { useValidateSession } from './hooks/UseValidateSession.tsx';

export default function Layout() {
  const navigate = useNavigate();
  const { userData, isLogged, setUserData, setIsLogged } = useUserData();
  const { isLoading, checkSession } = useValidateSession();

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
    setIsLogged(false);
    setUserData({
      id: null,
      name: null,
      username: null,
      email: null,
      role: null
    });
    logout();
  }

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isLogged) {
    return <div>
      <p>Please authenticate, redirecting to login..</p>
    </div>;
  }

  return (
    <>
      <header className='h-[80px] w-full bg-neutral-500 flex items-center justify-between p-5'>
        <p className='w-[150px]'>Welcome, {userData?.username}</p>
        <nav className='w-full'>
          <ul className='flex flex-row gap-8 justify-end'>
            <Link to="/home"><li>Inicio</li></Link>
            <Link to="/profile"><li>Perfil</li></Link>
            <li onClick={handleLogout}>Salir</li>
            {/* NavLink for conditional rendering */}
          </ul>
        </nav>
      </header>

      <main>
        {
          isLoading && (
            <div>
              <p>Loading...</p>
            </div>
          )
        }
        {
          !isLoading && (
            <Outlet />
          )
        }
      </main>
    </>
  )
}
