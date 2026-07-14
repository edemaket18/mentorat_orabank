import React from 'react';
import { Conversation, Message } from '../../types';

interface ChatListProps {
	conversations: Conversation[];
	messages?: Record<string, Message[]>; // messages par conversationId
	onSelect?: (conversationId: string) => void;
	selectedId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, messages = {}, onSelect, selectedId }) => {
	return (
		<div style={{ maxWidth: 350, margin: '0 auto' }}>
			<h3 style={{ textAlign: 'center', margin: '1rem 0' }}>Conversations</h3>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{conversations.length === 0 && (
					<li style={{ textAlign: 'center', color: '#888' }}>Aucune conversation</li>
				)}
				{conversations.map((conv) => {
					const lastMsg = messages[conv._id]?.[messages[conv._id].length - 1];
					return (
						<li
							key={conv._id}
							className="card"
							style={{
								marginBottom: 16,
								background: selectedId === conv._id ? '#e3f2fd' : undefined,
								cursor: 'pointer',
								border: selectedId === conv._id ? '2px solid #1976d2' : undefined,
								transition: 'background 0.2s, border 0.2s',
							}}
							onClick={() => onSelect && onSelect(conv._id)}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								{conv.participantAvatar && (
									<img
										src={conv.participantAvatar}
										alt={conv.participantName}
										style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
									/>
								)}
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 600 }}>{conv.participantName}</div>
									<div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
										{lastMsg ? (
											<>
												<span style={{ color: '#1976d2', fontWeight: 500 }}>{lastMsg.sender}:</span> {lastMsg.text || lastMsg.content}
												<span style={{ float: 'right', fontSize: 11, color: '#aaa' }}>
													{new Date(lastMsg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
												</span>
											</>
										) : (
											<span style={{ color: '#aaa' }}>Aucun message</span>
										)}
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default ChatList;
