import {createContext, useContext, useState, useEffect} from "react";
import { createClient } from "@supabase/supabase-js";

const AuthContext = createContext();

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const loginWithGoogle = async () => {
  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/menu`,
      },
    });

  return { data, error };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user || null);
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signup = async (email, password, name) => {
    setError(null);

    try {
      const { data, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

      if (signupError) {
        throw signupError;
      }

      if (data?.user) {
        setUser(data.user);
      }

      return {
        data,
        error: null,
      };
    } catch (err) {
      console.error("Erro no signup:", err);

      setError(err.message);

      return {
        data: null,
        error: err,
      };
    }
  };

  const login = async (email, password) => {
    setError(null);

    try {
      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      return {
        data,
        error: null,
      };
    } catch (err) {
      setError(err.message);

      return {
        data: null,
        error: err,
      };
    }
  };

  const logout = async () => {
    setError(null);

    try {
      const { error: logoutError } =
        await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

      setUser(null);

      return {
        error: null,
      };
    } catch (err) {
      setError(err.message);

      return {
        error: err,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
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
      "useAuth deve ser usado dentro de um AuthProvider"
    );
  }

  return context;
}

export { supabase };