import React, { useState } from 'react';
import { Intern } from '../../api/intern.api';

interface ProfileFormProps {
	initialData?: Partial<Intern>;
	onSubmit?: (data: Partial<Intern>) => void;
	loading?: boolean;
	error?: string | null;
}

const defaultState: Partial<Intern> = {
	name: '',
	email: '',
	field: '',
	startDate: '',
	endDate: '',
	status: 'online',
};

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData = {}, onSubmit, loading = false, error }) => {
	const [form, setForm] = useState<Partial<Intern>>({ ...defaultState, ...initialData });
	const [formError, setFormError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const validate = () => {
		if (!form.name || !form.email || !form.field || !form.startDate) {
			return 'Tous les champs obligatoires doivent être remplis.';
		}
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email!)) {
			return "L'email n'est pas valide.";
		}
		return null;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		const validationError = validate();
		if (validationError) {
			setFormError(validationError);
			return;
		}
		onSubmit && onSubmit(form);
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
			<div className="form-group">
				<label htmlFor="name">Nom complet</label>
				<input
					type="text"
					id="name"
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="Votre nom complet"
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form.email}
					onChange={handleChange}
					placeholder="exemple@email.com"
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="field">Domaine</label>
				<input
					type="text"
					id="field"
					name="field"
					value={form.field}
					onChange={handleChange}
					placeholder="Informatique, Marketing, ..."
					required
				/>
			</div>
			<div className="form-row">
				<div className="form-group">
					<label htmlFor="startDate">Date de début</label>
					<input
						type="date"
						id="startDate"
						name="startDate"
						value={form.startDate}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="endDate">Date de fin</label>
					<input
						type="date"
						id="endDate"
						name="endDate"
						value={form.endDate}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className="form-group">
				<label htmlFor="status">Statut</label>
				<select
					id="status"
					name="status"
					value={form.status}
					onChange={handleChange}
				>
					<option value="online">En ligne</option>
					<option value="offline">Hors ligne</option>
					<option value="away">Absent</option>
				</select>
			</div>
			{(formError || error) && (
				<div className="auth-error">{formError || error}</div>
			)}
			<button className="auth-button" type="submit" disabled={loading}>
				{loading ? <span className="auth-spinner" /> : 'Enregistrer'}
			</button>
		</form>
	);
};

export default ProfileForm;
