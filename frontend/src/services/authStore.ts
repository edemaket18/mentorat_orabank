import { useState, useEffect } from 'react';
import { AuthService } from './authService';
import { AuthUser } from '../api/auth.api';

export function useAuthStore() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem('authUser');
		if (stored) {
			setUser(JSON.parse(stored));
			setLoading(false);
		} else {
			AuthService.getCurrentUser()
				.then(u => {
					setUser(u);
					localStorage.setItem('authUser', JSON.stringify(u));
				})
				.catch(() => setUser(null))
				.finally(() => setLoading(false));
		}
	}, []);

	const login = async (email: string, password: string) => {
		setError(null);
		setLoading(true);
		try {
			const u = await AuthService.login(email, password);
			setUser(u);
			localStorage.setItem('authUser', JSON.stringify(u));
			return u;
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Erreur de connexion');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await AuthService.logout();
		setUser(null);
		localStorage.removeItem('authUser');
	};

	const register = async (name: string, email: string, password: string, role: 'intern' | 'mentor') => {
		setError(null);
		setLoading(true);
		try {
			const u = await AuthService.register(name, email, password, role);
			setUser(u);
			localStorage.setItem('authUser', JSON.stringify(u));
			return u;
		} catch (err: any) {
			setError(err?.response?.data?.message || "Erreur d'inscription");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { user, loading, error, login, logout, register };
}