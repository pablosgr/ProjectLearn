import { Outlet, Link } from 'react-router'

export default function Layout() {
  const logout = async () => {
    try {
      const response = await fetch('http://localhost/track-learn/php_scripts/user/user_logout.php');
      if (!response.ok) {
        throw new Error('Network response failed');
      }
    } catch (error) {
      console.error('Error loging out:', error);
    }
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <div>
      <header>
        <nav>
          <Link to="/home"><button>Inicio</button></Link>
          <Link to="/profile"><button>Perfil</button></Link>
          <Link to="/" onClick={handleLogout}><button>Salir</button></Link>
          {/* NavLink for conditional rendering */}
        </nav>
      </header>

      <main>
        <Outlet /> {/* This renders the children pages */}
      </main>
    </div>
  )
}
