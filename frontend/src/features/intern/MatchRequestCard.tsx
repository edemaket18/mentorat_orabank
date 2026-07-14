
import React from 'react';
import { Match } from '../../types';

interface MatchRequestCardProps {
	match: Match;
	onAccept?: (id: string) => void;
	onReject?: (id: string) => void;
}

const statusColors: Record<string, string> = {
	pending: '#ff9800',
	accepted: '#4caf50',
	rejected: '#f44336',
};

export const MatchRequestCard: React.FC<MatchRequestCardProps> = ({ match, onAccept, onReject }) => {
	return (
		<div className="card" style={{ maxWidth: 400, margin: '1rem auto', position: 'relative' }}>
			<h3 style={{ marginBottom: 8 }}>Demande de matching</h3>
			<p><strong>Mentor :</strong> {match.mentor?.name || 'Inconnu'}</p>
			<p><strong>Stagiaire :</strong> {match.intern?.name || 'Inconnu'}</p>
			<p>
				<strong>Statut :</strong>{' '}
				<span style={{
					color: 'white',
					background: statusColors[match.status],
					borderRadius: 8,
					padding: '2px 10px',
					fontWeight: 600,
					fontSize: 13,
				}}>
					{match.status === 'pending' ? 'En attente' : match.status === 'accepted' ? 'Acceptée' : 'Refusée'}
				</span>
			</p>
			<p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
				Créée le {new Date(match.createdAt).toLocaleDateString('fr-FR')}
			</p>
			{match.status === 'pending' && (
				<div style={{ display: 'flex', gap: 12 }}>
					<button
						className="auth-button"
						style={{ background: '#4caf50', flex: 1 }}
						onClick={() => onAccept && onAccept(match._id)}
					>
						Accepter
					</button>
					<button
						className="auth-button"
						style={{ background: '#f44336', flex: 1 }}
						onClick={() => onReject && onReject(match._id)}
					>
						Refuser
					</button>
				</div>
			)}
		</div>
	);
};

export default MatchRequestCard;
