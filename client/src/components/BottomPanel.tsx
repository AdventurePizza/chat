import { Drawer, IconButton } from '@material-ui/core';
import { ITowerDefenseState, PanelItemEnum } from '../types';

import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import React from 'react';
import SoundPanel from './SoundPanel';
import { TowerDefensePanel } from './TowerDefensePanel';
import BackgroundPanel from './BackgroundPanel';
import AnimationPanel from './AnimationPanel'

export interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	onAction: (key: string, ...args: any[]) => void;
	towerDefenseState: ITowerDefenseState;
}

export interface ISoundPairs {
	icon: string;
	type: string;
	category: string;
}

const emojiList: string[] = ['😍', '😎', '👏', '👀', '✨', '🎅'];

export const BottomPanel = ({
	isOpen,
	type,
	onAction,
	towerDefenseState
}: IPanelProps) => {
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
			case 'tower':
				return (
					<TowerDefensePanel
						isStarted={towerDefenseState.isPlaying}
						onStart={() =>
							onAction('tower defense', {
								key: 'tower defense',
								value: 'start'
							})
						}
						onSelectTower={(towerValue: string) =>
							onAction('tower defense', {
								key: 'tower defense',
								value: 'select tower',
								tower: towerValue
							})
						}
					/>
				);
			case 'background':
				return <BackgroundPanel sendBackground={onAction} />;
			case 'animation':
				return <AnimationPanel sendAnimation={onAction} />;
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{RenderPanelContent()}</div>
		</Drawer>
	);
};
