import './Panel.css';

import {
	Chat,
	ChevronRight,
	Gif,
	InsertEmoticon,
	Palette,
	// eslint-disable-next-line
	MusicNote
} from '@material-ui/icons/';
import { Drawer, IconButton, Tooltip } from '@material-ui/core';

import { PanelItemEnum } from '../types';
import React from 'react';
// import drum from "../assets/drum.svg";

const iconStyle: React.CSSProperties = {
	width: 50,
	height: 50,
	marginTop: 10
};

interface IPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onClick: (key: string) => void;
	selectedItem?: PanelItemEnum;
}

export const Panel = ({
	isOpen,
	onClose,
	onClick,
	selectedItem
}: IPanelProps) => {
	return (
		<Drawer variant="persistent" anchor="right" open={isOpen}>
			<div className="panel-container">
				<Tooltip title="close panel">
					<IconButton style={{ marginTop: 20 }} onClick={onClose}>
						<ChevronRight />
					</IconButton>
				</Tooltip>
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

interface IPanelItemProps {
	onClick: () => void;
	title: string;
	isSelected: boolean;
}

const PanelItem = ({ title, onClick, isSelected }: IPanelItemProps) => {
	const renderPanelItem = () => {
		let buttonContent;
		const style: React.CSSProperties = {
			...iconStyle,
			color: isSelected ? 'orange' : undefined
		};

		switch (title) {
			case PanelItemEnum.sound:
				buttonContent = <MusicNote style={style} />;
				break;
			case PanelItemEnum.emoji:
				buttonContent = <InsertEmoticon style={style} />;
				break;
			case PanelItemEnum.color:
				buttonContent = <Palette style={style} />;
				break;
			case PanelItemEnum.gifs:
				buttonContent = <Gif style={style} />;
				break;
			case PanelItemEnum.chat:
				buttonContent = <Chat style={style} />;
				break;
		}

		return <IconButton onClick={onClick}>{buttonContent}</IconButton>;
	};

	return (
		<Tooltip title={title}>
			<div>{renderPanelItem()}</div>
		</Tooltip>
	);
};
