export interface UserData {
  id: string | null;
  name: string | null;
  username: string | null;
  email: string | null;
  role?: string | null;
}

export interface UserContextType {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}
