 import { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/admin.api';
import { AdminUser } from '../../api/admin.api';

export default function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  return (
    <div className="overflow-x-auto shadow rounded-xl p-4 bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Liste des utilisateurs</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-sm btn-outline">Modifier</button>
                <button className="btn btn-sm btn-error ml-2">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
