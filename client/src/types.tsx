import { IGif } from '@giphy/js-types';

export type PinTypes = 'gif' | 'race' | 'background' | 'image' | 'video' | 'text' | 'NFT' | 'map' | 'chat'| 'horse' | 'musicPlayer' | 'tweet'; 


export interface IBackgroundState {
	type?: 'image' | 'map' | 'race' | 'marketplace' | 'video';
	name?: string;
	isPinned?: boolean;
	mapData?: IMap;
	raceId?: string;
	videoId?: string;
}

export interface IPinnedItem {
	type: PinTypes;
	top: number;
	left: number;
	key?: string;
	data?: IGif;
	mapData?: IMap;
	[key: string]: any;
}

export interface IChatRoom {
	name: string;
	isLocked?: boolean;
	lockedOwnerAddress?: string;
}

export type AnimationTypes = 'start game' | 'info' | 'end game';
export interface IAnimation {
	type: AnimationTypes;
	text?: string;
}

export interface ITweet {
	id: string;
	left: number;
	top: number;
	isPinned?: boolean;
	
}
export interface IAvatarChatMessages {
	[userId: string]: string[];
}

export interface IMessageEvent {
	key:
		| 'horse'
		| 'sound'
		| 'youtube'
		| 'emoji'
		| 'chat'
		| 'chat-pin'
		| 'gif'
		| 'image'
		| 'tower defense'
		| 'background'
		| 'messages'
		| 'send-race'
		| 'whiteboard'
		| 'animation'
		| 'isTyping'
		| 'username'
		| 'avatar'
		| 'currentRoom'
		| 'weather'
		| 'map'
		| 'settings-url'
		| 'pin-item'
		| 'move-item'
		| 'unpin-item'
		| 'poem'
		| 'tweet'
		| 'change-playlist'
		| 'clear-field';
		
	value?: any;
	[key: string]: any;
	xt: number;
	yt: number;
}

export interface IFigure {
	key: string;
	type: 'gryphon';
}

export interface IEmojiDict {
	name: string;
	url?: string;
	speed?: number; // Not Part of dictionary, intermediary for transmitting state to all users
}

export interface IEmoji {
	top: number;
	left: number;
	key: string;
	dict: IEmojiDict;
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

export interface IBoardImage {
	top: number;
	left: number;
	key: string;
	url: string;
	isPinned?: boolean;
}

export interface IBoardVideo {
	top: number;
	left: number;
	key: string;
	url: string;
	isPinned?: boolean;
	isPlaying?: boolean;
}

export interface IHorse{
	bloodline: string;
	breed_type: string;
	breeding_counter: string;
	breeding_cycle_reset: string;
	class: string;
	genotype: string;
	color: string;
	hex_code: string;
	name: string;
	horse_type: string;
	img_url: string;
	is_approved_for_racing: string;
	is_in_stud: string;
	is_on_racing_contract: string;
	mating_price: string;
	number_of_races: string;
	owner: string;
	owner_stable: string;
	owner_stable_slug: string;
	rating: string;
	super_coat: string;
	tx: string;
	tx_date: string;
	win_rate: string;
}

export interface IBoardHorse {
	top: number;
	left: number;
	horseData: IHorse;
	key: string;
	isPinned?: boolean;
	id: string;
}

export interface IGifs {
	top: number;
	left: number;
	key: string;
	data: IGif;
	isPinned?: boolean;
}

export enum PanelItemEnum {
	'roomDirectory' = 'roomDirectory',
	'settings' = 'settings',
	'background' = 'background',
	'weather' = 'weather',
	'poem' = 'poem',
	'sound' = 'sound',
	'email' = 'email',
	'new-room' = 'new-room',
	'tower' = 'tower',
	'emoji' = 'emoji',
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
	hideAvatar?: boolean;
	message?: string;
	isTyping?: boolean;
	weather?: IWeather;
	soundType?: string;
	musicMetadata?: IMetadata;
	currentRoom?: string;
	email: string;
	location: string;
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

export interface IWeather {
	temp: string;
	condition: string;
}

export interface IPoem {
	key: string;
	value: string;
}

export interface IFetchResponseBase {
	message?: string;
	isSuccessful: boolean;
}

export interface IOrder {
	ownerAddress: string;
	priceEth: string;
	tokenId: number;
	id: string;
	contractAddress: string;
	isPartnered: boolean;
}

export interface IMap {
	coordinates: { lat: number; lng: number };
	markers: Array<{ lat: number; lng: number; text?: string }>;
	zoom: number;
}

export interface INFTMetadata {
	image: string;
	name: string;
	contractName: string;
	lockedId?: string;
}

export interface IWaterfallMessage{
	avatar: string;
	message: string;
	name: string;
}

export interface IWaterfallChat{
	top: number;
	left: number;
	messages: IWaterfallMessage[];
	show: boolean;
}

export interface IChatroomData {
	roomData: IChatRoom;
	background?: any;
}

export interface IPlaylist{
	timestamp: string;
	url: string;
	name: string;
}

export interface IMusicPlayer{
	top: number;
	left: number;
	playlist: IPlaylist[];
}

export type OrderWithMetadata = IOrder & { metadata?: INFTMetadata };

export type newPanelTypes= 'chat' | 'google' | 'unsplash' | 'giphy' | 'youtube' | 'maps' | 'marketplace' | 'race' | 'horse' | 'music' |'+NFT';
