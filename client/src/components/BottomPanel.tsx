import { Drawer, IconButton, Avatar, } from '@material-ui/core';

import { Chat } from './Chat';
import { PanelItemEnum } from '../types';
import React from 'react';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import { images } from './Images';

import cymballIcon from '../assets/cymbalIcon.svg';
import drumIcon from '../assets/drum.svg';
import guitarIcon from '../assets/guitarIcon.svg';
import gotemIcon from '../assets/gotemIcon.svg';

interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	onAction: (key: string, ...args: any[]) => void;
}

interface ISoundPairs {
	icon: string;
	type: string;
}

const emojiList: string[] = ['😍', '😎', '👏', '👀', '✨', '🦃'];

let timers: number[] = [0];
let currentTimer: number;


const soundList: ISoundPairs[] = [
	{ icon: drumIcon, type: 'drum' },
	{ icon: cymballIcon, type: 'cymbal' },
	{ icon: guitarIcon, type: 'guitar' },
	{ icon: gotemIcon, type: 'meme' }
];

export const BottomPanel = ({ isOpen, type, onAction }: IPanelProps) => {
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
			case 'background':
				return (
					<>
						{images.map(({ key, src }) => (
							<div key={key} className="bottom-panel-background">
								<IconButton onClick={() => {
									clearTimeout(timers[0]); // clear any existing timers
									onAction('background', key); //send background image to app.tsx
									currentTimer = window.setTimeout(() => { // get current timer id
										console.log('in setTimeout');
										onAction('background', 'undefined'); // send undefined image to app.tsx after 1 minute
									}, 60000);
									timers[0] = currentTimer; // store current timer id for clearing if new image is selected
								}}>
									<Avatar 
										variant="rounded"
										src={ src }
									/>
								</IconButton>
							</div>
						))}
					</>	
				);
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{renderPanelContent()}</div>
		</Drawer>
	);
};
