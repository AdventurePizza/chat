import { IBackgrounds } from '../types';
import butterflys from '../assets/backgrounds/butterflys.jpg';
import grey_board from '../assets/backgrounds/grey_board.jpg';
import ice from '../assets/backgrounds/ice.jpg';
import mountain from '../assets/backgrounds/mountain.jpg';
import nature from '../assets/backgrounds/nature.jpg';
import night_sky from '../assets/backgrounds/night_sky.jpg';
import stones from '../assets/backgrounds/stones.jpg';
import tiles from '../assets/backgrounds/tiles.jpg';
import tree from '../assets/backgrounds/tree.jpg';
import triangles from '../assets/backgrounds/triangles.png';

export const backgroundIcons: IBackgrounds = {
	butterflys: butterflys,
	grey_board: grey_board,
	ice: ice,
	mountain: mountain,
	nature: nature,
	night_sky: night_sky,
	stones: stones,
	tree: tree,
	tiles: tiles,
	triangles: triangles
};

export const backgrounds: IBackgrounds = {
	...backgroundIcons,
	undefined: undefined
};
