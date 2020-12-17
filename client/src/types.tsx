import { IGif } from '@giphy/js-types';

export type AnimationTypes = 'start game' | 'info' | 'end game';
export interface IAnimation {
	type: AnimationTypes;
	text?: string;
}

export interface IMessageEvent {
	key: 'sound' | 'emoji' | 'chat' | 'gif' | 'tower defense';
	value?: string;
	[key: string]: any;
}

export interface IFigure {
	key: string;
	type: 'gryphon';
}

export interface IEmoji {
	top: number;
	left: number;
	key: string;
	type: string;
}

export interface IChatMessage {
	top: number;
	left: number;
	key: string;
	value: string;
	isCentered?: boolean;
}

export interface ISound {
	[key: string]: string;
	// Instrument
	drum: string;
	cymbal: string;
	guitar: string;
	trumpet: string;
	gong: string;
	harp: string;
	// Funny
	meme: string;
	noice: string;
	stop_it: string;
	ahh: string;
	air: string;
	applause: string;
	groan: string;
	clang: string;
	horn: string;
	laugh: string;
	// Nature
	bee: string;
	dog: string;
	flying_fox: string;
	lightning: string;
	nature: string;
	sealion: string;
	water: string;
}

export interface IGifs {
	top: number;
	left: number;
	key: string;
	data: IGif;
}

export enum PanelItemEnum {
	'sound' = 'sound',
	'emoji' = 'emoji',
	// 'color' = 'color',
	'gifs' = 'gifs',
	'chat' = 'chat',
	'tower defense' = 'tower defense'
}

export interface IUserLocations {
	[userId: string]: { x: number; y: number };
}

export interface IUserProfiles {
	[clientId: string]: { name: string; avatar: string };
}

export interface ITowerUnit {
	key: string;
	type: 'grunt';
	top: number;
	left: number;
	ref: React.RefObject<HTMLImageElement>;
}

export interface ITowerBuilding {
	key: string;
	type: 'basic';
	top: number;
	left: number;
}

export interface ITowerProjectile {
	key: string;
	towerKey: string;
	unitKey: string;
	startPos: { x: number; y: number };
	endPos: { x: number; y: number };
}
export interface ITowerDefenseState {
	isPlaying: boolean;
	units: ITowerUnit[];
	towers: ITowerBuilding[];
	selectedPlacementTower?: ITowerBuilding;
	projectiles: ITowerProjectile[];
}
