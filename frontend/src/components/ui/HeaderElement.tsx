import { NavLink } from 'react-router';

interface HeaderElementProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function HeaderElement({ to, onClick, children }: HeaderElementProps) {
  if (to) {
    return (
      <NavLink 
        to={to}
        className={({ isActive }) => 
          `relative group py-1 font-medium text-lg ${isActive ? 'text-white' : 'text-[#F5EEDC] hover:text-white'}`
        }
      >
        <li>{children}</li>
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      </NavLink>
    );
  }

  return (
    <li 
      onClick={onClick}
      className="relative group py-1 font-medium text-lg cursor-pointer text-[#F5EEDC] hover:text-white"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
    </li>
  );
}