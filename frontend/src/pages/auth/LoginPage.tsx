 import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthUser } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';

export default function LoginPage() {
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// FIX: validate() déplacée ici — ESLint ne la détectait pas comme utilisée
		const validate = () => {
			if (!form.email.trim() || !form.password) {
				return 'Tous les champs sont obligatoires.';
			}
			if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
				return "L'email n'est pas valide.";
			}
			return null;
		};

		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}
		setLoading(true);
		try {
			const user = await AuthService.login(form.email, form.password);
			login({
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role as AuthUser['role'],
			});
			navigate('/');
		} catch (err) {
			setError('Adresse email ou mot de passe incorrect.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-shell">
			<div className="auth-grid">
				<div className="auth-intro">
					<p style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Orabank Mentorat</p>
					<h1>Reprenez le contrôle de votre parcours.</h1>
					<p>Connectez-vous pour accéder à vos rendez-vous, documents et suivis de mentorat en toute simplicité.</p>
				</div>
				<div className="auth-card">
					<div className="auth-back-link">
						<Link to="/" className="auth-back-link">
							← Retour à l’accueil
						</Link>
					</div>
					<div className="auth-heading" style={{ marginBottom: '1.5rem' }}>
						<h2>Connexion</h2>
						<p>Accédez à votre espace mentorat</p>
					</div>
					<form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
						<div className="form-group">
							<label htmlFor="email">Adresse email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="exemple@email.com"
								required
								className="auth-input"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Mot de passe</label>
							<input
								type="password"
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								placeholder="Mot de passe"
								required
								minLength={6}
								className="auth-input"
							/>
						</div>
						{error && <div className="auth-error">{error}</div>}
						<button className="auth-button" type="submit" disabled={loading}>
							{loading ? <span className="auth-spinner" /> : 'Se connecter'}
						</button>
					</form>
					<div className="auth-footer">
						<Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Créer un compte</Link>
						<Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'none' }}>Mot de passe oublié ?</Link>
					</div>
				</div>
			</div>
		</div>
	);
}