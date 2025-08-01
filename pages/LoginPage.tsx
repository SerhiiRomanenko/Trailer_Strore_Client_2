import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Modal from "../components/Modal";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const { login, forgotPassword } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
    setLoading(false);
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { message } = await forgotPassword(forgotEmail);
    setForgotMessage(message);
    setLoading(false);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotMessage("");
    }, 4000);
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  return (
    <>
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-8">
          Вхід
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
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
              className={inputClasses}
            />
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Пароль
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-sm font-medium text-orange-600 hover:text-orange-500 hover:underline"
              >
                Забули пароль?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "Вхід..." : "Увійти"}
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Немає акаунту?{" "}
          <a
            href="/register"
            onClick={(e) => handleNav(e, "/register")}
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            Зареєструватися
          </a>
        </p>
      </div>
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Відновлення пароля"
      >
        {forgotMessage ? (
          <p className="text-center text-emerald-600">{forgotMessage}</p>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-slate-600">
              Введіть вашу електронну адресу, і ми надішлемо вам інструкції для
              відновлення пароля.
            </p>
            <div>
              <label htmlFor="forgot-email" className="sr-only">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className={inputClasses}
                placeholder="your.email@example.com"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Надсилання..." : "Надіслати"}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default LoginPage;
