// src/pages/admin/AdminRH.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@components/layout/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/layout/Input';

interface HR {
  id: string;
  name: string;
  department: string;
}

const AdminRH: React.FC = () => {
  const [hrs] = useState<HR[]>([
    { id: '1', name: 'Fatoumata Diallo', department: 'Formation' },
    { id: '2', name: 'Jean Koffi', department: 'Suivi Stages' },
  ]);

  const handleMessage = (hrId: string) => {
    console.log(`Envoyer message à RH ${hrId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ressources Humaines</h1>
      <Card>
        <CardContent   >
          {hrs.map((hr) => (
            <div key={hr.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-2">
              <div>
                <p className="font-medium">{hr.name}</p>
                <p className="text-sm text-gray-500">Département : {hr.department}</p>
              </div>
              <Button onClick={() => handleMessage(hr.id)}>Contacter</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRH;
