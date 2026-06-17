import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useToast } from "../components/Toast";

const MyProfilePage: React.FC = () => {
  const {
    currentUser,
    updateMyProfile,
    changePassword,
    loading: authLoading,
  } = useAuth();
  const { success, error: showError } = useToast();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) navigate("/login");
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
  }, [currentUser, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileResult = await updateMyProfile({ name, email });

      if (oldPassword && newPassword) {
        const passwordResult = await changePassword(oldPassword, newPassword);
        if (passwordResult.success) {
          setOldPassword("");
          setNewPassword("");
        }
      }

      if (profileResult.success) {
        success("Профіль оновлено");
        if (oldPassword && newPassword) {
          success("Пароль змінено");
        }
      } else {
        showError(profileResult.message || "Не вдалося оновити профіль");
      }
    } catch (err: any) {
      showError(err.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="h-5 w-5 text-[var(--color-primary)] animate-spin" />
        <span className="text-sm text-[var(--color-text-secondary)]">Завантаження...</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 md:py-8">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4 md:mb-6">Мій профіль</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile section */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 md:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-full bg-[var(--color-bg)]">
              <User className="h-6 w-6 text-[var(--color-text-tertiary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{currentUser.name}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{currentUser.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Ім'я
              </label>
              <input
                type="text"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="profile-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Password section */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 md:p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Зміна пароля</h2>
          <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
            Залиште порожніми, якщо не хочете змінювати пароль
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="old-password" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Старий пароль
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  id="old-password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Введіть старий пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                  tabIndex={-1}
                >
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Новий пароль
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Введіть новий пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-sm font-semibold py-2.5 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Оновлення...
            </>
          ) : (
            "Зберегти зміни"
          )}
        </button>
      </form>
    </div>
  );
};

export default MyProfilePage;
