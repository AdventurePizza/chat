import { Box, Button } from '@material-ui/core';
import React from 'react';
import towerSVG from '../assets/tower.svg';

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
			<img
				onClick={(event) => {
					event.stopPropagation();
					onClick('basic');
				}}
				src={towerSVG}
				style={{ cursor: 'pointer' }}
				className="tower-building"
				alt="tower"
			/>
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
