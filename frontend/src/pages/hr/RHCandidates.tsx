import React, { useEffect, useState } from 'react';
import { getAllApplications, approveApplication } from '@api/rh.api';
import { Application } from '@api/rh.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

const RHCandidates: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveApplication(id);
      fetchApplications(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Candidatures de stage</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <Card key={app._id}>
            <CardContent className="space-y-2">
              <p><strong>Nom :</strong> {app.name}</p>
              <p><strong>Email :</strong> {app.email}</p>
              <p><strong>Motivation :</strong> {app.message}</p>
              <Button onClick={() => handleApprove(app._id)}>Approuver</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RHCandidates;
