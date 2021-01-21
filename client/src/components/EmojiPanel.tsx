import { IconButton, Slider } from '@material-ui/core';
import React, { useState } from 'react';
import { IEmojiDict } from '../types';

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

interface IEmojiPanelProps {
	onClick: (data: IEmojiDict) => void;
}

const EmojiPanel = ({ onClick }: IEmojiPanelProps) => {
	const [speed, setSpeed] = useState(1000);

	return (
		<div className="emoji-container">
			<div className="emoji-settings-container">
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
					className="emoji-speed-slider"
				/>
			</div>
			<div className="emoji-list">
				{emojiList.map((emoji) => (
					<div key={emoji.name} className="bottom-panel-emoji">
						<IconButton onClick={() => onClick({ ...emoji, speed })}>
							{emoji.url ? (
								<img src={emoji.url} alt={emoji.name} width="24" />
							) : (
								emoji.name
							)}
						</IconButton>
					</div>
				))}
			</div>
		</div>
	);
};

export default EmojiPanel;
