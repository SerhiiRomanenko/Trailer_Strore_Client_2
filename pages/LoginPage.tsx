import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { setMeta, SITE_URL } from "../utils/seo";

const LoginPage: React.FC = () => {
  useEffect(() => {
    const title = "Увійти | ПричепМаркет";
    const desc = "Увійдіть у свій акаунт для доступу до особистого кабінету, історії замовлень та оформлення покупок.";
    const canonical = `${SITE_URL}/login`;
    setMeta({ title, description: desc, canonical, noindex: true });
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, forgotPassword } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) navigate("/");
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    const { message } = await forgotPassword(forgotEmail);
    setForgotMessage(message);
    setForgotLoading(false);
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <div className="w-full max-w-md">
        <div className="bg-[var(--color-surface)] rounded-[--radius-md] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-primary)] px-6 py-5 text-center">
            <h1 className="text-xl font-bold text-white">Вхід в акаунт</h1>
            <p className="text-sm text-white/80 mt-1">
              Введіть дані для входу у свій акаунт
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Пароль
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                  >
                    Забули пароль?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-sm font-semibold py-3 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Вхід...
                  </>
                ) : (
                  "Увійти"
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Немає акаунту?{" "}
                <a
                  href="/register"
                  onClick={(e) => handleNav(e, "/register")}
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                >
                  Зареєструватися
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotMessage("");
        }}
        title="Відновлення пароля"
      >
        {forgotMessage ? (
          <div className="text-center py-2">
            <p className="text-sm text-[var(--color-text-secondary)]">{forgotMessage}</p>
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotMessage("");
              }}
              className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              Закрити
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Введіть вашу email-адресу, і ми надішлемо вам інструкції для відновлення пароля.
            </p>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full text-sm font-medium py-2.5 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Надсилання...
                </>
              ) : (
                "Надіслати"
              )}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default LoginPage;
