import { Drawer, IconButton } from '@material-ui/core';
import { ITowerDefenseState, PanelItemEnum } from '../types';

import BackgroundPanel from './BackgroundPanel';
import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import React from 'react';
import { SettingsPanel } from './SettingsPanel';
import SoundPanel from './SoundPanel';
import { TowerDefensePanel } from './TowerDefensePanel';
import WhiteboardPanel from './WhiteboardPanel';
import { Weather } from './Weather';

export interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	setBrushColor: (color: string) => void;
	onAction: (key: string, ...args: any[]) => void;
	towerDefenseState: ITowerDefenseState;
	updateIsTyping: (isTyping: boolean) => void;
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
	setBrushColor,
	onAction,
	towerDefenseState,
	updateIsTyping
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
						updateIsTyping={updateIsTyping}
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
						gold={towerDefenseState.gold}
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
			case 'whiteboard':
				return <WhiteboardPanel setBrushColor={setBrushColor} />;
			case 'settings':
				return (
					<SettingsPanel
						onSubmitUrl={(url) => onAction('settings', 'url', url)}
						onChangeName={(name) => onAction('settings', 'name', name)}
					/>
				);
			case 'weather':
				return (
					<Weather sendLocation={(location) => onAction('weather', location)} />
				);
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{renderPanelContent()}</div>
		</Drawer>
	);
};
