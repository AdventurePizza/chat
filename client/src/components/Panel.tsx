import './Panel.css';

import { Drawer, IconButton, Tooltip } from '@material-ui/core';

import { NewRoomPanelButton } from './NewChatroom';
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
import weatherIcon from '../assets/navbar/weatherIcon.png';
import animationIcon from '../assets/navbar/animation.png';
import roomDirectoryIcon from '../assets/navbar/roomDirectory.png'

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

				<div
					style={{
						backgroundColor:
							selectedItem === 'settings' ? '#87D3F3' : undefined,
						width: '100%'
					}}
				>
					<IconButton onClick={() => onClick('settings')}>
						<div className="panel-avatar-container">
							<img src={avatar} alt="user avatar" className="panel-avatar" />

							<div className="panel-you-container">
								<div className="panel-you-text">you</div>
								<SettingsIcon
									style={{
										fontSize: 16
									}}
								/>
							</div>
						</div>
					</IconButton>
				</div>

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
	whiteboard: pencilIcon,
	weather: weatherIcon,
	animation: animationIcon,
	roomDirectory: roomDirectoryIcon
};

const panelIconComponentMap: {
	[key: string]: JSX.Element;
} = {
	'new-room': <NewRoomPanelButton />
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

		const renderIconComponent = () => (
			<IconButton onClick={onClick}>{IconComponent}</IconButton>
		);
		const renderIconImage = () => (
			<div className="panel-icon-image-container">
				<IconButton onClick={onClick}>
					<img
						src={iconSrc}
						className={`panel-icon-${title}`}
						alt={`${title} icon`}
					/>
				</IconButton>
			</div>
		);

		return (
			<div
				className="panel-icon-container"
				style={{ backgroundColor: isSelected ? '#87D3F3' : undefined }}
			>
				{iconSrc && renderIconImage()}
				{IconComponent && renderIconComponent()}
				{/* <IconButton onClick={onClick}>
					{iconSrc ? (
					) : (
						// <IconButton onClick={onClick}> {IconComponent}</IconButton>
						IconComponent
					)}
				</IconButton> */}
			</div>
		);
	};

	return (
		<Tooltip title={title}>
			<>{renderPanelItem()}</>
		</Tooltip>
	);
};
