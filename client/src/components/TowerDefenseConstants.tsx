import towerSVG from '../assets/tower.svg';
import zombieSVG from '../assets/zombie.svg';

export const ENEMY_VALUES: {[type: string]: number} = {
    'grunt': 1,
}      

export const BUILDING_COSTS:  {[type: string]: number} = {
    'basic': 5,
}

export const BUILDING_ICONS: {[type: string]: string} = {
    'basic': towerSVG,
}

export const ENEMY_ICONS: {[type: string]: string} = {
    'grunt': zombieSVG,
}
export const BUILDING_TYPES = ['basic'];
export const ENEMY_TYPES = ['grunt'];
export const INITIAL_GOLD = 10;