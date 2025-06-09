import { Outlet, useNavigate } from 'react-router'
import { useEffect } from 'react';
import { useUserData } from './context/UserContext.tsx';
import { useValidateSession } from './hooks/UseValidateSession.tsx';
import HeaderElement from './components/ui/HeaderElement';
import { LoaderCircle } from 'lucide-react';

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

    } catch (error) {
      console.error('Error loging out:', error);
    }
  }

  const handleLogout = () => {
    logout();
    setUserData(null);
    setIsLogged(false);
    navigate('/login');
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
      <header className='h-[80px] w-full bg-[#DDA853] flex items-center justify-between px-8 text-white'>
        <p className='w-[200px] text-lg font-medium select-none'>Track & Learn</p>
        <nav className='w-full'>
          <ul className='flex flex-row gap-14 justify-around items-center'>
            <HeaderElement to="/home">Home</HeaderElement>

            {userData?.role !== 'student' && (
              <HeaderElement to="/test">Tests</HeaderElement>
            )}

            {userData?.role === 'admin' && (
              <HeaderElement to="/users">Users</HeaderElement>
            )}

            <HeaderElement to="/classroom">Classrooms</HeaderElement>
            <HeaderElement to="/profile">Profile</HeaderElement>
            <HeaderElement onClick={handleLogout}>Log out</HeaderElement>
          </ul>
        </nav>
      </header>

      <main>
        {
          isLoading && (
            <div className='px-[18%] pt-10 w-full h-full flex items-center justify-center'>
              <span className='pt-80 flex flex-col items-center gap-4'>
                <LoaderCircle className='animate-spin' size={50} />
                <p className='text-lg font-medium'>Loading..</p>
              </span>
            </div>
          )
        }
        {
          !isLoading && (
            <div className='px-[18%] pt-10 w-full'>
              <Outlet />
            </div>
          )
        }
      </main>
    </>
  )
}
