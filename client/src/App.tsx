import './App.css';

import {
	IAnimation,
	IChatMessage,
	IEmoji,
	IFigure,
	IGifs,
	IMessageEvent,
	ITowerBuilding,
	ITowerDefenseState,
	ITowerUnit,
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
import {
	TowerDefense,
	Actions as TowerDefenseActions
} from './components/TowerDefense';
import { cymbalHit, sounds } from './components/Sounds';

import { Board } from './components/Board';
import { BottomPanel } from './components/BottomPanel';
import { ChevronLeft } from '@material-ui/icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IMusicNoteProps } from './components/MusicNote';
import { Panel } from './components/Panel';
import { UserCursor } from './components/UserCursors';
import _ from 'underscore';
// Sound imports
import audioEnter from './assets/sounds/zap-enter.mp3';
import audioExit from './assets/sounds/zap-exit.mp3';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://adventure-chat.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
const GIF_FETCH = new GiphyFetch(API_KEY);

function App() {
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);
	const [emojis, setEmojis] = useState<IEmoji[]>([]);
	const [gifs, setGifs] = useState<IGifs[]>([]);
	const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
	const [selectedPanelItem, setSelectedPanelItem] = useState<
		PanelItemEnum | undefined
	>(PanelItemEnum.chat);

	const [animations, setAnimations] = useState<IAnimation[]>([]);

	const audio = useRef<HTMLAudioElement>(new Audio(cymbalHit));
	const audioNotification = useRef<HTMLAudioElement>();

	const [
		towerDefenseState,
		setTowerDefenseState
	] = useState<ITowerDefenseState>({
		isPlaying: false,
		towers: [],
		units: [],
		projectiles: []
	});

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

	const playSound = useCallback((soundType) => {
		audio.current = new Audio(sounds[soundType]);

		if (!audio || !audio.current) return;

		const randomX = Math.random() * window.innerWidth;
		const randomY = Math.random() * window.innerHeight;

		setMusicNotes((notes) =>
			notes.concat({ top: randomY, left: randomX, key: uuidv4() })
		);

		audio.current.currentTime = 0;
		audio.current.play();
	}, []);

	const onClickPanelItem = (key: string) => {
		switch (key) {
			case 'sound':
			case 'emoji':
			case 'chat':
			case 'gifs':
			case 'tower defense':
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

	const playAnimation = useCallback((animationType: string) => {
		if (animationType === 'start game') {
			setAnimations((animations) => animations.concat({ type: 'start game' }));
			setTimeout(() => {
				setAnimations((animations) => animations.concat({ type: 'info' }));
			}, 2000);
		}
		if (animationType === 'end game') {
			setAnimations((animations) => animations.concat({ type: 'end game' }));
		}
	}, []);

	const fireTowers = useCallback(() => {
		towerDefenseState.towers.forEach((tower) => {
			// only hit first enemy
			for (let i = 0; i < towerDefenseState.units.length; i++) {
				const unit = towerDefenseState.units[i];

				const { ref } = unit;
				if (ref && ref.current) {
					const rect = ref.current.getBoundingClientRect();

					const distance = getDistanceBetweenPoints(
						tower.left,
						tower.top,
						rect.left,
						rect.top
					);

					const relativeDistance = distance / window.innerWidth;

					if (relativeDistance < 0.4) {
						socket.emit('event', {
							key: 'tower defense',
							value: 'fire tower',
							towerKey: tower.key,
							unitKey: unit.key
						});
						break;
					}
				}
			}
		});
	}, [towerDefenseState]);

	const handleTowerDefenseEvents = useCallback(
		(message: IMessageEvent) => {
			if (message.value === 'start') {
				playAnimation('start game');
				setTowerDefenseState((state) => ({ ...state, isPlaying: true }));
			}
			if (message.value === 'end') {
				playAnimation('end game');
				setTowerDefenseState((state) => ({
					...state,
					isPlaying: false,
					towers: [],
					units: [],
					projectiles: [],
					selectedPlacementTower: undefined
				}));
			}
			if (message.value === 'spawn enemy') {
				const enemy = message.enemy as ITowerUnit;

				enemy.top = window.innerHeight / 2;
				enemy.left = 0;
				enemy.ref = React.createRef();

				setTowerDefenseState((state) => ({
					...state,
					units: state.units.concat(enemy)
				}));
			}

			if (message.value === 'add tower') {
				const { x, y, towerKey } = message;

				setTowerDefenseState((state) => ({
					...state,
					towers: state.towers.concat({
						key: towerKey,
						type: 'basic',
						top: y * window.innerHeight,
						left: x * window.innerWidth
					})
				}));
			}

			if (message.value === 'fire towers') {
				fireTowers();
			}

			if (message.value === 'hit unit') {
				const { towerKey, unitKey } = message;

				setTowerDefenseState((state) => {
					let startPos = { x: 0, y: 0 };
					let endPos = { x: 0, y: 0 };

					const tower = state.towers.find((tower) => tower.key === towerKey);
					const unit = state.units.find((unit) => unit.key === unitKey);

					if (tower && unit) {
						startPos.x = tower.left;
						startPos.y = tower.top;

						const unitRect = unit.ref.current?.getBoundingClientRect();
						if (unitRect) {
							endPos.x = unitRect.left + 30;
							endPos.y = unitRect.top;
						}
					}

					return {
						...state,
						projectiles: state.projectiles.concat({
							towerKey,
							unitKey,
							key: uuidv4(),
							startPos,
							endPos
						})
					};
				});
			}

			if (message.value === 'towers') {
				const { towers } = message;
				setTowerDefenseState((state) => ({
					...state,
					towers: towers.map((tower: ITowerBuilding) => ({
						...tower,
						top: tower.top * window.innerHeight,
						left: tower.left * window.innerWidth
					}))
				}));
			}
		},
		[fireTowers, playAnimation]
	);

	useEffect(() => {
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
				case 'tower defense':
					handleTowerDefenseEvents(message);

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
		socket.on('event', onMessageEvent);

		return () => {
			socket.off('roomate disconnect', onRoomateDisconnect);
			socket.off('profile info', onProfileInfo);
			socket.off('cursor move', onCursorMove);
			socket.off('event', onMessageEvent);
		};
	}, [
		handleTowerDefenseEvents,
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

			case 'tower defense':
				const { value, tower } = args[0] as {
					key: string;
					value: string;
					tower?: string;
				};

				if (value === 'select tower' && tower) {
					const towerObj: ITowerBuilding = {
						key: tower,
						type: 'basic',
						top: 0,
						left: 0
					};

					setTowerDefenseState((state) => {
						if (state.selectedPlacementTower) {
							return {
								...state,
								selectedPlacementTower: undefined
							};
						}
						return {
							...state,
							selectedPlacementTower: towerObj
						};
					});
				} else {
					socket.emit('event', args[0]);
				}

				break;

			default:
				break;
		}
	};

	const onClickApp = useCallback((event: React.MouseEvent) => {
		setTowerDefenseState((state) => {
			if (state.selectedPlacementTower) {
				const { x, y } = getRelativePos(event.clientX, event.clientY);

				socket.emit('event', {
					key: 'tower defense',
					value: 'add tower',
					x,
					y
				});

				return { ...state, selectedPlacementTower: undefined };
			}
			return state;
		});
	}, []);

	return (
		<div
			className="app"
			style={{ minHeight: window.innerHeight - 10 }}
			onClick={onClickApp}
		>
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
				animations={animations}
				updateAnimations={setAnimations}
			/>

			<TowerDefense
				state={towerDefenseState}
				onAction={(action: TowerDefenseActions) => {
					console.log('tower defense action', action);
				}}
				updateUnits={(units) =>
					setTowerDefenseState((state) => ({ ...state, units }))
				}
				updateProjectiles={(projectiles) =>
					setTowerDefenseState((state) => ({ ...state, projectiles }))
				}
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
				towerDefenseState={towerDefenseState}
				type={selectedPanelItem}
				isOpen={Boolean(selectedPanelItem)}
				onAction={actionHandler}
			/>

			{userProfile && (
				<UserCursor
					ref={userCursorRef}
					avatar={userProfile.avatar}
					name={userProfile.name}
					isSelectingTower={towerDefenseState.selectedPlacementTower}
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

		return { x: randomX, y: randomY };
	} else {
		const randomX = Math.random() * window.innerWidth;
		const randomY = Math.random() * window.innerHeight;
		return { x: randomX, y: randomY };
	}
};

const getRelativePos = (clientX: number, clientY: number) => {
	const x = clientX;
	const y = clientY;

	const width = window.innerWidth;
	const height = window.innerHeight;

	const relativeX = (x - 60) / width;
	const relativeY = (y - 60) / height;

	return { x: relativeX, y: relativeY };
};

const getDistanceBetweenPoints = (
	x1: number,
	y1: number,
	x2: number,
	y2: number
) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
