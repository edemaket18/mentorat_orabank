 // src/pages/admin/ManageUsersPage.tsx
import React, { useEffect, useState } from 'react';
import { User } from '@api/admin.api';
import { getAllUsers, deleteUser, approveUserRegistration } from '@api/admin.api';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';
import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const res = await getAllUsers();  
    setUsers(res);  
  } catch (error) {
    toast.error('Erreur lors du chargement des utilisateurs');
  }
};


  const handleDelete = async (userId: string) => {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleApproval = async (userId: string) => {
    try {
      const approvedUser = await approveUserRegistration(userId);
      setUsers((prev) => prev.map((user) => user._id === userId ? { ...user, ...approvedUser } : user));
      toast.success("Inscription validée : l'utilisateur peut maintenant se connecter.");
    } catch (error) {
      toast.error("Impossible de valider l'inscription.");
    }
  };

  const getUserName = (user: User) => user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  const filteredUsers = users.filter((user) =>
    getUserName(user).toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={ search }
          onChange={ (e) => setSearch(e.target.value) }
          className="w-64" name={ '' }        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user._id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{getUserName(user)}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <span className="text-xs text-primary">{user.role} · {user.registrationStatus === 'pending' ? 'En attente de validation' : 'Validé'}</span>
              </div>
              {user.registrationStatus === 'pending' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApproval(user._id)}
                >
                  Valider l'inscription
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDelete(user._id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageUsersPage;
