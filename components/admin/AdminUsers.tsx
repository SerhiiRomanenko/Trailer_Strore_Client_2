import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";

const AdminUsers: React.FC = () => {
  const { users, currentUser, deleteUser, fetchUsers } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId: string) => {
    if (
      window.confirm(
        "Ви впевнені, що хочете видалити цього користувача? Це не можна буде скасувати."
      )
    ) {
      deleteUser(userId);
    }
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Користувачі</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ім'я
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Роль
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currentUser?.id !== user.id && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) =>
                            handleNav(e, `/admin/user/edit/${user.id}`)
                          }
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded-full"
                          aria-label="Edit User"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                          aria-label="Delete User"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
