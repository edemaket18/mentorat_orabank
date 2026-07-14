import React, { useState } from 'react';
import { createReport } from '../../api/report.api';

interface ReportUploaderProps {
	onSuccess?: () => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onSuccess }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const validate = () => {
		if (!title.trim() || !description.trim()) {
			return 'Titre et description obligatoires.';
		}
		if (!file) {
			return 'Veuillez joindre un fichier.';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}
		setLoading(true);
		try {
			// Simuler l'envoi du fichier (à adapter selon backend)
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('file', file!);
			// Remplacer par un appel API réel si backend prêt
			await new Promise((res) => setTimeout(res, 1200));
			// await createReport({ title, description, ... });
			setSuccess(true);
			setTitle('');
			setDescription('');
			setFile(null);
			onSuccess && onSuccess();
		} catch (err: any) {
			setError("Erreur lors de l'envoi du rapport.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
			<h3 style={{ textAlign: 'center', marginBottom: 20 }}>Déposer un rapport</h3>
			<div className="form-group">
				<label htmlFor="title">Titre du rapport</label>
				<input
					type="text"
					id="title"
					name="title"
					value={title}
					onChange={e => setTitle(e.target.value)}
					placeholder="Titre du rapport"
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					name="description"
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder="Décrivez le contenu du rapport..."
					required
					rows={4}
					style={{ resize: 'vertical', width: '100%' }}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="file">Fichier à joindre</label>
				<input
					type="file"
					id="file"
					name="file"
					accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
					onChange={handleFileChange}
				/>
				{file && <small>Fichier sélectionné : {file.name}</small>}
			</div>
			{error && <div className="auth-error">{error}</div>}
			{success && <div className="auth-error" style={{ color: '#388e3c', background: '#e8f5e9' }}>Rapport envoyé avec succès !</div>}
			<button className="auth-button" type="submit" disabled={loading}>
				{loading ? <span className="auth-spinner" /> : 'Envoyer'}
			</button>
		</form>
	);
};

export default ReportUploader;
