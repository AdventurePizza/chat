import './Panel.css';

import { Drawer, IconButton, Tooltip } from '@material-ui/core';

import { EmailButton } from './EmailPanel';
import { Link } from 'react-router-dom';

import { NewRoomPanelButton } from './NewChatroom';
import { PanelItemEnum } from '../types';
import { MeetingRoom } from '@material-ui/icons';
//import { SportsEsports } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import backArrowIcon from '../assets/navbar/backArrowIcon.png';
// import cameraRollIcon from '../assets/navbar/camera_roll.png';
//import emojiIcon from '../assets/navbar/emojiIcon.png';
// import roomDirectoryIcon from '../assets/navbar/roomDirectory.png';
// import soundIcon from '../assets/navbar/soundIcon.png';
// import towerIcon from '../assets/navbar/towerIcon.png';
// import weatherIcon from '../assets/navbar/weatherIcon.png';
// import poemIcon from '../assets/navbar/poemIcon.png';
import HomeIcon from '../assets/navbar/homeIcon.png';
import chatIcon from '../assets/navbar/chatIcon.png';

interface IPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onClick: (key: string | undefined) => void;
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
	const history = useHistory();

	return (
		<Drawer
			className="panel-drawer"
			variant="persistent"
			anchor="left"
			open={isOpen}
		>
			<div
				className="panel-container"
				style={window.innerHeight < 800 ? { minHeight: 'auto' } : {}}
			>
				<Tooltip title="close panel">
					<IconButton style={{ marginTop: 20 }} onClick={onClose}>
						<img
							className="panel-back-arrow"
							src={backArrowIcon}
							alt="back arrow icon"
						/>
					</IconButton>
				</Tooltip>

				<Tooltip title="home">
					<IconButton>
						<Link to="/">
							<img src={HomeIcon} alt="home avatar" className="panel-avatar" />
						</Link>
					</IconButton>
				</Tooltip>

				<div
					style={{
						backgroundColor:
							selectedItem === 'settings' ? '#87D3F3' : undefined,
						width: '100%',
						textAlign: 'center'
					}}
					className="first-step"
				>
					<IconButton
						onClick={() => {
							if (selectedItem === 'settings') {
								onClick(undefined);
								history.goBack();
							} else {
								onClick('settings');
								history.push('/settings');
							}
						}}
					>
						<div>
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
	// sound: soundIcon,
	//youtube: YouTubeIcon,
	//emoji: emojiIcon,
	// tower: towerIcon,
	// background: cameraRollIcon,
	// weather: weatherIcon,
	// poem: poemIcon
	background: chatIcon,
};

const panelIconComponentMap: {
	[key: string]: JSX.Element;
} = {
	'new-room': <NewRoomPanelButton />,
	email: (
		<div className="fifth-step">
			<EmailButton />
		</div>
	),
	//background: <Image style={{ fontSize: 32 }} />,
	//tower: <SportsEsports style={{ fontSize: 36 }} />,
	roomDirectory: (
		<div className="fourth-step">
			<MeetingRoom style={{ fontSize: 36 }} />
		</div>
	)
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
				className={
					title === 'maps' || title === 'youtube'
						? 'panel-icon-container fourth-step'
						: 'panel-icon-container'
				}
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
