import React from 'react';
import { IconButton, Avatar } from '@material-ui/core';
import { backgroundIcons } from './BackgroundImages';

interface IBackgroundPannelProps {
	sendBackground: (backgroundText: string, backgroundType: string) => void;
}

const BackgroundPanel = ({ sendBackground }: IBackgroundPannelProps) => {
	const displayIcons = Object.keys(backgroundIcons).map(backgroundName => {
		const backgroundIcon = backgroundIcons[backgroundName];
		return (
			<IconButton
				key={backgroundName}
				onClick={() => sendBackground('background', backgroundName)}
			>
				<Avatar
					variant="rounded"
					src={backgroundIcon}
					alt={backgroundName + ' background'}
				/>
			</IconButton>
		);
	});

	return (
		<div className="sound-container">
			<div className="sound-icon-list">{displayIcons}</div>
		</div>
	);
};

export default BackgroundPanel;
