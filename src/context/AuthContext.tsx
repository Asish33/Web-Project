import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_STATE_CHANGE'; payload: { user: User | null; token: string | null } }
  | { type: 'LOGIN_REQUEST' | 'REGISTER_REQUEST' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGE':
      return {
        ...state,
        user: action.payload.user ? {
          id: action.payload.user.id,
          email: action.payload.user.email!,
          name: action.payload.user.user_metadata?.name
        } : null,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        dispatch({
          type: 'AUTH_STATE_CHANGE',
          payload: {
            user: session?.user ?? null,
            token: session?.access_token ?? null,
          },
        });

        // Create profile and preferences if user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Check if profile exists
            const { data: profile } = await supabase
              .from('user_profiles')
              .select()
              .eq('user_id', session.user.id)
              .single();

            if (!profile) {
              // Create profile
              await supabase.from('user_profiles').insert({
                user_id: session.user.id,
                display_name: session.user.user_metadata?.name,
              });

              // Create preferences
              await supabase.from('user_preferences').insert({
                user_id: session.user.id,
              });
            }
          } catch (error) {
            console.error('Error creating user profile:', error);
          }
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login with Google';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Registration successful! You can now log in.');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
      // Clear any stored session data
      await supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          supabase.auth.signOut();
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to logout';
      toast.error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);