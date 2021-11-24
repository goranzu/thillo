import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils";

interface AuthContextInterface {
  authState: {
    userInfo: {
      id: number;
      email: string;
    } | null;
    isAuthenticated: boolean;
  };
  logout: () => Promise<void>;
  updateAuthState: (id: number, email: string) => void;
  isLoading: Boolean;
  isError: Boolean;
  isResolved: Boolean;
  isIdle: Boolean;
}

interface MeResponse {
  data: {
    id: number;
    email: string;
  };
}

const AuthContext = createContext<AuthContextInterface | null>(null);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userInfo: { id: number; email: string } | null;
  }>({
    isAuthenticated: false,
    userInfo: null,
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "rejected" | "resolved"
  >("idle");
  const navigate = useNavigate();

  const isLoading = status === "loading";
  const isError = status === "rejected";
  const isResolved = status === "resolved";
  const isIdle = status === "idle";

  async function logout() {
    try {
      await apiClient.delete(`/logout`);
      setAuthState({ isAuthenticated: false, userInfo: null });
      // TODO: Redirect user on logout
      navigate("/");
    } catch (err) {
      //   console.error(err);
      alert("Something went wrong with logging out.");
    }
  }

  useEffect(() => {
    (async function () {
      try {
        setStatus("loading");
        const { data } = await apiClient.get<MeResponse>(`/auth/me`);
        setAuthState({
          isAuthenticated: true,
          userInfo: { ...data.data },
        });
        setStatus("resolved");
      } catch (err) {
        setAuthState({
          isAuthenticated: false,
          userInfo: null,
        });
        setStatus("rejected");
        // console.log(err.response);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        logout,
        updateAuthState: (id, email) =>
          setAuthState({
            userInfo: { id, email },
            isAuthenticated: id ? true : false,
          }),
        isLoading,
        isError,
        isIdle,
        isResolved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("useAuth must be used within a AuthContextProvider.");
  }
  return context;
}

export { AuthContextProvider, useAuth };
