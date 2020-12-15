import { Drawer, IconButton } from '@material-ui/core';
import { ITowerDefenseState, PanelItemEnum } from '../types';

import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import React from 'react';
import { TowerDefensePanel } from './TowerDefensePanel';
import cymballIcon from '../assets/cymbalIcon.svg';
import drumIcon from '../assets/drum.svg';
import gotemIcon from '../assets/gotemIcon.svg';
import guitarIcon from '../assets/guitarIcon.svg';

interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	onAction: (key: string, ...args: any[]) => void;
	towerDefenseState: ITowerDefenseState;
}

interface ISoundPairs {
	icon: string;
	type: string;
}

const emojiList: string[] = ['😍', '😎', '👏', '👀', '✨', '🎅'];

const soundList: ISoundPairs[] = [
	{ icon: drumIcon, type: 'drum' },
	{ icon: cymballIcon, type: 'cymbal' },
	{ icon: guitarIcon, type: 'guitar' },
	{ icon: gotemIcon, type: 'meme' }
];

export const BottomPanel = ({
	isOpen,
	type,
	onAction,
	towerDefenseState
}: IPanelProps) => {
	const renderPanelContent = () => {
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
				return (
					<>
						{soundList.map(({ icon, type }) => (
							<div key={icon} className="bottom-panel-sound">
								<IconButton onClick={() => onAction('sound', type)}>
									<img src={icon} alt="sound" />
								</IconButton>
							</div>
						))}
					</>
				);
			case 'gifs':
				return (
					<Gifs
						sendGif={(gif: IGif) => {
							onAction('gif', gif.id);
						}}
					/>
				);
			case 'tower defense':
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
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{renderPanelContent()}</div>
		</Drawer>
	);
};
