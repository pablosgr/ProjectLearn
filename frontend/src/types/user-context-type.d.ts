export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface UserContextType {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}
