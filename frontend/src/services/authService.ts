
import { login, logout, register, getCurrentUser, resetPassword, sendPasswordResetEmail, AuthUser } from '../api/auth.api';

export const AuthService = {
	/**
	 * Connexion utilisateur
	 */
	login: async (email: string, password: string): Promise<AuthUser> => {
		return await login(email, password);
	},

	/**
	 * Déconnexion utilisateur
	 */
	logout: async (): Promise<void> => {
		await logout();
	},

	/**
	 * Inscription utilisateur
	 */
	register: async (name: string, email: string, password: string, role: any): Promise<AuthUser> => {
		return await register(name, email, password, role);
	},

	/**
	 * Récupérer l'utilisateur courant
	 */
	getCurrentUser: async (): Promise<AuthUser> => {
		return await getCurrentUser();
	},

	/**
	 * Réinitialiser le mot de passe
	 */
	resetPassword: async (token: string, password: string): Promise<void> => {
		await resetPassword(token, password);
	},

	/**
	 * Envoyer un email de réinitialisation
	 */
	sendPasswordResetEmail: async (email: string): Promise<void> => {
		await sendPasswordResetEmail(email);
	},
};

export { login };
 