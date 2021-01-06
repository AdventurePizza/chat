import { IGif } from '@giphy/js-types';

export type PinTypes = 'gif';

export interface IPinnedItem {
	type: PinTypes;
	top: number;
	left: number;
	key: string;
	data: IGif;
}

export interface IChatRoom {
	name: string;
}

export type AnimationTypes = 'start game' | 'info' | 'end game';
export interface IAnimation {
	type: AnimationTypes;
	text?: string;
}

export interface IAvatarChatMessages {
	[userId: string]: string[];
}

export interface IMessageEvent {
	key:
		| 'sound'
		| 'emoji'
		| 'chat'
		| 'gif'
		| 'tower defense'
		| 'background'
		| 'messages'
		| 'whiteboard'
		| 'animation'
		| 'isTyping'
		| 'username'
		| 'settings-url'
		| 'pin-item'
		| 'unpin-item';
	value?: any;
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

export interface IBackgrounds {
	[key: string]: string | undefined;
	butterflys: string;
	grey_board: string;
	ice: string;
	mountain: string;
	nature: string;
	night_sky: string;
	stones: string;
	tree: string;
	tiles: string;
	triangles: string;
}

export interface ITextAnimation {
	[key: string]: string | undefined;
	schoolPride: string;
	fireworks: string;
	confetti: string;
	snow: string;
}

export interface IGifs {
	top: number;
	left: number;
	key: string;
	data: IGif;
	isPinned?: boolean;
}

export enum PanelItemEnum {
	'settings' = 'settings',
	'sound' = 'sound',
	'emoji' = 'emoji',
	// 'color' = 'color',
	'gifs' = 'gifs',
	'chat' = 'chat',
	'tower' = 'tower',
	'background' = 'background',
	'animation' = 'animation',
	'whiteboard' = 'whiteboard',
	'new-room' = 'new-room'
}

export interface IUserLocations {
	[userId: string]: { x: number; y: number };
}

export interface IMetadata {
	description: string;
	icon: string;
	image: string;
	title: string;
	url: string;
	type: string;
	provider: string;
}
export interface IUserProfile {
	name: string;
	avatar: string;
	message?: string;
	isTyping?: boolean;
	musicMetadata?: IMetadata;
}

export interface IUserProfiles {
	[clientId: string]: IUserProfile;
}

export interface ITowerUnit {
	key: string;
	type: string;
	top: number;
	left: number;
	value: number;
	ref: React.RefObject<HTMLImageElement>;
}

export interface ITowerBuilding {
	key: string;
	type: string;
	top: number;
	left: number;
	cost: number;
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
	gold: number;
}
