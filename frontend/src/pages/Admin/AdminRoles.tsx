 // src/pages/admin/AdminRoles.tsx
import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '@api/admin.api';
import { User } from '@api/admin.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/layout/Select';
import { Card, CardContent } from '@components/layout/Card';
import { response } from 'express';

const roles = ['admin', 'mentor', 'intern', 'rh'];

const AdminRoles: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs', err);
        setError('Impossible de charger les utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
  prev.map((user) =>
    user._id === userId ? { ...user, role: newRole as 'admin' | 'mentor' | 'intern' | 'hr' } : user
  )
);

      alert('Rôle mis à jour avec succès.');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle', err);
      alert('Une erreur est survenue lors de la mise à jour du rôle.');
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des rôles</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <Select
                value={user.role}
                onValueChange={(value) => handleRoleChange(user._id, value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sélectionner un rôle" children={ undefined } />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRoles;