import { Button } from '@material-ui/core';
import React from 'react';
import towerSVG from '../assets/tower.svg';

interface ITowerDefensePanelProps {
	isStarted: boolean;
	onStart: () => void;
	onSelectTower: (key: string) => void;
}

export const TowerDefensePanel = (props: ITowerDefensePanelProps) => {
	const { isStarted, onStart, onSelectTower } = props;

	return (
		<div className="tower-defense-panel">
			{isStarted ? (
				<TowerList onClick={onSelectTower} />
			) : (
				<Button onClick={onStart} variant="contained">
					Start Game
				</Button>
			)}
		</div>
	);
};

interface ITowerListProps {
	onClick: (key: string) => void;
}

const TowerList = ({ onClick }: ITowerListProps) => {
	return (
		<div className="tower-defense-panel-list">
			<img
				onClick={() => onClick('basic')}
				src={towerSVG}
				style={{ cursor: 'pointer' }}
				className="tower-building"
				alt="tower"
			/>
		</div>
	);
};
