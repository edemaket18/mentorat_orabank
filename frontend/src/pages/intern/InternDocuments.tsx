 import React, { useState, useEffect } from 'react';
import httpClient from '@api/httpClient';

interface DocumentFile {
  _id: string;
  filename: string;
  uploadedAt: string;
  url: string;
}

const InternDocuments: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await httpClient.post('/intern/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Erreur de téléversement :', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await httpClient.get<DocumentFile[]>('/intern/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error('Erreur de récupération des documents :', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Documents</h2>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="border p-1"
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Déposer
        </button>
      </div>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc._id} className="border p-2 rounded-md bg-white shadow-sm">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
              {doc.filename}
            </a>
            <p className="text-xs text-gray-500">
              Uploadé le {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternDocuments;