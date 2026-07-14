import React, { useEffect, useState } from 'react';
import { getReports, deleteReport } from '@api/report.api';
import { Report } from '@api/report.api';

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des rapports.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce rapport ?')) {
      try {
        await deleteReport(id);
        setReports(reports.filter((r) => r._id !== id));
      } catch {
        alert('Erreur lors de la suppression du rapport.');
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Liste des rapports</h2>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Status</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.title}</td>
              <td>{report.author}</td>
              <td>{report.status}</td>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(report._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reports.length === 0 && <div>Aucun rapport trouvé.</div>}
    </div>
  );
};

export default ReportList;
