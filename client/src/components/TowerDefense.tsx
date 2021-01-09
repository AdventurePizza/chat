import './TowerDefense.css';

import {
	BUILDING_ICONS,
	ENEMY_ICONS,
	ENEMY_VALUES
} from './TowerDefenseConstants';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
	ITowerBuilding,
	ITowerDefenseState,
	ITowerProjectile,
	ITowerUnit
} from '../types';

import React from 'react';
import castle from '../assets/castle.png';
import projectileSVG from '../assets/projectile.svg';

export type Actions = 'hit enemy';

interface ITowerDefenseProps {
	state: ITowerDefenseState;
	updateUnits: (units: ITowerUnit[]) => void;
	updateProjectiles: (projectiles: ITowerProjectile[]) => void;
	updateGold: (gold: number) => void;
}

export const TowerDefense = (props: ITowerDefenseProps) => {
	const {
		state: { towers, units, projectiles, gold, isPlaying },
		updateUnits,
		updateProjectiles,
		updateGold
	} = props;

	return (
		<div>
			{towers.map((tower) => (
				<Tower {...tower} />
			))}

			<TransitionGroup>
				{units.map((unit) => (
					<CSSTransition
						key={unit.key}
						timeout={10000}
						classNames="tower-unit-transition"
						onEntered={() => {
							const index = units.findIndex((_unit) => _unit.key === unit.key);
							updateUnits([
								...units.slice(0, index),
								...units.slice(index + 1)
							]);
						}}
					>
						<Unit {...unit} />
					</CSSTransition>
				))}
			</TransitionGroup>

			<TransitionGroup>
				{projectiles.map((projectile) => (
					<CSSTransition
						key={projectile.key}
						timeout={300}
						classNames="projectile-transition"
						onEntering={(node: HTMLElement) => {
							const { startPos, endPos } = projectile;

							node.style.top = startPos.y + 'px';
							node.style.left = startPos.x + 'px';
							node.style.transform = `translate(${endPos.x - startPos.x}px, ${
								endPos.y - startPos.y
							}px)`;
						}}
						onEntered={() => {
							const index = projectiles.findIndex(
								(_projectile) => _projectile.key === projectile.key
							);
							updateProjectiles([
								...projectiles.slice(0, index),
								...projectiles.slice(index + 1)
							]);

							const toDeleteUnitIndex = units.findIndex(
								(unit) => unit.key === projectile.unitKey
							);

							if (toDeleteUnitIndex !== -1) {
								updateGold(gold + ENEMY_VALUES[units[toDeleteUnitIndex].type]);
								updateUnits([
									...units.slice(0, toDeleteUnitIndex),
									...units.slice(toDeleteUnitIndex + 1)
								]);
							}
						}}
					>
						<img
							style={{
								width: 30,
								height: 30,
								position: 'absolute'
							}}
							src={projectileSVG}
							alt="projectile"
						/>
					</CSSTransition>
				))}
			</TransitionGroup>
			{isPlaying && (
				<img
					alt="castle"
					src={castle}
					style={{
						width: 200,
						position: 'absolute',
						right: 0,
						top: window.innerHeight / 2 - 100
					}}
				/>
			)}
		</div>
	);
};

export const Tower = ({ top, left, type }: ITowerBuilding) => {
	return (
		<img
			src={BUILDING_ICONS[type]}
			style={{
				top,
				left
			}}
			className="tower-building"
			alt="tower"
		/>
	);
};

// const Unit = React.forwardRef(({ top, left }: ITowerUnit), ref) => {
const Unit = React.forwardRef(
	({ top, left, type }: ITowerUnit, ref: React.Ref<HTMLImageElement>) => {
		return (
			<img
				ref={ref}
				src={ENEMY_ICONS[type]}
				style={{
					top,
					left
				}}
				className="tower-building"
				alt="zombie"
			/>
		);
	}
);
