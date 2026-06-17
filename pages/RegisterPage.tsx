import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (success) navigate("/");
    setLoading(false);
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ["", "Слабкий", "Середній", "Хороший", "Сильний", "Дуже сильний"];
  const strengthColors = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-emerald-500",
  ];

  return (
    <div className="w-full max-w-md">
      <div className="bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-primary)] px-6 py-5 text-center">
          <h1 className="text-xl font-bold text-white">Створення акаунту</h1>
          <p className="text-sm text-white/80 mt-1">
            Заповніть дані для реєстрації
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Ім&apos;я
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім&apos;я"
                className="w-full"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  placeholder="Мінімум 6 символів"
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

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < strength ? strengthColors[strength] : "bg-[var(--color-border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Надійність пароля: <span className="font-medium">{strengthLabels[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-semibold py-3 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Створення...
                </>
              ) : (
                "Зареєструватися"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Вже маєте акаунт?{" "}
              <a
                href="/login"
                onClick={(e) => handleNav(e, "/login")}
                className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Увійти
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
