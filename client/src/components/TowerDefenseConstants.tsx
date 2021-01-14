import towerSVG from '../assets/tower.svg';
import zombieSVG from '../assets/zombie.svg';
import pepeNarutoGIF from '../assets/pepe-naruto.gif';
import bowmanSVG from '../assets/bowman.svg';

export const ENEMY_VALUES: { [type: string]: number } = {
	grunt: 1,
	pepeNaruto: 2
};

export const BUILDING_COSTS: { [type: string]: number } = {
	basic: 5,
	bowman: 7
};

export const BUILDING_ICONS: { [type: string]: string } = {
	basic: towerSVG,
	bowman: bowmanSVG
};

export const ENEMY_ICONS: { [type: string]: string } = {
	grunt: zombieSVG,
	pepeNaruto: pepeNarutoGIF
};

export const BUILDING_TYPES = ['basic', 'bowman'];
export const ENEMY_TYPES = ['grunt', 'pepeNaruto'];
export const INITIAL_GOLD = 10;
