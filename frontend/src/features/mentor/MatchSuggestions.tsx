import React from 'react';
import { Matching } from '../../api/matching.api';

interface MatchSuggestionsProps {
	suggestions: Matching[];
	onRequest?: (internId: string) => void;
	loadingId?: string;
}

const MatchSuggestions: React.FC<MatchSuggestionsProps> = ({ suggestions, onRequest, loadingId }) => {
	return (
		<div style={{ maxWidth: 600, margin: '0 auto' }}>
			<h3 style={{ textAlign: 'center', margin: '1.5rem 0' }}>Suggestions de stagiaires à matcher</h3>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
				{suggestions.length === 0 && (
					<div style={{ color: '#888', textAlign: 'center' }}>Aucune suggestion disponible</div>
				)}
				{suggestions.map((sugg) => (
					<div key={sugg.intern._id} className="card" style={{ minWidth: 260, maxWidth: 320 }}>
						<h4 style={{ marginBottom: 8 }}>{sugg.intern.name}</h4>
						<p style={{ fontSize: 14, color: '#666' }}>ID: {sugg.intern._id}</p>
						<p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Statut: {sugg.status === 'pending' ? 'En attente' : sugg.status === 'active' ? 'Accepté' : 'Terminé'}</p>
						<button
							className="auth-button"
							style={{ width: '100%' }}
							disabled={loadingId === sugg.intern._id || sugg.status !== 'pending'}
							onClick={() => onRequest && onRequest(sugg.intern._id)}
						>
							{loadingId === sugg.intern._id ? <span className="auth-spinner" /> : 'Envoyer une demande'}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default MatchSuggestions;