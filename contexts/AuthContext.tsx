import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "../types";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://trailer-strore-server.onrender.com/api";

interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthMessage {
  type: "success" | "error" | "info";
  text: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateMyProfile: (
    data: ProfileUpdateData
  ) => Promise<{ success: boolean; message: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  users: User[];
  updateUser: (userId: string, data: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
  authMessage: AuthMessage | null;
  setAuthMessage: (message: AuthMessage | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [authMessage, setAuthMessage] = useState<AuthMessage | null>(null);

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        console.warn("Failed to fetch current user, logging out.");
        logout();
      }
    } catch (error) {
      console.error(
        "Failed to fetch current user (network error or server issue):",
        error
      );
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);
      fetchCurrentUser(authToken);
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (authMessage) {
      const timer = setTimeout(() => {
        setAuthMessage(null);
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [authMessage]);

  const handleAuthResponse = (data: { token: string; user: User }) => {
    if (data.token && data.user) {
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("authToken", data.token);
    } else {
      console.error("handleAuthResponse received invalid data:", data);
      logout();
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        handleAuthResponse(data);
        setAuthMessage({ type: "success", text: "Реєстрація успішна!" });
        return true;
      } else {
        const error = await response.json();
        setAuthMessage({
          type: "error",
          text: `Помилка реєстрації: ${error.message || response.statusText}`,
        });
        return false;
      }
    } catch (error: any) {
      setAuthMessage({
        type: "error",
        text: `Запит на реєстрацію не вдався: ${
          error.message || "Мережева помилка"
        }`,
      });
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        handleAuthResponse(data);
        setAuthMessage({ type: "success", text: "Вхід успішний!" });
        return true;
      } else {
        const error = await response.json();
        setAuthMessage({
          type: "error",
          text: `Помилка входу: ${error.message || response.statusText}`,
        });
        return false;
      }
    } catch (error: any) {
      setAuthMessage({
        type: "error",
        text: `Запит на вхід не вдався: ${error.message || "Мережева помилка"}`,
      });
      return false;
    }
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    setAuthMessage({ type: "info", text: "Ви вийшли з облікового запису." });
  }, []);

  const updateMyProfile = async (data: ProfileUpdateData) => {
    if (!token) {
      setAuthMessage({
        type: "error",
        text: "Не авторизовано. Будь ласка, увійдіть.",
      });
      return {
        success: false,
        message: "Не авторизовано. Будь ласка, увійдіть.",
      };
    }
    try {
      console.log("Sending profile update request with data:", data);
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/me/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      console.log("Profile update response status:", response.status);
      const responseText = await response.text();
      console.log("Profile update response raw text:", responseText);

      try {
        const result = JSON.parse(responseText);
        console.log("Profile update response parsed JSON:", result);

        if (response.ok) {
          handleAuthResponse(result);
          setAuthMessage({
            type: "success",
            text: result.message || "Профіль успішно оновлено.",
          });
          return {
            success: true,
            message: result.message || "Профіль успішно оновлено.",
          };
        }
        setAuthMessage({
          type: "error",
          text: result.message || "Не вдалося оновити профіль.",
        });
        return {
          success: false,
          message: result.message || "Не вдалося оновити профіль.",
        };
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response:", jsonError);
        setAuthMessage({
          type: "error",
          text: `Помилка: Отримано недійсний формат відповіді від сервера. Можливо, зображення завелике. (${responseText.substring(
            0,
            100
          )}...)`,
        });
        return {
          success: false,
          message: `Недійсний формат відповіді від сервера: ${jsonError.message}`,
        };
      }
    } catch (error: any) {
      console.error(
        "Profile update request failed (network/other error):",
        error
      );
      setAuthMessage({
        type: "error",
        text: error.message || "Помилка запиту на оновлення профілю.",
      });
      return {
        success: false,
        message: error.message || "Помилка запиту на оновлення профілю.",
      };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!token) {
      setAuthMessage({
        type: "error",
        text: "Не авторизовано. Будь ласка, увійдіть.",
      });
      return {
        success: false,
        message: "Не авторизовано. Будь ласка, увійдіть.",
      };
    }
    try {
      console.log("Sending password change request.");
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/me/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      console.log("Password change response status:", response.status);
      const responseText = await response.text();
      console.log("Password change response raw text:", responseText);

      try {
        const result = JSON.parse(responseText);
        console.log("Password change response parsed JSON:", result);

        if (response.ok) {
          handleAuthResponse(result);
          setAuthMessage({
            type: "success",
            text: result.message || "Пароль успішно змінено.",
          });
          return {
            success: true,
            message: result.message || "Пароль успішно змінено.",
          };
        }
        setAuthMessage({
          type: "error",
          text: result.message || "Не вдалося змінити пароль.",
        });
        return {
          success: false,
          message: result.message || "Не вдалося змінити пароль.",
        };
      } catch (jsonError: any) {
        console.error(
          "Failed to parse JSON response for password change:",
          jsonError
        );
        setAuthMessage({
          type: "error",
          text: `Помилка: Отримано недійсний формат відповіді від сервера при зміні пароля. (${responseText.substring(
            0,
            100
          )}...)`,
        });
        return {
          success: false,
          message: `Недійсний формат відповіді від сервера: ${jsonError.message}`,
        };
      }
    } catch (error: any) {
      console.error(
        "Password change request failed (network/other error):",
        error
      );
      setAuthMessage({
        type: "error",
        text: error.message || "Помилка запиту на зміну пароля.",
      });
      return {
        success: false,
        message: error.message || "Помилка запиту на зміну пароля.",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAuthMessage({
          type: "success",
          text:
            result.message ||
            "Інструкції для відновлення пароля надіслано на вашу пошту.",
        });
      } else {
        setAuthMessage({
          type: "error",
          text: result.message || "Не вдалося відновити пароль.",
        });
      }
      return { success: response.ok, message: result.message };
    } catch (error: any) {
      console.error("Forgot password request failed:", error);
      setAuthMessage({
        type: "error",
        text: error.message || "Помилка запиту на відновлення пароля.",
      });
      return {
        success: false,
        message: error.message || "Помилка запиту на відновлення пароля.",
      };
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error(
          "Failed to fetch users:",
          response.status,
          response.statusText
        );
        setAuthMessage({
          type: "error",
          text: `Помилка завантаження користувачів: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users (network error):", error);
      setAuthMessage({
        type: "error",
        text: `Мережева помилка при завантаженні користувачів: ${error}`,
      });
    }
  };

  const updateUser = async (
    userId: string,
    data: Partial<User>
  ): Promise<boolean> => {
    if (!token) {
      setAuthMessage({
        type: "error",
        text: "Не авторизовано для оновлення користувача.",
      });
      return false;
    }
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        await fetchUsers();
        if (currentUser?.id === userId) {
          await fetchCurrentUser(token);
        }
        setAuthMessage({
          type: "success",
          text: "Користувача успішно оновлено.",
        });
        return true;
      }
      const errorResult = await response.json();
      console.error(
        "Failed to update user:",
        response.status,
        response.statusText,
        errorResult
      );
      setAuthMessage({
        type: "error",
        text: `Не вдалося оновити користувача: ${
          errorResult.message || response.statusText
        }`,
      });
      return false;
    } catch (error: any) {
      console.error("Failed to update user (network error):", error);
      setAuthMessage({
        type: "error",
        text: `Мережева помилка при оновленні користувача: ${error.message}`,
      });
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!token || currentUser?.id === userId) {
      console.warn(
        "Cannot delete user: Not authenticated or attempting to delete self."
      );
      setAuthMessage({
        type: "error",
        text: "Неможливо видалити користувача: не авторизовано або спроба видалити себе.",
      });
      return false;
    }
    try {
      const response = await fetch(
        `https://trailer-strore-server.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        await fetchUsers();
        setAuthMessage({
          type: "success",
          text: "Користувача успішно видалено.",
        });
        return true;
      }
      const errorResult = await response.json();
      console.error(
        "Failed to delete user:",
        response.status,
        response.statusText,
        errorResult
      );
      setAuthMessage({
        type: "error",
        text: `Не вдалося видалити користувача: ${
          errorResult.message || response.statusText
        }`,
      });
      return false;
    } catch (error: any) {
      console.error("Failed to delete user (network error):", error);
      setAuthMessage({
        type: "error",
        text: `Мережева помилка при видаленні користувача: ${error.message}`,
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        register,
        logout,
        updateMyProfile,
        changePassword,
        forgotPassword,
        loading,
        users,
        updateUser,
        deleteUser,
        fetchUsers,
        authMessage,
        setAuthMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
