 import React, { useEffect, useState } from 'react';
import httpClient from '@api/httpClient';

interface Contract {
  _id: string;
  internName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export const InternContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await httpClient.get<Contract[]>('/intern/contracts');
        setContracts(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des contrats :', error);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Contrats</h2>
      <div className="overflow-x-auto"><table className="w-full text-left border min-w-[560px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Stagiaire</th>
            <th className="p-2">Début</th>
            <th className="p-2">Fin</th>
            <th className="p-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract._id}>
              <td className="p-2">{contract.internName}</td>
              <td className="p-2">{new Date(contract.startDate).toLocaleDateString()}</td>
              <td className="p-2">{new Date(contract.endDate).toLocaleDateString()}</td>
              <td className="p-2">{contract.status}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
};

export default InternContracts;