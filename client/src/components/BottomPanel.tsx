import { Drawer, IconButton } from '@material-ui/core';

import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import { PanelItemEnum } from '../types';
import React from 'react';
import SoundPanel from './SoundPanel';

export interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	onAction: (key: string, ...args: any[]) => void;
}

export interface ISoundPairs {
	icon: string;
	type: string;
	category: string;
}

const emojiList: string[] = ['😍', '😎', '👏', '👀', '✨', '🎅'];

export const BottomPanel = ({ isOpen, type, onAction }: IPanelProps) => {
	const RenderPanelContent = () => {
		switch (type) {
			case 'emoji':
				return (
					<>
						{emojiList.map((emoji) => (
							<div key={emoji} className="bottom-panel-emoji">
								<IconButton onClick={() => onAction('emoji', emoji)}>
									{emoji}
								</IconButton>
							</div>
						))}
					</>
				);

			case 'chat':
				return (
					<Chat
						sendMessage={(message) => {
							onAction('chat', message);
						}}
					/>
				);
			case 'sound':
				return <SoundPanel sendSound={onAction} />;

			case 'gifs':
				return (
					<Gifs
						sendGif={(gif: IGif) => {
							onAction('gif', gif.id);
						}}
					/>
				);
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{RenderPanelContent()}</div>
		</Drawer>
	);
};
