import './TowerDefense.css';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
	ITowerBuilding,
	ITowerDefenseState,
	ITowerProjectile,
	ITowerUnit
} from '../types';

import React from 'react';
import projectileSVG from '../assets/projectile.svg';
import towerSVG from '../assets/tower.svg';
import zombieSVG from '../assets/zombie.svg';

export type Actions = 'hit enemy';

interface ITowerDefenseProps {
	state: ITowerDefenseState;
	onAction: (action: Actions) => void;
	updateUnits: (units: ITowerUnit[]) => void;
	updateProjectiles: (projectiles: ITowerProjectile[]) => void;
}

export const TowerDefense = (props: ITowerDefenseProps) => {
	const {
		state: { towers, units, projectiles },
		onAction,
		updateUnits,
		updateProjectiles
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
						classNames="figure-transition"
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

							console.log('entering!', node);
							node.style.top = startPos.y + 'px';
							node.style.left = startPos.x + 'px';
							node.style.transform = `translate(${endPos.x - startPos.x}px, ${
								endPos.y - startPos.y
							}px)`;
							console.log(
								'translate is ',
								`translate(${endPos.x - startPos.x}px, ${
									endPos.y - startPos.y
								}px)`
							);
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
								updateUnits([
									...units.slice(0, toDeleteUnitIndex),
									...units.slice(toDeleteUnitIndex + 1)
								]);
							}
						}}
					>
						{/* <Projectile {...projectile} /> */}
						<img
							style={{
								width: 30,
								height: 30,
								position: 'absolute'
								// transform: 'translate(50px, 100px)'
								// transition: 'transform 5s'
							}}
							src={projectileSVG}
						/>
					</CSSTransition>
				))}
			</TransitionGroup>
		</div>
	);
};

export const Tower = ({ top, left }: ITowerBuilding) => {
	return (
		<img
			src={towerSVG}
			style={{
				top,
				left
			}}
			className="tower-building"
		/>
	);
};

// const Unit = React.forwardRef(({ top, left }: ITowerUnit), ref) => {
const Unit = React.forwardRef(
	({ top, left }: ITowerUnit, ref: React.Ref<HTMLImageElement>) => {
		return (
			<img
				ref={ref}
				src={zombieSVG}
				style={{
					top,
					left
				}}
				className="tower-building"
			/>
		);
	}
);
