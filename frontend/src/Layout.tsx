import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react';
import { useUserData } from './context/UserContext.tsx';
import { useValidateSession } from './hooks/UseValidateSession.tsx';
import HeaderElement from './components/ui/HeaderElement';
import { LoaderCircle } from 'lucide-react';
import { Menu } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const { userData, isLogged, setUserData, setIsLogged } = useUserData();
  const { isLoading, checkSession } = useValidateSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || e.target !== e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isLogged) {
    return <div className='w-full h-screen flex items-center justify-center'>
      <span className='flex flex-col items-center gap-4'>
        <LoaderCircle className='animate-spin' size={50} />
        <p className='text-lg font-medium'>Loading..</p>
      </span>
    </div>;
  }

  return (
    <>
      <header className='h-[80px] w-full bg-[#DDA853] flex items-center justify-between px-8 text-white'>
        <span className='h-full flex items-center'>
          <img 
            src="/project_learn_logo_wh.png" 
            alt="Logo" 
            className="w-fit h-10"
          />
        </span>
        
        {/* Desktop version */}
        <nav className='hidden lg:block w-full'>
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

        {/* Mobile version */}
        <div className='lg:hidden relative'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              p-2 hover:bg-[#b98e48] hover:cursor-pointer rounded-lg transition-colors
              ${isMenuOpen ? 'bg-[#b98e48]' : ''}
            `}
          >
            <Menu size={24} />
          </button>

          {isMenuOpen && (
            <div 
              className='fixed inset-0 shadow-xl z-10'
              onClick={handleClick}
            >
              <ul className='absolute right-5 top-25 w-60 bg-neutral-100 rounded-xl shadow-lg p-4 text-neutral-600'>
                <HeaderElement 
                  to="/home"
                  isDropdown
                >
                  Home
                </HeaderElement>
                
                {userData?.role !== 'student' && (
                  <HeaderElement 
                    to="/test"
                    isDropdown
                  >
                    Tests
                  </HeaderElement>
                )}
                
                {userData?.role === 'admin' && (
                  <HeaderElement 
                    to="/users"
                    isDropdown
                  >
                    Users
                  </HeaderElement>
                )}
                
                <HeaderElement 
                  to="/classroom"
                  isDropdown
                >
                  Classrooms
                </HeaderElement>
                
                <HeaderElement 
                  to="/profile"
                  isDropdown
                >
                  Profile
                </HeaderElement>
                
                <HeaderElement 
                  onClick={handleLogout}
                  isDropdown
                >
                  Log out
                </HeaderElement>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className='w-full h-[calc(100vh-80px)] overflow-y-auto'>
        {
          isLoading && (
            <div className='px-[18%] pt-30 w-full h-fit flex items-center justify-center'>
              <span className='flex flex-col items-center gap-4'>
                <LoaderCircle className='animate-spin' size={50} />
                <p className='text-lg font-medium'>Authenticating..</p>
              </span>
            </div>
          )
        }
        {
          !isLoading && (
            <div className='px-[18%] pt-10 mb-20 w-full h-fit'>
              <Outlet />
            </div>
          )
        }
      </main>
    </>
  )
}
