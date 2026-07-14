// src/pages/admin/AdminUsers.tsx
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@api/admin.api';
import { User } from '@api/admin.api';
 import { Card, CardContent } from '@components/layout/Card';
 import { Badge } from '@components/layout/Badge';
  import { Button  } from '@components/common/Button';
import { response } from 'express';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      setUsers(res);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="space-y-2">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline">{user.role}</Badge>
              <Button variant="outline" size="sm">Modifier</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
