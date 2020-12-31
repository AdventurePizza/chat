import './Panel.css';

import { Drawer, IconButton, Tooltip } from '@material-ui/core';

import { PanelItemEnum } from '../types';
import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import backArrowIcon from '../assets/navbar/backArrowIcon.png';
import cameraRollIcon from '../assets/navbar/camera_roll.png';
import chatIcon from '../assets/navbar/chatIcon.png';
import emojiIcon from '../assets/navbar/emojiIcon.png';
import gifIcon from '../assets/navbar/gifIcon.png';
import pencilIcon from '../assets/navbar/pencil.png';
import soundIcon from '../assets/navbar/soundIcon.png';
import towerIcon from '../assets/navbar/towerIcon.png';
import animationIcon from '../assets/navbar/animation.png';

interface IPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onClick: (key: string) => void;
	selectedItem?: PanelItemEnum;
	avatar?: string;
}

export const Panel = ({
	isOpen,
	onClose,
	onClick,
	selectedItem,
	avatar
}: IPanelProps) => {
	return (
		<Drawer
			className="panel-drawer"
			variant="persistent"
			anchor="left"
			open={isOpen}
		>
			<div className="panel-container">
				<Tooltip title="close panel">
					<IconButton style={{ marginTop: 20 }} onClick={onClose}>
						<img
							className="panel-back-arrow"
							src={backArrowIcon}
							alt="back arrow icon"
						/>
					</IconButton>
				</Tooltip>

				<img src={avatar} alt="user avatar" className="panel-avatar" />

				<div className="panel-you-text">you</div>

				{Object.keys(PanelItemEnum).map((item) => (
					<PanelItem
						{...item}
						key={item}
						title={item}
						onClick={() => onClick(item)}
						isSelected={selectedItem === item}
					/>
				))}
			</div>
		</Drawer>
	);
};

const panelIconSrcMap: {
	[key: string]: string;
} = {
	sound: soundIcon,
	emoji: emojiIcon,
	gifs: gifIcon,
	chat: chatIcon,
	tower: towerIcon,
	background: cameraRollIcon,
	animation: animationIcon,
	whiteboard: pencilIcon
};

const panelIconComponentMap: {
	[key: string]: JSX.Element;
} = {
	settings: <SettingsIcon />
};

interface IPanelItemProps {
	onClick: () => void;
	title: string;
	isSelected: boolean;
}

const PanelItem = ({ title, onClick, isSelected }: IPanelItemProps) => {
	const renderPanelItem = () => {
		const iconSrc = panelIconSrcMap[title];
		const IconComponent = panelIconComponentMap[title];
		return (
			<div
				className="panel-icon-container"
				style={{ backgroundColor: isSelected ? '#87D3F3' : undefined }}
			>
				<IconButton onClick={onClick}>
					{iconSrc ? (
						<img
							src={iconSrc}
							className={`panel-icon-${title}`}
							alt={`${title} icon`}
						/>
					) : (
						<IconButton onClick={onClick}> {IconComponent}</IconButton>
					)}
				</IconButton>
			</div>
		);
	};

	return (
		<Tooltip title={title}>
			<>{renderPanelItem()}</>
		</Tooltip>
	);
};
