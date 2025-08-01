import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import UserCircleIcon from "../components/icons/UserCircleIcon";
import PencilIcon from "../components/icons/PencilIcon";
import SpinnerIcon from "../components/icons/SpinnerIcon";
import MessageBox from "../components/MessageBox";
import XMarkIcon from "../components/icons/XMarkIcon";

const MyProfilePage: React.FC = () => {
  const {
    currentUser,
    updateMyProfile,
    changePassword,
    loading: authLoading,
    authMessage,
    setAuthMessage,
  } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setAvatar(currentUser?.avatar || null);
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (authMessage) {
      console.log("Auth Message:", authMessage);
    }
  }, [authMessage]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setAuthMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setAuthMessage(null);

    let profileUpdateSuccess = false;
    let passwordChangeSuccess = true;

    try {
      const profileResult = await updateMyProfile({
        name,
        email,
        avatar: avatar,
      });
      profileUpdateSuccess = profileResult.success;

      if (oldPassword && newPassword) {
        const passwordResult = await changePassword(oldPassword, newPassword);
        passwordChangeSuccess = passwordResult.success;
        if (passwordChangeSuccess) {
          setOldPassword("");
          setNewPassword("");
        }
      }

      if (profileUpdateSuccess && passwordChangeSuccess) {
        setAuthMessage({
          type: "success",
          text: "Профіль та пароль успішно оновлено!",
        });
      } else if (profileUpdateSuccess && !passwordChangeSuccess) {
        setAuthMessage({
          type: "error",
          text: "Профіль оновлено, але не вдалося змінити пароль. Перевірте старий пароль.",
        });
      } else if (!profileUpdateSuccess && passwordChangeSuccess) {
        setAuthMessage({
          type: "error",
          text: "Пароль оновлено, але не вдалося оновити профіль.",
        });
      } else {
        setAuthMessage({
          type: "error",
          text: "Не вдалося оновити профіль та пароль.",
        });
      }
    } catch (error: any) {
      console.error("Error during profile/password update:", error);
      setAuthMessage({
        type: "error",
        text: error.message || "Сталася невідома помилка під час оновлення.",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  if (authLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">
          Завантаження даних користувача...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {" "}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Профіль та Зміна Пароля
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                />
              ) : (
                <UserCircleIcon className="w-32 h-32 text-slate-300" />
              )}
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Змінити аватар"
              >
                <PencilIcon className="w-8 h-8" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {avatar && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                  aria-label="Видалити аватар"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Ім'я
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            {" "}
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Зміна пароля
            </h3>
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Старий пароль
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не змінюєте"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Новий пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не змінюєте"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loadingProfile}
            >
              {loadingProfile ? "Оновлення..." : "Оновити профіль"}
            </Button>
          </div>
        </form>
      </div>
      {authMessage && (
        <MessageBox
          message={authMessage.text}
          type={authMessage.type}
          onClose={() => setAuthMessage(null)}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
