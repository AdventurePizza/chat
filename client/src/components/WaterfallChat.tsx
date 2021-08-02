import React, { useEffect, useRef } from 'react';
import { IWaterfallMessage } from '../types';
import { Box, Avatar } from '@material-ui/core';
import { avatarMap } from './UserCursors';

interface IWaterfallChatProps {
	chat: IWaterfallMessage[];
}

export const WaterfallChat = ({ chat }: IWaterfallChatProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		if (messagesEndRef && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(scrollToBottom, [chat]);

	let boxColors: Array<string> = [
		'primary.main',
		'secondary.main',
		'success.main',
		'text.primary'
	];

	return (
		<div>
			<Box
				color="primary.main"
				style={{
					maxWidth: 300,
					maxHeight: 30,
					minWidth: 300,
					minHeight: 30,
					fontSize: 20,
					textAlign: 'center'
				}}
			>
				{' '}
				CHAT{' '}
			</Box>
			<div style={{ overflowY: 'auto', maxHeight: 300 }}>
				{chat.map((ch, index) => (
					<div key={index.toString()} style={{ width: 300, clear: 'left' }}>
						{
							<Box
								color={
									boxColors[ch.avatar.charCodeAt(ch.avatar.length - 1) % 4]
								}
								mt={5}
								style={{ fontSize: 16 }}
							>
								<Avatar
									alt={ch.avatar}
									src={avatarMap[ch.avatar]}
									style={{ float: 'left' }}
								/>{' '}
								{ch.message}
							</Box>
						}
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};
