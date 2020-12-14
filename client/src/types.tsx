import { IGif } from '@giphy/js-types';
export interface IMessageEvent {
	key: 'sound' | 'emoji' | 'chat' | 'gif' | 'background';
	value?: string;
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
}

export interface ISound {
	drum: string;
	cymbal: string;
	guitar: string;
	meme: string;
}

export interface IGifs {
	top: number;
	left: number;
	key: string;
	data: IGif;
}

export interface IBackground {
	key: string;
	src: string;
}

export enum PanelItemEnum {
	'sound' = 'sound',
	'emoji' = 'emoji',
	'color' = 'color',
	'gifs' = 'gifs',
	'chat' = 'chat',
	'background' = 'background'
}
