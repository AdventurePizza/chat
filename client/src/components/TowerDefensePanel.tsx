import { Box, Button } from '@material-ui/core';
import React from 'react';
import towerSVG from '../assets/tower.svg';
import { BUILDING_COSTS, BUILDING_TYPES } from './TowerDefenseConstants';

interface ITowerDefensePanelProps {
	isStarted: boolean;
	scores: number;
	onStart: () => void;
	onSelectTower: (key: string) => void;
}

export const TowerDefensePanel = (props: ITowerDefensePanelProps) => {
	const { isStarted, scores, onStart, onSelectTower } = props;

	return (
		<div className="tower-defense-panel">
			{isStarted ? (
				<div className="tower-defense-panel">
					<ScorePanel scores = {scores} />
					<TowerList onClick={onSelectTower} />
				</div>
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
			{BUILDING_TYPES.map((type: string) => (
					<img 
						key={type}
						onClick={(event) => {
							event.stopPropagation();
							onClick(type);
						}}
						src={towerSVG}
						style={{ cursor: 'pointer'}}
						className="tower-building"
						alt="tower"
					/>
			))}
		</div>
	);
};

interface ITowerScoreProps {
	scores: number;
}

const ScorePanel = ({scores}: ITowerScoreProps) => {
	return (
		<Box style={{height: "100%", marginBottom: "2px", justifyContent: "flex", fontSize:50}}>
			{scores}
		</Box>
	)
}
