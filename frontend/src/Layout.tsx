import { Outlet, Link } from 'react-router'

export default function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/home"><button>Inicio</button></Link>
          <Link to="/profile"><button>Perfil</button></Link>
          <Link to="/"><button>Salir</button></Link>
          {/* NavLink for conditional rendering */}
        </nav>
      </header>

      <main>
        <Outlet /> {/* This renders the children pages */}
      </main>
    </div>
  )
}
