import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';

export default function Chat() {
	const [searchParams] = useSearchParams();
	const proposalId = searchParams.get('proposalId');
	const { user } = useAuth();
	const navigate = useNavigate();

	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState('');
	const socketRef = useRef<Socket | null>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}

		const fetchMessages = async () => {
			try {
				if (!proposalId) return;
				const res = await api.get(`/api/messages`, { params: { proposalId } });
				setMessages(res.data || []);
			} catch (err) {
				console.error('Failed to load messages', err);
			}
		};

		fetchMessages();

		// Connect socket
		const socket = io();
		socketRef.current = socket;

		const room = proposalId ? `proposal-${proposalId}` : null;
		if (room) {
			socket.emit('join', room);
		}

		socket.on('message', (msg: any) => {
			// incoming message for this room
			setMessages((prev) => [...prev, msg]);
		});

		return () => {
			if (room) socket.emit('leave', room);
			socket.disconnect();
			socketRef.current = null;
		};
	}, [proposalId, user, navigate]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (!text.trim()) return;
		try {
			const payload = { proposalId, content: text };
			const res = await api.post('/api/messages', payload);

			// append sent message (server will emit to others)
			setMessages((prev) => [...prev, res.data]);
			// Emit via socket as well to speed up real-time
			if (socketRef.current && proposalId) {
				socketRef.current.emit('message', { room: `proposal-${proposalId}`, message: res.data });
			}
			setText('');
		} catch (err) {
			console.error('Failed to send message', err);
			alert('Erro ao enviar mensagem');
		}
	};

	return (
		<Layout>
			<div className="container py-8">
				<h1 className="text-2xl font-bold mb-4">Chat {proposalId ? `- Proposta ${proposalId}` : ''}</h1>

				<div className="border rounded-lg p-4 max-w-3xl mx-auto">
					<div className="space-y-3 max-h-96 overflow-auto mb-3">
						{messages.map((m, i) => (
							<div key={i} className={`p-2 rounded ${m.sender_id === user?.id ? 'bg-primary/10 ml-auto max-w-[80%]' : 'bg-muted/20 mr-auto max-w-[80%]'}`}>
								<div className="text-sm text-muted-foreground mb-1">{m.sender_name || (m.sender_id === user?.id ? 'Você' : 'Outro')}</div>
								<div className="whitespace-pre-wrap">{m.content || m.message || m.text}</div>
								<div className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					<div className="flex gap-2">
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
							className="flex-1 border rounded px-3 py-2"
							placeholder="Escreva sua mensagem..."
						/>
						<button onClick={handleSend} className="bg-primary text-white px-4 py-2 rounded">Enviar</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
