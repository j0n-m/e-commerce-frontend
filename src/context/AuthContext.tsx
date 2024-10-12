import { createContext, ReactNode, useState } from "react";

export type UserAuth = {
  id: string;
  username: string;
  user_code: number;
  is_admin: boolean;
  email: string;
  created_at: Date;
  first_name: string;
  last_name: string;
} | null;

type initialAuthUserType = {
  user: UserAuth;
  setUser: React.Dispatch<React.SetStateAction<UserAuth>>;
};
const initialAuthUser: initialAuthUserType = {
  user: null,
  setUser: () => {},
};
const AuthContext = createContext(initialAuthUser);

type AuthProviderProps = {
  children?: ReactNode;
};
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(initialAuthUser.user);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
