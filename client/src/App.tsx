import './App.css';

import {
	BUILDING_COSTS,
	ENEMY_VALUES,
	INITIAL_GOLD
} from './components/TowerDefenseConstants';
import {
	IAnimation,
	IAvatarChatMessages,
	IChatMessage,
	IEmoji,
	IFigure,
	IGifs,
	IMessageEvent,
	ITowerBuilding,
	ITowerDefenseState,
	ITowerUnit,
	IUserLocations,
	IUserProfile,
	IUserProfiles,
	PanelItemEnum
} from './types';
import { ILineData, Whiteboard, drawLine } from './components/Whiteboard';
import { IconButton, Modal, Tooltip } from '@material-ui/core';
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { UserCursor, avatarMap } from './components/UserCursors';
import { cymbalHit, sounds } from './components/Sounds';

import { Board } from './components/Board';
import { BottomPanel } from './components/BottomPanel';
import { ChevronRight } from '@material-ui/icons';
import { FirebaseContext } from './firebaseContext';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IMusicNoteProps } from './components/MusicNote';
import { NewChatroom } from './components/NewChatroom';
import { Panel } from './components/Panel';
import { TowerDefense } from './components/TowerDefense';
import _ from 'underscore';
// Sound imports
// import audioEnter from './assets/sounds/zap-enter.mp3';
// import audioExit from './assets/sounds/zap-exit.mp3';
import { backgrounds } from './components/BackgroundImages';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://trychats.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
const GIF_FETCH = new GiphyFetch(API_KEY);
const GIF_PANEL_HEIGHT = 150;

function App() {
	const firebaseContext = useContext(FirebaseContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);
	const [emojis, setEmojis] = useState<IEmoji[]>([]);
	const [gifs, setGifs] = useState<IGifs[]>([]);
	const [brushColor, setBrushColor] = useState('black');
	const [backgroundName, setBackgroundName] = useState<string | undefined>(
		undefined
	);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
	const [avatarMessages, setAvatarMessages] = useState<IAvatarChatMessages>({});
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
		projectiles: [],
		gold: 0
	});

	const [userLocations, setUserLocations] = useState<IUserLocations>({});
	const [userProfiles, setUserProfiles] = useState<IUserProfiles>({});
	const [userProfile, setUserProfile] = useState<IUserProfile>({
		name: '',
		avatar: ''
	});
	const userCursorRef = React.createRef<HTMLDivElement>();

	const [figures, setFigures] = useState<IFigure[]>([]);

	const playEmoji = useCallback((type: string) => {
		const { x, y } = generateRandomXY();

		setEmojis((emojis) =>
			emojis.concat({ top: y, left: x, key: uuidv4(), type })
		);
	}, []);

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
			case 'tower':
			case 'background':
			case 'whiteboard':
			case 'settings':
				setSelectedPanelItem(
					selectedPanelItem === key ? undefined : (key as PanelItemEnum)
				);
				break;
			case 'new-room':
				setIsModalOpen(true);
				setSelectedPanelItem(
					selectedPanelItem === key ? undefined : (key as PanelItemEnum)
				);
				break;
		}
	};

	const handleChatMessage = useCallback((message: IMessageEvent) => {
		const { userId, value } = message;
		setAvatarMessages((messages) => ({
			...messages,
			[userId]: (messages[userId] || []).concat(value)
		}));
	}, []);

	const drawLineEvent = useCallback((strLineData) => {
		let lineData: ILineData = JSON.parse(strLineData);
		const { prevX, prevY, currentX, currentY, color } = lineData;
		drawLine(true, canvasRef, prevX, prevY, currentX, currentY, color, false);
	}, []);

	const addGif = useCallback((gifId: string) => {
		const { x, y } = generateRandomXY(true, true);
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

	const onIsTyping = (isTyping: boolean) => {
		socket.emit('event', {
			key: 'isTyping',
			value: isTyping
		});
	};

	useEffect(() => {
		window.addEventListener('mousemove', onMouseMove);
	}, [onMouseMove]);

	const onCursorMove = useCallback(function cursorMove(
		clientId: string,
		[x, y]: number[],
		clientProfile: IUserProfile
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
				...userProfiles[clientId],
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
				setTowerDefenseState((state) => ({
					...state,
					isPlaying: true,
					gold: INITIAL_GOLD
				}));
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
				enemy.value = ENEMY_VALUES[enemy.type];

				setTowerDefenseState((state) => ({
					...state,
					units: state.units.concat(enemy)
				}));
			}

			if (message.value === 'add tower') {
				const { x, y, type, towerKey } = message;
				setTowerDefenseState((state) => ({
					...state,
					towers: state.towers.concat({
						key: towerKey,
						type: type,
						cost: BUILDING_COSTS[type],
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
						handleChatMessage(message);
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
				case 'background':
					setBackgroundName(message.value);
					break;
				case 'messages':
					setAvatarMessages(message.value as IAvatarChatMessages);
					break;
				case 'whiteboard':
					if (message.value) {
						drawLineEvent(message.value);
					}
					break;
				case 'isTyping':
					setUserProfiles((profiles) => ({
						...profiles,
						[message.id]: { ...profiles[message.id], isTyping: message.value }
					}));
					break;
				case 'username':
					setUserProfiles((profiles) => ({
						...profiles,
						[message.id]: { ...profiles[message.id], name: message.value }
					}));
					break;
			}
		};

		const onProfileInfo = (clientProfile: { name: string; avatar: string }) => {
			setUserProfile((profile) => ({ ...profile, ...clientProfile }));
		};

		const onRoomateDisconnect = (clientId: string) => {
			setUserLocations((userLocations) => {
				const newUserLocations = {
					...userLocations
				};

				delete newUserLocations[clientId];

				return newUserLocations;
			});

			// audioNotification.current = new Audio(audioExit);
			// audioNotification.current.currentTime = 0;
			// audioNotification.current.play();
		};

		// const onNewUser = () => {
		// 	audioNotification.current = new Audio(audioEnter);
		// 	audioNotification.current.currentTime = 0;
		// 	audioNotification.current.play();
		// };

		// socket.on('new user', onNewUser);
		socket.on('roommate disconnect', onRoomateDisconnect);
		socket.on('profile info', onProfileInfo);
		socket.on('cursor move', onCursorMove);
		socket.on('event', onMessageEvent);

		return () => {
			socket.off('roomate disconnect', onRoomateDisconnect);
			socket.off('profile info', onProfileInfo);
			socket.off('cursor move', onCursorMove);
			socket.off('event', onMessageEvent);
			// socket.off('new user', onNewUser);
		};
	}, [
		handleTowerDefenseEvents,
		playEmoji,
		playSound,
		handleChatMessage,
		addGif,
		drawLineEvent,
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
				setUserProfile((profile) => ({ ...profile, message: chatValue }));
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
						type: tower,
						cost: BUILDING_COSTS[tower],
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
			case 'background':
				const backgroundName = args[0] as string;
				socket.emit('event', {
					key: 'background',
					value: backgroundName
				});
				break;

			case 'whiteboard':
				const strlineData = args[0] as string;
				socket.emit('event', {
					key: 'whiteboard',
					value: strlineData
				});
				break;

			case 'settings':
				const username = args[0] as string;
				socket.emit('event', {
					key: 'username',
					value: username
				});
				setUserProfile((profile) => ({ ...profile, name: username }));
				break;
			default:
				break;
		}
	};

	const onClickApp = useCallback(
		(event: React.MouseEvent) => {
			setTowerDefenseState((state) => {
				if (state.selectedPlacementTower) {
					const { x, y } = getRelativePos(event.clientX, event.clientY);
					const newGold =
						towerDefenseState.gold -
						BUILDING_COSTS[state.selectedPlacementTower.type];
					if (newGold >= 0) {
						socket.emit('event', {
							key: 'tower defense',
							value: 'add tower',
							type: state.selectedPlacementTower.type,
							x,
							y
						});
						return {
							...state,
							gold: newGold,
							selectedPlacementTower: undefined
						};
					} else {
						setChatMessages((messages) =>
							messages.concat({
								top: y * window.innerHeight,
								left: x * window.innerWidth,
								key: uuidv4(),
								value: 'Not Enough Gold',
								isCentered: false
							})
						);
					}
					return { ...state, selectedPlacementTower: undefined };
				}
				return state;
			});
		},
		[towerDefenseState]
	);

	const onWhiteboardPanel = selectedPanelItem === PanelItemEnum.whiteboard;

	const onCreateRoom = (roomName: string) => {
		return firebaseContext.createRoom(roomName);
		// return new Promise<INewChatroomCreateResponse>((resolve) => {
		// 	resolve({
		// 		name: roomName,
		// 		message: 'success'
		// 		// message: 'room name already taken'
		// 	});
		// });
	};

	return (
		<div
			className="app"
			style={{
				minHeight: window.innerHeight - 10,
				backgroundImage: `url(${backgrounds[backgroundName!]})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover'
			}}
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
				avatarMessages={avatarMessages}
			/>

			<TowerDefense
				state={towerDefenseState}
				updateUnits={(units) =>
					setTowerDefenseState((state) => ({ ...state, units }))
				}
				updateProjectiles={(projectiles) =>
					setTowerDefenseState((state) => ({ ...state, projectiles }))
				}
				updateGold={(gold) =>
					setTowerDefenseState((state) => ({ ...state, gold }))
				}
			/>

			<Whiteboard
				onWhiteboardPanel={onWhiteboardPanel}
				canvasRef={canvasRef}
				brushColor={brushColor}
				onAction={actionHandler}
			/>

			<div className="open-panel-button">
				{!isPanelOpen && (
					<Tooltip title="open panel">
						<IconButton
							onClick={() => {
								setIsPanelOpen(true);
							}}
						>
							<ChevronRight />
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
				avatar={
					userProfile && userProfile.avatar
						? avatarMap[userProfile.avatar]
						: undefined
				}
			/>

			<Tooltip
				title={`version: ${process.env.REACT_APP_VERSION}. production: leo, mike, yinbai, krishang, tony, grant, and andrew`}
			>
				<div className="adventure-logo">
					<div>adventure</div>
					<div>corp</div>
				</div>
			</Tooltip>

			<BottomPanel
				towerDefenseState={towerDefenseState}
				setBrushColor={(color: string) => setBrushColor(color)}
				type={selectedPanelItem}
				isOpen={Boolean(selectedPanelItem)}
				onAction={actionHandler}
				updateIsTyping={onIsTyping}
			/>

			{userProfile && (
				<UserCursor
					ref={userCursorRef}
					{...userProfile}
					isSelectingTower={towerDefenseState.selectedPlacementTower}
				/>
			)}

			<Modal className="modal-container" open={isModalOpen}>
				<NewChatroom
					onClickCancel={() => setIsModalOpen(false)}
					onCreate={onCreateRoom}
				/>
			</Modal>
		</div>
	);
}

export default App;

const generateRandomXY = (centered?: boolean, gif?: boolean) => {
	if (centered) {
		const randomX =
			(Math.random() * window.innerWidth * 2) / 4 + window.innerWidth / 4;
		const randomY =
			(Math.random() * window.innerHeight * 2) / 4 + window.innerHeight / 4;
		// if its a gif, make sure it appears above the tall gif panel, but make sure its not too high as well.
		if (gif)
			return {
				x: randomX,
				y: Math.max(window.innerHeight / 4, randomY - GIF_PANEL_HEIGHT)
			};
		return { x: randomX, y: randomY };
	} else {
		const randomX = Math.random() * window.innerWidth;
		const randomY = Math.random() * window.innerHeight;
		return { x: randomX, y: randomY };
	}
};

export const getRelativePos = (clientX: number, clientY: number) => {
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
