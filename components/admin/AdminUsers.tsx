import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const inputClass =
    "w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Редагувати користувача
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...user, name, email, role });
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ім'я
            </label>
            <input
              id="edit-name"
              type="text"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Роль
            </label>
            <select
              id="edit-role"
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "customer")}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal: React.FC<{
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ user, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Видалити користувача?
      </h2>
      <p className="mb-6 text-gray-700">
        Ви впевнені, що хочете видалити користувача <b>{user.name}</b>? Цю дію
        не можна буде скасувати.
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Скасувати
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Видалити
        </button>
      </div>
    </div>
  </div>
);

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL + "/admin/users";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("authToken");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        throw new Error("Токен авторизації відсутній. Будь ласка, увійдіть.");
      }

      const res = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          `Помилка ${res.status}: ${errData.message || res.statusText}`
        );
      }

      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Помилка завантаження користувачів:", err);
      setError(err.message || "Не вдалося завантажити користувачів.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Не вдалося видалити користувача");
      }
      setUsers(users.filter((user) => user._id !== id));
    } catch (err: any) {
      console.error("Помилка видалення:", err);
      setError(err.message || "Не вдалося видалити користувача.");
    } finally {
      setShowDeleteConfirm(false); // Закриваємо модалку підтвердження
    }
  };

  const handleEditSave = async (updatedUser: User) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Не вдалося оновити користувача");
      }

      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      alert("✅ Дані користувача успішно оновлено!");
      setEditingUser(null);
    } catch (err: any) {
      console.error("Помилка оновлення:", err);
      setError(err.message || "Не вдалося оновити користувача.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <svg
          className="h-10 w-10 text-amber-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="ml-3 text-lg text-slate-700">Завантаження...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow-sm">
        <p className="font-semibold text-lg mb-2">
          Помилка завантаження даних:
        </p>
        <p>{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Спробувати ще
        </button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
        Керування користувачами
      </h1>

      <div className="flex items-center bg-white p-2 rounded-lg shadow-sm mb-4 border border-gray-200">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Пошук користувачів..."
          className="outline-none flex-1 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="p-3">Ім'я</th>
              <th className="p-3">Email</th>
              <th className="p-3">Роль</th>
              <th className="p-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 text-gray-800">{user.name}</td>
                <td className="p-3 text-gray-700">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 flex justify-end items-center gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
                    title="Редагувати"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                    title="Видалити"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{user.email}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(user)}
                className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
                title="Редагувати"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => {
                  setUserToDelete(user);
                  setShowDeleteConfirm(true);
                }}
                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                title="Видалити"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
        />
      )}

      {showDeleteConfirm && userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => handleDelete(userToDelete._id)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
