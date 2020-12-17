import { ISound } from '../types';
import ahh from '../assets/sounds/funny/ahh.mp3';
import air from '../assets/sounds/funny/air.mp3';
import applause from '../assets/sounds/funny/applause.mp3';
import bee from '../assets/sounds/nature/bee.mp3';
import clang from '../assets/sounds/funny/clang.mp3';
import cymbalHit from '../assets/sounds/instruments/cymbal.mp3';
import dog from '../assets/sounds/nature/dog.mp3';
import drumBeat from '../assets/sounds/instruments/drumbeat.mp3';
import flying_fox from '../assets/sounds/nature/flying-fox.mp3';
import gong from '../assets/sounds/instruments/chinese-gong.wav';
import gotEm from '../assets/sounds/funny/ha-got-eeem.mp3';
import groan from '../assets/sounds/funny/groan.mp3';
import guitarStrum from '../assets/sounds/instruments/electric_guitar.mp3';
import harp from '../assets/sounds/instruments/harp.wav';
import horn from '../assets/sounds/funny/horn.mp3';
import laugh from '../assets/sounds/funny/laugh.mp3';
import lightning from '../assets/sounds/nature/lightning.mp3';
import nature from '../assets/sounds/nature/nature.mp3';
import noice from '../assets/sounds/funny/noice.mp3';
import sealion from '../assets/sounds/nature/sealion.mp3';
import stop_it_get_some_help from '../assets/sounds/funny/stop_it_get_some_help.mp3';
import trumpet from '../assets/sounds/instruments/trumpet.mp3';
import water from '../assets/sounds/nature/water.mp3';

export { cymbalHit };

export const sounds: ISound = {
	// Instrument
	drum: drumBeat,
	cymbal: cymbalHit,
	guitar: guitarStrum,
	trumpet: trumpet,
	gong: gong,
	harp: harp,
	// Funny
	meme: gotEm,
	noice: noice,
	stop_it: stop_it_get_some_help,
	ahh: ahh,
	air: air,
	applause: applause,
	groan: groan,
	clang: clang,
	horn: horn,
	laugh: laugh,
	// Nature
	bee: bee,
	dog: dog,
	flying_fox: flying_fox,
	lightning: lightning,
	nature: nature,
	sealion: sealion,
	water: water
};
