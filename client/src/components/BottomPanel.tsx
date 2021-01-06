import { Drawer, IconButton, Slider, Typography } from '@material-ui/core';
import { IEmojiDict, ITowerDefenseState, PanelItemEnum } from '../types';
import BackgroundPanel from './BackgroundPanel';
import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import React, { useState } from 'react';
import { SettingsPanel } from './SettingsPanel';
import SoundPanel from './SoundPanel';
import { TowerDefensePanel } from './TowerDefensePanel';
import WhiteboardPanel from './WhiteboardPanel';

export interface IPanelProps {
	bottomPanelRef: React.RefObject<HTMLDivElement>;
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

const emojiList: IEmojiDict[] = [
	{ name: '😍' },
	{ name: '😎' },
	{ name: '👏' },
	{ name: '👀' },
	{ name: '✨' },
	{ name: '🎅' },
	{
		name: 'powerup',
		url:
			'https://emojis.slackmojis.com/emojis/images/1450731407/227/powerup.gif?1450731407'
	},
	{
		name: 'sonic',
		url:
			'https://emojis.slackmojis.com/emojis/images/1450372448/149/sonic.gif?1450372448'
	},
	{
		name: 'stonks',
		url:
			'https://emojis.slackmojis.com/emojis/images/1589323974/9036/stonks.png?1589323974'
	},
	{
		name: 'bananadance',
		url:
			'https://emojis.slackmojis.com/emojis/images/1450694616/220/bananadance.gif?1450694616'
	},
	{
		name: 'bongocat',
		url:
			'https://emojis.slackmojis.com/emojis/images/1537458244/4708/bongo_cat_drumming.gif?1537458244'
	},
	{
		name: 'doge',
		url:
			'https://emojis.slackmojis.com/emojis/images/1520808873/3643/cool-doge.gif?1520808873'
	}
];

export const BottomPanel = ({
	bottomPanelRef,
	isOpen,
	type,
	setBrushColor,
	onAction,
	towerDefenseState,
	updateIsTyping
}: IPanelProps) => {
	const [speed, setSpeed] = useState(1000);

	const renderPanelContent = () => {
		switch (type) {
			case 'emoji':
				return (
					<>
						{emojiList.map((emoji) => (
							<div key={emoji.name} className="bottom-panel-emoji">
								<IconButton
									onClick={() => onAction('emoji', { ...emoji, speed })}
								>
									{emoji.url ? (
										<img src={emoji.url} alt={emoji.name} width="24" />
									) : (
										emoji.name
									)}
								</IconButton>
							</div>
						))}
						{/*<div className="bottom-panel-emoji">
							<IconButton>...</IconButton>
						</div>*/}
						<div
							style={{
								marginLeft: '3rem',
								marginTop: '1rem'
							}}
						>
							<Typography>Speed</Typography>
							<Slider
								value={speed}
								min={1000}
								max={10000}
								step={1000}
								onChange={(e, value) => {
									if (typeof value === 'number') setSpeed(value);
								}}
								valueLabelDisplay="auto"
								valueLabelFormat={(x) => x / 1000}
							/>
						</div>
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
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div ref={bottomPanelRef} className="bottom-panel-container">
				{renderPanelContent()}
			</div>
		</Drawer>
	);
};
