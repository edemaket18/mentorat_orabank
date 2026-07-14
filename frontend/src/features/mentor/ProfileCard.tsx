
import React from 'react';
import { Mentor } from '../../api/mentor.api';

interface ProfileCardProps {
	mentor: Mentor;
	actions?: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ mentor, actions }) => {
	return (
		<div className="card" style={{ maxWidth: 370, margin: '1.5rem auto', position: 'relative' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
				<img
					src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=1976d2&color=fff`}
					alt={mentor.name}
					style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1976d2' }}
				/>
				<div>
					<h3 style={{ margin: 0 }}>{mentor.name}</h3>
					<div style={{ fontSize: 14, color: '#666' }}>{mentor.email}</div>
					<div style={{ fontSize: 13, color: mentor.available ? '#388e3c' : '#d32f2f', fontWeight: 600 }}>
						{mentor.available ? 'Disponible' : 'Indisponible'}
					</div>
				</div>
			</div>
			{mentor.bio && <p style={{ fontSize: 15, color: '#444', marginBottom: 12 }}>{mentor.bio}</p>}
			{mentor.expertise && mentor.expertise.length > 0 && (
				<div style={{ marginBottom: 12 }}>
					<strong>Expertises :</strong>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
						{mentor.expertise.map((exp) => (
							<span key={exp} style={{
								background: '#e3f2fd',
								color: '#1976d2',
								borderRadius: 6,
								padding: '2px 10px',
								fontSize: 13,
								fontWeight: 500,
							}}>{exp}</span>
						))}
					</div>
				</div>
			)}
			{actions && <div style={{ marginTop: 16 }}>{actions}</div>}
		</div>
	);
};

export default ProfileCard;
 