 import { getMentorStats, getMentorReview } from '../api/mentor.api';
import { getAllInterns, getAllMentors } from '../api/rh.api';
import { getMentorships, getAllMentorships } from '../api/mentorship.api';
import httpClient from '../api/httpClient';

export const statisticsService = {
	/**
	 * Récupérer les statistiques d'un mentor (nombre de stagiaires, feedbacks, note moyenne...)
	 */
	getMentorStats: async (mentorId: string) => {
		return await getMentorStats(mentorId);
	},

	/**
	 * Récupérer la note moyenne d'un mentor
	 */
	getMentorReview: async () => {
		return await getMentorReview();
	},

	/**
	 * Récupérer tous les stagiaires
	 */
	getAllInterns: async () => {
		return await getAllInterns();
	},

	/**
	 * Récupérer tous les mentors
	 */
	getAllMentors: async () => {
		return await getAllMentors();
	},

	/**
	 * Récupérer tous les mentorats
	 */
	getAllMentorships: async () => {
		return await getAllMentorships();
	},

	/**
	 * Récupérer les mentorats de l'utilisateur courant
	 */
	getMentorships: async () => {
		return await getMentorships();
	},
};

/**
 * Récupérer les statistiques d'un stagiaire
 */
export const getInternStatistics = async () => {
	const response = await httpClient.get('/intern/statistics');
	return response.data;
};