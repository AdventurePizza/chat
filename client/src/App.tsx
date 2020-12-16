import './App.css';

import {
	IChatMessage,
	IEmoji,
	IFigure,
	IGifs,
	IMessageEvent,
	ISound,
	IUserLocations,
	IUserProfiles,
	PanelItemEnum
} from './types';
import { IconButton, Tooltip } from '@material-ui/core';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';

import { Board } from './components/Board';
import { BottomPanel } from './components/BottomPanel';
import { ChevronLeft } from '@material-ui/icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IMusicNoteProps } from './components/MusicNote';
import { Panel } from './components/Panel';
import { UserCursor } from './components/UserCursors';
import _ from 'underscore';
//@ts-ignore
import ahh from './assets/sounds/funny/ahh.mp3';
//@ts-ignore
import air from './assets/sounds/funny/air.mp3';
//@ts-ignore
import applause from './assets/sounds/funny/applause.mp3';
// Sound imports
//@ts-ignore
import audioEnter from './assets/sounds/zap-enter.mp3'; //@ts-ignore
import audioExit from './assets/sounds/zap-exit.mp3'; //@ts-ignore
// Nature
import bee from './assets/sounds/nature/bee.mp3'; //@ts-ignore
import clang from './assets/sounds/funny/clang.mp3'; //@ts-ignore
// Instruments
import cymbalHit from './assets/sounds/instruments/cymbal.mp3'; //@ts-ignore
import dog from './assets/sounds/nature/dog.mp3'; //@ts-ignore
import drumBeat from './assets/sounds/instruments/drumbeat.mp3'; //@ts-ignore
import flying_fox from './assets/sounds/nature/flying-fox.mp3'; //@ts-ignore
import gong from './assets/sounds/instruments/chinese-gong.wav'; //@ts-ignore
// Funny
import gotEm from './assets/sounds/funny/ha-got-eeem.mp3'; //@ts-ignore
import groan from './assets/sounds/funny/groan.mp3'; //@ts-ignore
import guitarStrum from './assets/sounds/instruments/electric_guitar.mp3'; //@ts-ignore
import harp from './assets/sounds/instruments/harp.wav'; //@ts-ignore
import horn from './assets/sounds/funny/horn.mp3'; //@ts-ignore
import io from 'socket.io-client';
//@ts-ignore
import laugh from './assets/sounds/funny/laugh.mp3'; //@ts-ignore
import lightning from './assets/sounds/nature/lightning.mp3'; //@ts-ignore
import nature from './assets/sounds/nature/nature.mp3'; //@ts-ignore
import noice from './assets/sounds/funny/noice.mp3'; //@ts-ignore
import sealion from './assets/sounds/nature/sealion.mp3'; //@ts-ignore
import stop_it_get_some_help from './assets/sounds/funny/stop_it_get_some_help.mp3'; //@ts-ignore
import trumpet from './assets/sounds/instruments/trumpet.mp3'; //@ts-ignore
import { v4 as uuidv4 } from 'uuid';
//@ts-ignore
import water from './assets/sounds/nature/water.mp3';

const isDebug = false;

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://adventure-chat.herokuapp.com';

isDebug && console.log('socket url = ', socketURL);

const socket = io(socketURL, { transports: ['websocket'] });

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
const GIF_FETCH = new GiphyFetch(API_KEY);

const sounds: ISound = {
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

function App() {
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);
	const [emojis, setEmojis] = useState<IEmoji[]>([]);
	const [gifs, setGifs] = useState<IGifs[]>([]);
	const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
	const [selectedPanelItem, setSelectedPanelItem] = useState<
		PanelItemEnum | undefined
	>(PanelItemEnum.chat);

	const audio = useRef<HTMLAudioElement>(new Audio(cymbalHit));
	const audioNotification = useRef<HTMLAudioElement>();

	const [userLocations, setUserLocations] = useState<IUserLocations>({});
	const [userProfiles, setUserProfiles] = useState<IUserProfiles>({});
	const [userProfile, setUserProfile] = useState<{
		name: string;
		avatar: string;
	}>();
	const userCursorRef = React.createRef<HTMLDivElement>();

	const [figures, setFigures] = useState<IFigure[]>([]);

	const playEmoji = useCallback((type: string) => {
		const { x, y } = generateRandomXY();

		setEmojis((emojis) =>
			emojis.concat({ top: y, left: x, key: uuidv4(), type })
		);
	}, []);

	const playTutorial = async () => {
		tutorialGifs.forEach((gif) => {
			setTimeout(async () => {
				const data = await GIF_FETCH.gif(gif.id);
				const { x, y } = generateRandomXY(true);

				const newGif: IGifs = {
					top: y,
					left: x,
					key: uuidv4(),
					data: data.data
				};

				setGifs((gifs) => gifs.concat(newGif));
			}, gif.time);
		});

		for (let i = 0; i < tutorialMessages.length; i++) {
			setChatMessages((messages) =>
				messages.concat({
					top: window.innerHeight * 0.1 + i * 25,
					left: window.innerWidth / 2 - tutorialMessages[i].length * 5,
					key: uuidv4(),
					value: tutorialMessages[i],
					isCentered: true
				})
			);

			await sleep(1000);
		}
	};

	const playSound = useCallback(
		(soundType) => {
			switch (soundType) {
				// Instrument
				case 'drum':
					audio.current = new Audio(sounds.drum);
					break;
				case 'cymbal':
					audio.current = new Audio(sounds.cymbal);
					break;
				case 'guitar':
					audio.current = new Audio(sounds.guitar);
					break;
				case 'trumpet':
					audio.current = new Audio(sounds.trumpet);
					break;
				case 'gong':
					audio.current = new Audio(sounds.gong);
					break;
				case 'harp':
					audio.current = new Audio(sounds.harp);
					break;
				// Funny
				case 'meme':
					audio.current = new Audio(sounds.meme);
					break;
				case 'noice':
					audio.current = new Audio(sounds.noice);
					break;
				case 'stop_it':
					audio.current = new Audio(sounds.stop_it);
					break;
				case 'ahh':
					audio.current = new Audio(sounds.ahh);
					break;
				case 'air':
					audio.current = new Audio(sounds.air);
					break;
				case 'applause':
					audio.current = new Audio(sounds.applause);
					break;
				case 'groan':
					audio.current = new Audio(sounds.groan);
					break;
				case 'clang':
					audio.current = new Audio(sounds.clang);
					break;
				case 'horn':
					audio.current = new Audio(sounds.horn);
					break;
				case 'laugh':
					audio.current = new Audio(sounds.laugh);
					break;
				// Nature
				case 'bee':
					audio.current = new Audio(sounds.bee);
					break;
				case 'dog':
					audio.current = new Audio(sounds.dog);
					break;
				case 'flying_fox':
					audio.current = new Audio(sounds.flying_fox);
					break;
				case 'lightning':
					audio.current = new Audio(sounds.lightning);
					break;
				case 'nature':
					audio.current = new Audio(sounds.nature);
					break;
				case 'sealion':
					audio.current = new Audio(sounds.sealion);
					break;
				case 'water':
					audio.current = new Audio(sounds.water);
					break;
				default:
					// This should be impossible
					break;
			}

			if (!audio || !audio.current) return;

			const randomX = Math.random() * window.innerWidth;
			const randomY = Math.random() * window.innerHeight;

			setMusicNotes((notes) =>
				notes.concat({ top: randomY, left: randomX, key: uuidv4() })
			);

			audio.current.currentTime = 0;
			audio.current.play();
		},
		[
			audio,
			sounds.drum,
			sounds.cymbal,
			sounds.guitar,
			sounds.trumpet,
			sounds.gong,
			sounds.harp,
			sounds.meme,
			sounds.noice,
			sounds.stop_it,
			sounds.ahh,
			sounds.air,
			sounds.applause,
			sounds.groan,
			sounds.clang,
			sounds.horn,
			sounds.laugh,
			sounds.bee,
			sounds.dog,
			sounds.flying_fox,
			sounds.lightning,
			sounds.nature,
			sounds.sealion,
			sounds.water
		]
	);

	const onClickPanelItem = (key: string) => {
		switch (key) {
			case 'sound':
			case 'emoji':
			case 'chat':
			case 'gifs':
				setSelectedPanelItem(
					selectedPanelItem === key ? undefined : (key as PanelItemEnum)
				);

				break;
		}
	};

	const addChatMessage = useCallback((message: string) => {
		const { x, y } = generateRandomXY(true);
		const newMessage: IChatMessage = {
			top: y,
			left: x,
			key: uuidv4(),
			value: message
		};
		setChatMessages((chatMessages) => chatMessages.concat(newMessage));
	}, []);

	const addGif = useCallback((gifId: string) => {
		const { x, y } = generateRandomXY(true);
		GIF_FETCH.gif(gifId).then((data) => {
			const newGif: IGifs = {
				top: y,
				left: x,
				key: uuidv4(),
				data: data.data
			};
			setGifs((gifs) => gifs.concat(newGif));
		});
	}, []);

	const updateCursorPosition = useMemo(
		() =>
			_.throttle((position: [number, number]) => {
				socket.emit('cursor move', { x: position[0], y: position[1] });
			}, 200),
		[]
	);

	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			const x = event.clientX;
			const y = event.clientY;

			const width = window.innerWidth;
			const height = window.innerHeight;

			const relativeX = (x - 60) / width;
			const relativeY = (y - 60) / height;

			updateCursorPosition([relativeX, relativeY]);

			if (userCursorRef.current) {
				userCursorRef.current.style.left = x - 30 + 'px';
				userCursorRef.current.style.top = y - 30 + 'px';
			}
		},
		[updateCursorPosition, userCursorRef]
	);

	const onKeyPress = useCallback((event: KeyboardEvent) => {
		if (event.ctrlKey && event.code === 'KeyQ') {
			setFigures((figures) =>
				figures.concat({
					key: uuidv4(),
					type: 'gryphon'
				})
			);
		}
	}, []);

	useEffect(() => {
		playTutorial();

		// spawn gryphon randomly
		setInterval(() => {
			if (Math.random() < 0.1) {
				setFigures((figures) =>
					figures.concat({
						key: uuidv4(),
						type: 'gryphon'
					})
				);
			}
		}, 10000);
	}, []);

	useEffect(() => {
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('keypress', onKeyPress);
	}, [onMouseMove, onKeyPress]);

	const onCursorMove = useCallback(function cursorMove(
		clientId: string,
		[x, y]: number[],
		clientProfile: { name: string; avatar: string }
	) {
		const width = window.innerWidth;
		const height = window.innerHeight;

		const absoluteX = width * x;
		const absoluteY = height * y;

		setUserLocations((userLocations) => {
			const newUserLocations = {
				...userLocations,
				[clientId]: {
					...userLocations[clientId],
					x: absoluteX,
					y: absoluteY
				}
			};

			return newUserLocations;
		});

		setUserProfiles((userProfiles) => ({
			...userProfiles,
			[clientId]: {
				...clientProfile
			}
		}));
	},
	[]);

	useEffect(() => {
		function onConnect() {
			isDebug && console.log('connected to socket');
		}

		const onMessageEvent = (message: IMessageEvent) => {
			switch (message.key) {
				case 'sound':
					playSound(message.value);
					break;
				case 'emoji':
					if (message.value) {
						playEmoji(message.value);
					}
					break;
				case 'chat':
					if (message.value) {
						addChatMessage(message.value);
					}
					break;
				case 'gif':
					if (message.value) {
						addGif(message.value);
					}
					break;
			}
		};

		const onProfileInfo = (clientProfile: { name: string; avatar: string }) => {
			setUserProfile(clientProfile);
		};

		const onRoomateDisconnect = (clientId: string) => {
			setUserLocations((userLocations) => {
				const newUserLocations = {
					...userLocations
				};

				delete newUserLocations[clientId];

				return newUserLocations;
			});

			audioNotification.current = new Audio(audioExit);
			audioNotification.current.currentTime = 0;
			audioNotification.current.play();
		};

		const onNewUser = () => {
			audioNotification.current = new Audio(audioEnter);
			audioNotification.current.currentTime = 0;
			audioNotification.current.play();
		};

		socket.on('new user', onNewUser);
		socket.on('roommate disconnect', onRoomateDisconnect);
		socket.on('profile info', onProfileInfo);
		socket.on('cursor move', onCursorMove);
		socket.on('connect', onConnect);
		socket.on('event', onMessageEvent);

		return () => {
			socket.off('roomate disconnect', onRoomateDisconnect);
			socket.off('profile info', onProfileInfo);
			socket.off('cursor move', onCursorMove);
			socket.off('connect', onConnect);
			socket.off('event', onMessageEvent);
		};
	}, [
		playEmoji,
		playSound,
		addChatMessage,
		addGif,
		onCursorMove,
		audioNotification
	]);

	const actionHandler = (key: string, ...args: any[]) => {
		switch (key) {
			case 'chat':
				const chatValue = args[0] as string;
				socket.emit('event', {
					key: 'chat',
					value: chatValue
				});
				break;
			case 'emoji':
				const emoji = args[0] as string;
				playEmoji(emoji);
				socket.emit('event', {
					key: 'emoji',
					value: emoji
				});
				break;
			case 'sound':
				const soundType = args[0] as string;

				playSound(soundType);

				socket.emit('event', {
					key: 'sound',
					value: soundType
				});
				break;
			case 'gif':
				const gif = args[0] as string;
				socket.emit('event', {
					key: 'gif',
					value: gif
				});
				break;
			default:
				break;
		}
	};

	return (
		<div className="app" style={{ minHeight: window.innerHeight - 10 }}>
			<Board
				musicNotes={musicNotes}
				updateNotes={setMusicNotes}
				emojis={emojis}
				updateEmojis={setEmojis}
				gifs={gifs}
				updateGifs={setGifs}
				chatMessages={chatMessages}
				updateChatMessages={setChatMessages}
				userLocations={userLocations}
				userProfiles={userProfiles}
				figures={figures}
				updateFigures={setFigures}
			/>

			<div className="open-panel-button">
				{!isPanelOpen && (
					<Tooltip title="open panel">
						<IconButton
							onClick={() => {
								setIsPanelOpen(true);
							}}
						>
							<ChevronLeft />
						</IconButton>
					</Tooltip>
				)}
			</div>
			<Panel
				onClick={onClickPanelItem}
				isOpen={isPanelOpen}
				onClose={() => {
					setIsPanelOpen(false);
				}}
				selectedItem={selectedPanelItem}
			/>

			<Tooltip title="production: leo, mike, yinbai, and krishang">
				<div className="adventure-logo">
					<div>adventure</div>
					<div>corp</div>
				</div>
			</Tooltip>

			<BottomPanel
				type={selectedPanelItem}
				isOpen={Boolean(selectedPanelItem)}
				onAction={actionHandler}
			/>

			{userProfile && (
				<UserCursor
					ref={userCursorRef}
					avatar={userProfile.avatar}
					name={userProfile.name}
				/>
			)}
		</div>
	);
}

export default App;

const sleep = async (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));

const tutorialMessages = [
	'built with web sockets',
	'anyone visiting the url',
	'can see 👀 & hear 👂',
	'the various actions',
	'text',
	'audio',
	'emojis 🙌',
	'gifs',
	'etc',
	'try !',
	'😊send to a friend !😊',
	'coming soon: ',
	'ethereum integrations',
	'chat rooms',
	'video channels',
	'games 🎮',
	'etc',
	'have fun',
	'try with friends, share www.trychats.com'
];

const tutorialGifs = [
	{
		id: 'cPZ582I9Mxtk6crJ37',
		time: 0
	},
	{
		id: 'l4pT6w42S93xNKz2U',
		time: 3000
	},
	{
		id: '42YlR8u9gV5Cw',
		time: 10000
	},
	{
		id: '3og0IzoPfRVwyxjDUs',
		time: 15000
	}
];

const generateRandomXY = (centered?: boolean) => {
	if (centered) {
		// 1/4 to 3/4

		const randomX =
			(Math.random() * window.innerWidth * 2) / 4 + window.innerWidth / 4;
		const randomY =
			(Math.random() * window.innerHeight * 2) / 4 + window.innerHeight / 4;

		//1/3 to 2/3

		// const randomX =
		//   (Math.random() * window.innerWidth) / 3 + window.innerWidth / 3;
		// const randomY =
		//   (Math.random() * window.innerHeight) / 3 + window.innerHeight / 3;

		return { x: randomX, y: randomY };
	} else {
		const randomX = Math.random() * window.innerWidth;
		const randomY = Math.random() * window.innerHeight;
		return { x: randomX, y: randomY };
	}
};
