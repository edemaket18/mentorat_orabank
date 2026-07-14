import React, { useEffect, useState } from 'react';
import { getContracts } from '@api/contract.api';
import { Contract } from '@api/contract.api';
import { Card, CardContent } from '@components/layout/Card';
import { Button } from '@components/common/Button';
import { toast } from 'react-toastify';



const RHContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    getContracts().then(setContracts).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Contrats de Stage</h2>
      <ul className="space-y-4">
        {contracts.map((contract) => (
          <li key={contract._id} className="p-4 border rounded-lg shadow">
            <p><strong>Stagiaire :</strong> {contract.intern.name}</p>
            <p><strong>Date de début :</strong> {contract.startDate}</p>
            <p><strong>Date de fin :</strong> {contract.endDate}</p>
            <p><strong>Statut :</strong> {contract.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RHContracts;
