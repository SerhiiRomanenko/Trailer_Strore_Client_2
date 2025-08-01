import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    if (success) {
      navigate("/");
    }
    setLoading(false);
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-3xl font-black text-center text-slate-900 mb-8">
        Створення акаунту
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Ім'я
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
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
            {loading ? "Створення..." : "Зареєструватися"}
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Вже маєте акаунт?{" "}
        <a
          href="/login"
          onClick={(e) => handleNav(e, "/login")}
          className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
        >
          Увійти
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
