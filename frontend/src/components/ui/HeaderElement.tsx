import { NavLink } from 'react-router';

interface HeaderElementProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  isDropdown?: boolean;
}

export default function HeaderElement({ 
  to, 
  onClick, 
  children, 
  isDropdown = false,
}: HeaderElementProps) {
  const baseStyle = `relative group py-1 font-medium text-xl hover:cursor-pointer ${isDropdown ? 'text-neutral-600' : 'text-[#F5EEDC] hover:text-white'}`;
  const dropdownStyle = `px-4 py-3 rounded-lg hover:bg-neutral-300 hover:text-neutral-700 hover:cursor-pointer block w-full text-center font-medium`;

  if (to) {
    return (
      <NavLink 
        to={to}
        className={({ isActive }) => 
          isDropdown ? dropdownStyle : `${baseStyle} ${isActive ? 'text-white' : ''}`
        }
      >
        <li>{children}</li>
        {!isDropdown && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        )}
      </NavLink>
    );
  }

  return (
    <li 
      onClick={onClick}
      className={isDropdown ? dropdownStyle : baseStyle}
    >
      {children}
      {!isDropdown && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
      )}
    </li>
  );
}
