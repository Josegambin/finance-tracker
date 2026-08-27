import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react';

const TOKEN_KEY = 'finance_tracker_token';

interface AuthContextType {

  token: string | null;

  isAuthenticated: boolean;

  login: (token: string) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children
}: AuthProviderProps) {

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem(TOKEN_KEY)
    );

  const login = (newToken: string) => {

    localStorage.setItem(
      TOKEN_KEY,
      newToken
    );

    setToken(newToken);
  };

  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: token !== null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}