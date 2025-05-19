import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserContextType, UserData } from '../types/user-context-type';

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  isLogged: false,
  setIsLogged: () => {}
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ 
      userData, 
      setUserData, 
      isLogged, 
      setIsLogged 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserData = () => useContext(UserContext);
