import {
	BUILDING_COSTS,
	BUILDING_ICONS,
	BUILDING_TYPES
} from './TowerDefenseConstants';
import { Box, Button } from '@material-ui/core';

import React from 'react';
import goldPNG from '../assets/gold.png';

interface ITowerDefensePanelProps {
	isStarted: boolean;
	gold: number;
	onStart: () => void;
	onSelectTower: (key: string) => void;
}

export const TowerDefensePanel = (props: ITowerDefensePanelProps) => {
	const { isStarted, gold, onStart, onSelectTower } = props;

	return isStarted ? (
		<div className="tower-defense-panel">
			<GoldPanel gold={gold} />
			<TowerList onClick={onSelectTower} />
		</div>
	) : (
		<div className="tower-defense-panel">
			<Button onClick={onStart} variant="contained">
				Start Game
			</Button>
		</div>
	);
};

interface ITowerListProps {
	onClick: (key: string) => void;
}

const TowerList = ({ onClick }: ITowerListProps) => {
	return (
		<div className="tower-defense-panel-list">
			{BUILDING_TYPES.map((type: string) => (
				<div style={{ width: '75px', height: '100%' }}>
					<div style={{ width: '100%', textAlign: 'center' }}>
						Cost: {BUILDING_COSTS[type]}
					</div>
					<img
						key={type}
						onClick={(event) => {
							event.stopPropagation();
							onClick(type);
						}}
						src={BUILDING_ICONS[type]}
						style={{ cursor: 'pointer' }}
						className="tower-defense-panel-building-item"
						alt="tower"
					/>
				</div>
			))}
		</div>
	);
};

interface IGoldPanel {
	gold: number;
}

const GoldPanel = ({ gold }: IGoldPanel) => {
	return (
		<Box
			style={{
				height: '100%',
				marginBottom: '2px',
				display: 'flex',
				fontSize: 50
			}}
		>
			<img src={goldPNG} alt="gold" height="75px" width="75px" />
			{gold}
		</Box>
	);
};
