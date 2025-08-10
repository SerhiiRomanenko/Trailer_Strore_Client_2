// src/pages/MyProfilePage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import UserCircleIcon from "../components/icons/UserCircleIcon";
import SpinnerIcon from "../components/icons/SpinnerIcon";
import MessageBox from "../components/MessageBox";

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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);

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
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (authMessage) {
      console.log("Auth Message:", authMessage);
    }
  }, [authMessage]);

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
        {" "}
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />{" "}
        <p className="ml-3 text-lg text-slate-700">
          Завантаження даних користувача...{" "}
        </p>{" "}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {" "}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        {" "}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Редагування профіля{" "}
        </h2>{" "}
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {" "}
          <div className="flex justify-center">
            {" "}
            <div className="relative group">
              {" "}
              <UserCircleIcon className="w-32 h-32 text-slate-300" />{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Ім'я{" "}
            </label>{" "}
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClasses}
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email{" "}
            </label>{" "}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClasses}
            />{" "}
          </div>{" "}
          <div className="pt-4 border-t border-slate-200">
            {" "}
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Зміна пароля{" "}
            </h3>{" "}
            <div>
              {" "}
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Старий пароль{" "}
              </label>{" "}
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не змінюєте"
                className={inputClasses}
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Новий пароль{" "}
              </label>{" "}
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не змінюєте"
                className={inputClasses}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loadingProfile}
            >
              {" "}
              {loadingProfile ? "Оновлення..." : "Оновити профіль"}{" "}
            </Button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
      {authMessage && (
        <MessageBox
          message={authMessage.text}
          type={authMessage.type}
          onClose={() => setAuthMessage(null)}
        />
      )}{" "}
    </div>
  );
};

export default MyProfilePage;
