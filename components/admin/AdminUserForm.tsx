import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types";
import Button from "../Button";
import CheckCircleIcon from "../icons/CheckCircleIcon";

interface AdminUserFormProps {
  userId: string;
}

const AdminUserForm: React.FC<AdminUserFormProps> = ({ userId }) => {
  const { users, updateUser, fetchUsers } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "customer",
  });

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users, fetchUsers]);

  useEffect(() => {
    const userToEdit = users.find((u) => u.id === userId);
    if (userToEdit) {
      setFormData(userToEdit);
    }
  }, [userId, users]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUser(userId, formData);
    if (success) {
      navigate("/admin/users");
    } else {
      alert("Failed to update user.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

  if (!formData.id) {
    return <div>Loading user data or user not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Редагувати користувача
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID Користувача
          </label>
          <p className="mt-1 text-gray-500">{formData.id}</p>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Ім'я
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Роль
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/users")}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>Зберегти зміни</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;
