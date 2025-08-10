// import React, { useState, useEffect } from "react";
// import { Search, Edit, Trash2 } from "lucide-react";
// const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/users`;
// // const API_URL = "/api/users";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingUser, setEditingUser] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         if (!token) {
//           throw new Error("No token found in localStorage");
//         }

//         const res = await fetch(API_URL, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           const errData = await res.json();
//           throw new Error(
//             `Error ${res.status}: ${errData.message || res.statusText}`
//           );
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [token]);

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Не вдалося видалити користувача");
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setShowDeleteConfirm(false);
//     }
//   };

//   const handleEditSave = async (updatedUser) => {
//     try {
//       const res = await fetch(`${API_URL}/${updatedUser._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: updatedUser.name,
//           email: updatedUser.email,
//           role: updatedUser.role,
//         }),
//       });
//       if (!res.ok) throw new Error("Не вдалося оновити користувача");

//       const updatedUsers = users.map((user) =>
//         user._id === updatedUser._id
//           ? {
//               ...user,
//               name: updatedUser.name,
//               email: updatedUser.email,
//               role: updatedUser.role,
//             }
//           : user
//       );
//       setUsers(updatedUsers);
//       setEditingUser(null);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <p className="p-6">Завантаження...</p>;
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Керування користувачами</h1>

//       <div className="flex items-center bg-white p-2 rounded-lg shadow-sm mb-4">
//         <Search className="text-gray-400" size={20} />
//         <input
//           type="text"
//           placeholder="Пошук користувачів..."
//           className="ml-2 outline-none flex-1"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700">
//               <th className="p-3">Ім'я</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Роль</th>
//               <th className="p-3">Дії</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user._id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{user.name}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       user.role === "admin"
//                         ? "bg-purple-100 text-purple-800"
//                         : "bg-blue-100 text-blue-800"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => setEditingUser(user)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <Edit size={18} />
//                   </button>

//                   <button
//                     onClick={() => {
//                       setUserToDelete(user);
//                       setShowDeleteConfirm(true);
//                     }}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {editingUser && (
//         <EditUserModal
//           user={editingUser}
//           onClose={() => setEditingUser(null)}
//           onSave={handleEditSave}
//         />
//       )}

//       {showDeleteConfirm && (
//         <DeleteConfirmModal
//           user={userToDelete}
//           onClose={() => setShowDeleteConfirm(false)}
//           onConfirm={() => handleDelete(userToDelete._id)}
//         />
//       )}
//     </div>
//   );
// };

// const EditUserModal = ({ user, onClose, onSave }) => {
//   const [name, setName] = useState(user.name);
//   const [email, setEmail] = useState(user.email);
//   const [role, setRole] = useState(user.role);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Редагувати користувача</h2>
//         <input
//           type="text"
//           className="w-full border p-2 rounded mb-2"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="email"
//           className="w-full border p-2 rounded mb-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <label className="block mb-4">
//           Роль:
//           <select
//             className="w-full border p-2 rounded mt-1"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="admin">admin</option>
//             <option value="customer">customer</option>
//           </select>
//         </label>
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
//             Скасувати
//           </button>
//           <button
//             onClick={() => onSave({ ...user, name, email, role })}
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Зберегти
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DeleteConfirmModal = ({ user, onClose, onConfirm }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//       <h2 className="text-xl font-bold mb-4">Видалити користувача?</h2>
//       <p className="mb-4">
//         Ви впевнені, що хочете видалити <b>{user.name}</b>?
//       </p>
//       <div className="flex justify-end gap-2">
//         <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
//           Скасувати
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-4 py-2 bg-red-500 text-white rounded"
//         >
//           Видалити
//         </button>
//       </div>
//     </div>
//   </div>
// );

// export default AdminUsers;

import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/users`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          throw new Error("No token found in localStorage");
        }
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(
            `Error ${res.status}: ${errData.message || res.statusText}`
          );
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Не вдалося видалити користувача");
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditSave = async (updatedUser) => {
    try {
      const res = await fetch(`${API_URL}/${updatedUser._id}`, {
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
      if (!res.ok) throw new Error("Не вдалося оновити користувача");

      const updatedUsers = users.map((user) =>
        user._id === updatedUser._id
          ? {
              ...user,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
            }
          : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <p className="p-6 text-center text-amber-500 font-semibold text-lg">
        Завантаження...
      </p>
    );
  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-semibold text-lg">
        {error}
      </p>
    );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Керування користувачами
      </h1>

      <div className="flex items-center bg-white p-2 rounded-lg shadow-sm mb-4 max-w-md mx-auto md:max-w-full">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Пошук користувачів..."
          className="ml-2 outline-none flex-1 text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Таблиця для десктопів */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Ім'я</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Роль</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b bg-white hover:bg-amber-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition"
                        aria-label="Редагувати"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition"
                        aria-label="Видалити"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Мобільний вигляд */}
        <div className="md:hidden p-4">
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800 text-lg">
                    {user.name}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="text-gray-600 text-sm mb-3">{user.email}</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition"
                    aria-label="Редагувати"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition"
                    aria-label="Видалити"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          user={userToDelete}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => handleDelete(userToDelete._id)}
        />
      )}
    </div>
  );
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Редагувати користувача
        </h2>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded mb-3 text-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ім'я"
        />
        <input
          type="email"
          className="w-full border border-gray-300 p-2 rounded mb-3 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <label className="block mb-4 text-gray-700 font-medium">
          Роль:
          <select
            className="w-full border border-gray-300 rounded p-2 mt-1 text-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">admin</option>
            <option value="customer">customer</option>
          </select>
        </label>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Скасувати
          </button>
          <button
            onClick={() => onSave({ ...user, name, email, role })}
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ user, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Видалити користувача?
      </h2>
      <p className="mb-6 text-gray-700">
        Ви впевнені, що хочете видалити <b>{user.name}</b>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Скасувати
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Видалити
        </button>
      </div>
    </div>
  </div>
);

export default AdminUsers;
