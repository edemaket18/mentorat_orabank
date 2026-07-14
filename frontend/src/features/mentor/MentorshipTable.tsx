
import React from 'react';
import { Mentorship } from '../../api/mentorship.api';

interface MentorshipTableProps {
	mentorships: Mentorship[];
	onEnd?: (id: string) => void;
	loadingId?: string;
}

const statusColors: Record<string, string> = {
	'en cours': '#1976d2',
	'terminé': '#388e3c',
	'en attente': '#ff9800',
};

const MentorshipTable: React.FC<MentorshipTableProps> = ({ mentorships, onEnd, loadingId }) => {
	return (
		<div style={{ overflowX: 'auto', maxWidth: '100%' }}>
			<h3 style={{ textAlign: 'center', margin: '1.5rem 0' }}>Mes mentorats</h3>
			<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
				<thead>
					<tr style={{ background: '#f5f7fa' }}>
						<th style={{ padding: 10, textAlign: 'left' }}>Stagiaire</th>
						<th style={{ padding: 10, textAlign: 'left' }}>Début</th>
						<th style={{ padding: 10, textAlign: 'left' }}>Fin</th>
						<th style={{ padding: 10, textAlign: 'left' }}>Statut</th>
						<th style={{ padding: 10, textAlign: 'left' }}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{mentorships.length === 0 && (
						<tr>
							<td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 20 }}>
								Aucun mentorat trouvé
							</td>
						</tr>
					)}
					{mentorships.map((m) => (
						<tr key={m._id} style={{ borderBottom: '1px solid #eee' }}>
							<td style={{ padding: 10 }}>{m.intern?.name || m.intern?.fullName || 'Inconnu'}</td>
							<td style={{ padding: 10 }}>{new Date(m.startDate).toLocaleDateString('fr-FR')}</td>
							<td style={{ padding: 10 }}>{m.endDate ? new Date(m.endDate).toLocaleDateString('fr-FR') : '-'}</td>
							<td style={{ padding: 10 }}>
								<span style={{
									color: 'white',
									background: statusColors[m.status],
									borderRadius: 8,
									padding: '2px 10px',
									fontWeight: 600,
									fontSize: 13,
								}}>
									{m.status}
								</span>
							</td>
							<td style={{ padding: 10 }}>
								{m.status === 'en cours' && (
									<button
										className="auth-button"
										style={{ background: '#d32f2f', minWidth: 90 }}
										disabled={loadingId === m._id}
										onClick={() => onEnd && onEnd(m._id)}
									>
										{loadingId === m._id ? <span className="auth-spinner" /> : 'Terminer'}
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MentorshipTable;
 