import './App.css';

import {
	BUILDING_COSTS,
	ENEMY_VALUES,
	INITIAL_GOLD
} from './components/TowerDefenseConstants';
import {
	IAnimation,
	IAvatarChatMessages,
	IBackgroundState,
	IBoardImage,
	IChatMessage,
	IEmoji,
	IGifs,
	IMessageEvent,
	IPinnedItem,
	ITowerBuilding,
	ITowerDefenseState,
	ITowerUnit,
	IUserLocations,
	IUserProfile,
	IUserProfiles,
	IWeather,
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
import {
	Redirect,
	Route,
	HashRouter as Router,
	Switch,
	useHistory,
	useParams
} from 'react-router-dom';
import { UserCursor, avatarMap } from './components/UserCursors';
import {
	activateFireworks,
	activateRandomConfetti,
	activateSchoolPride,
	activateSnow
} from './components/Animation';
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
import { backgrounds } from './components/BackgroundImages';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { EnterRoomModal } from './components/RoomDirectoryPanel';

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://trychats.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
const GIF_FETCH = new GiphyFetch(API_KEY);
const GIF_PANEL_HEIGHT = 150;

function App() {
	const { roomId } = useParams<{ roomId?: string }>();
	const history = useHistory();

	const [isRoomError, setIsRoomError] = useState(false);

	const firebaseContext = useContext(FirebaseContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [musicNotes, setMusicNotes] = useState<IMusicNoteProps[]>([]);
	const [emojis, setEmojis] = useState<IEmoji[]>([]);
	const [gifs, setGifs] = useState<IGifs[]>([]);
	const [pinnedText, setPinnedText] = useState<{ [key: string]: IPinnedItem }>(
		{}
	);
	const [movingBoardItem, setMovingBoardItem] = useState<
		IPinnedItem | undefined
	>(undefined);
	const [images, setImages] = useState<IBoardImage[]>([]);
	const [brushColor, setBrushColor] = useState('black');
	const [background, setBackground] = useState<IBackgroundState>({
		name: undefined
	});

	const bottomPanelRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [bottomPanelHeight, setBottomPanelHeight] = useState(0);
	const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
	const [avatarMessages, setAvatarMessages] = useState<IAvatarChatMessages>({});
	const [selectedPanelItem, setSelectedPanelItem] = useState<
		PanelItemEnum | undefined
	>(PanelItemEnum.chat);

	const [animations, setAnimations] = useState<IAnimation[]>([]);
	const [roomNameState, setRoomName] = useState<string>('');
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
		avatar: '',
		weather: { temp: '', condition: '' },
		soundType: ''
	});
	const userCursorRef = React.createRef<HTMLDivElement>();

	const [weather, setWeather] = useState<IWeather>({
		temp: '',
		condition: ''
	});

	const [enterIsRoomModel, setIsEnterRoomModel] = useState<boolean>(false);

	const playEmoji = useCallback((type: string) => {
		const { x, y } = generateRandomXY();

		setEmojis((emojis) =>
			emojis.concat({ top: y, left: x, key: uuidv4(), type })
		);
	}, []);

	const deleteProfileSoundType = () =>
		setUserProfile((profile) => ({ ...profile, soundType: '' }));

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

	const playPreviewSound = useCallback((soundType) => {
		audio.current = new Audio(sounds[soundType]);
		if (!audio || !audio.current) return;

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
			case 'animation':
			case 'background':
			case 'whiteboard':
			case 'weather':
			case 'roomDirectory':
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

	const addGif = useCallback((gifId: string, gifKey?: string) => {
		const { x, y } = generateRandomXY(true, true);
		GIF_FETCH.gif(gifId).then((data) => {
			const newGif: IGifs = {
				top: y,
				left: x,
				key: gifKey || uuidv4(),
				data: data.data
			};
			setGifs((gifs) => gifs.concat(newGif));
		});
	}, []);

	const addImage = useCallback((image: string, imageKey?: string) => {
		const { x, y } = generateRandomXY(true, true);
		const newImage: IBoardImage = {
			top: y,
			left: x,
			key: imageKey || uuidv4(),
			url: imageToUrl(image)
		};
		setImages((images) => images.concat(newImage));
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

	const playAnimation = useCallback((animationType: string) => {
		switch (animationType) {
			case 'confetti':
				activateRandomConfetti();
				break;
			case 'schoolPride':
				activateSchoolPride();
				break;
			case 'fireworks':
				activateFireworks();
				break;
			case 'snow':
				activateSnow();
				break;
		}
	}, []);

	const onIsTyping = (isTyping: boolean) => {
		socket.emit('event', {
			key: 'isTyping',
			value: isTyping
		});
	};

	useEffect(() => {
		if (bottomPanelRef.current) {
			setBottomPanelHeight(
				selectedPanelItem ? bottomPanelRef.current.offsetHeight : 0
			);
		}
	}, [selectedPanelItem]);

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

	const playTextAnimation = useCallback((animationType: string) => {
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
				playTextAnimation('start game');
				setTowerDefenseState((state) => ({
					...state,
					isPlaying: true,
					gold: INITIAL_GOLD
				}));
			}
			if (message.value === 'end') {
				playTextAnimation('end game');
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
		[fireTowers, playTextAnimation]
	);

	const handlePinItemMessage = useCallback(
		(message: IMessageEvent, isUnpin?: boolean) => {
			const { type, itemKey } = message;
			switch (type) {
				case 'gif':
					const gifIndex = gifs.findIndex((gif) => gif.key === itemKey);
					const gif = gifs[gifIndex];
					if (gif) {
						if (isUnpin) {
							setGifs([
								...gifs.slice(0, gifIndex),
								...gifs.slice(gifIndex + 1)
							]);
						} else {
							setGifs([
								...gifs.slice(0, gifIndex),
								{ ...gif, isPinned: true },
								...gifs.slice(gifIndex + 1)
							]);
						}
					}
					break;

				case 'image':
					const index = images.findIndex((image) => image.key === itemKey);
					const image = images[index];
					if (image) {
						if (isUnpin) {
							setImages([
								...images.slice(0, index),
								...images.slice(index + 1)
							]);
						} else {
							setImages([
								...images.slice(0, index),
								{ ...image, isPinned: true },
								...images.slice(index + 1)
							]);
						}
					}
					break;
				case 'background':
					if (isUnpin) {
						setBackground({ name: '', isPinned: false });
					} else {
						setBackground({ name: message.name, isPinned: true });
					}
					break;
				case 'text':
					if (isUnpin) {
						const newPinnedText = { ...pinnedText };
						delete newPinnedText[itemKey];
						setPinnedText(newPinnedText);
					} else {
						setPinnedText((pinnedText) => ({
							...pinnedText,
							[message.itemKey]: {
								type: 'text',
								text: message.value,
								key: message.itemKey,
								top: message.top * window.innerHeight,
								left: message.left * window.innerWidth,
								isPinned: true
							}
						}));
					}
					break;
			}
		},
		[gifs, images, pinnedText]
	);

	useEffect(() => {
		const onMessageEvent = (message: IMessageEvent) => {
			switch (message.key) {
				case 'sound':
					if (message.value) {
						playSound(message.value);
						setUserProfiles((profiles) => ({
							...profiles,
							[message.userId]: {
								...profiles[message.userId],
								soundType: message.value
							}
						}));
					}
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
						addGif(message.value, message.gifKey);
					}
					break;
				case 'image':
					if (message.value) {
						addImage(message.value, message.imageKey);
					}
					break;
				case 'tower defense':
					handleTowerDefenseEvents(message);
					break;
				case 'background':
					setBackground((background) => ({
						...background,
						name: message.value,
						isPinned: message.isPinned
					}));
					break;
				case 'messages':
					setAvatarMessages(message.value as IAvatarChatMessages);
					break;
				case 'whiteboard':
					if (message.value) {
						drawLineEvent(message.value);
					}
					break;

				case 'animation':
					if (message.value) {
						playAnimation(message.value);
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
				case 'weather':
					if (message.toSelf) {
						setUserProfile((profile) => ({
							...profile,
							weather: message.value
						}));
					} else {
						setUserProfiles((profiles) => ({
							...profiles,
							[message.id]: { ...profiles[message.id], weather: message.value }
						}));
					}

					break;
				case 'settings-url':
					if (message.value && message.isSelf) {
						setUserProfile((profile) => ({
							...profile,
							musicMetadata: message.value
						}));
					} else {
						setUserProfiles((profiles) => ({
							...profiles,
							[message.id]: {
								...profiles[message.id],
								musicMetadata: message.value
							}
						}));
					}
					break;
				case 'pin-item':
					handlePinItemMessage(message);
					break;
				case 'unpin-item':
					handlePinItemMessage(message, true);
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
		};

		const onConnect = () => {
			if (roomId) {
				socket.emit('connect room', roomId);
			} else {
				socket.emit('connect room', 'default');
			}
		};

		socket.on('roommate disconnect', onRoomateDisconnect);
		socket.on('profile info', onProfileInfo);
		socket.on('cursor move', onCursorMove);
		socket.on('event', onMessageEvent);
		socket.on('connect', onConnect);

		return () => {
			socket.off('roomate disconnect', onRoomateDisconnect);
			socket.off('profile info', onProfileInfo);
			socket.off('cursor move', onCursorMove);
			socket.off('event', onMessageEvent);
			socket.off('connect', onConnect);
		};
	}, [
		handleTowerDefenseEvents,
		playEmoji,
		playSound,
		handleChatMessage,
		addGif,
		drawLineEvent,
		onCursorMove,
		audioNotification,
		playAnimation,
		roomId,
		handlePinItemMessage,
		addImage
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
			case 'chat-pin':
				const chatPinValue = args[0] as string;

				if (chatPinValue) {
					setMovingBoardItem({
						type: 'text',
						top: 0,
						left: 0,
						value: chatPinValue,
						key: uuidv4()
					});
				}

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
				setUserProfile((profile) => ({ ...profile, soundType: soundType }));

				socket.emit('event', {
					key: 'sound',
					value: soundType
				});
				break;
			case 'previewSound':
				const previewedSoundType = args[0] as string;
				playPreviewSound(previewedSoundType);
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
				firebaseContext.unpinRoomItem(roomId || 'default', 'background');
				break;
			case 'image':
				const image = args[0] as string;
				socket.emit('event', {
					key: 'image',
					value: image
				});
				break;
			case 'animation':
				const animationType = args[0] as string;
				playAnimation(animationType);
				socket.emit('event', {
					key: 'animation',
					value: animationType
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
				const type = args[0] as string;
				const settingsValue = args[1] as string;

				if (type === 'url') {
					socket.emit('event', {
						key: 'settings-url',
						value: settingsValue
					});
				} else if (type === 'name') {
					socket.emit('event', {
						key: 'username',
						value: settingsValue
					});
					setUserProfile((profile) => ({ ...profile, name: settingsValue }));
				}
				break;
			case 'weather':
				const location = args[0] as string;

				socket.emit('event', {
					key: 'weather',
					value: location
				});
				break;
			case 'roomDirectory':
				const roomName = args[0] as string;
				setRoomName(roomName)
				setIsEnterRoomModel(true)
				break;
			default:
				break;
		}
	};

	const onClickApp = useCallback(
		(event: React.MouseEvent) => {
			const { x, y } = getRelativePos(event.clientX, event.clientY);
			setTowerDefenseState((state) => {
				if (state.selectedPlacementTower) {
					const newGold =
						state.gold - BUILDING_COSTS[state.selectedPlacementTower.type];
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

			if (movingBoardItem && movingBoardItem.type === 'text') {
				const { key, value } = movingBoardItem;

				socket.emit('event', {
					key: 'pin-item',
					type: 'text',
					value,
					top: y,
					left: x,
					itemKey: key
				});

				firebaseContext.pinRoomItem(roomId || 'default', {
					type: 'text',
					top: y,
					left: x,
					key,
					value
				});

				setMovingBoardItem(undefined);
			}
		},
		[movingBoardItem, firebaseContext, roomId]
	);

	const onWhiteboardPanel = selectedPanelItem === PanelItemEnum.whiteboard;

	const onCreateRoom = (roomName: string) => {
		return firebaseContext.createRoom(roomName);
	};

	useEffect(() => {
		const room = roomId || 'default';

		firebaseContext.getRoom(room).then((result) => {
			if (result === null) {
				setIsRoomError(true);
			} else {
				setIsRoomError(false);
			}
		});

		firebaseContext.getRoomPinnedItems(room).then((pinnedItems) => {
			const pinnedGifs: IGifs[] = [];
			const pinnedImages: IBoardImage[] = [];
			const pinnedText: { [key: string]: IPinnedItem } = {};

			pinnedItems.forEach((item) => {
				if (item.type === 'gif') {
					pinnedGifs.push({
						...item,
						top: item.top! * window.innerHeight,
						left: item.left! * window.innerWidth,
						isPinned: true,
						key: item.key!,
						data: item.data!
					});
				} else if (item.type === 'image') {
					pinnedImages.push({
						...item,
						top: item.top! * window.innerHeight,
						left: item.left! * window.innerWidth,
						isPinned: true,
						key: item.key!,
						url: item.url
					});
				} else if (item.type === 'background') {
					setBackground({ name: item.name, isPinned: true });
				} else if (item.type === 'text') {
					pinnedText[item.key!] = {
						...item,
						top: item.top! * window.innerHeight,
						left: item.left! * window.innerWidth,
						isPinned: true,
						key: item.key!,
						text: item.value
					};
				}
			});

			setGifs((gifs) => gifs.concat(...pinnedGifs));
			setImages((images) => images.concat(...pinnedImages));
			setPinnedText((text) => ({ ...text, ...pinnedText }));
		});
	}, [roomId, history, firebaseContext]);

	const pinGif = (gifKey: string) => {
		const gifIndex = gifs.findIndex((gif) => gif.key === gifKey);
		const gif = gifs[gifIndex];
		const room = roomId || 'default';

		if (gif && !gif.isPinned) {
			firebaseContext.pinRoomItem(room, {
				...gif,
				type: 'gif',
				left: gif.left / window.innerWidth,
				top: gif.top / window.innerHeight
			});
			setGifs([
				...gifs.slice(0, gifIndex),
				{ ...gif, isPinned: true },
				...gifs.slice(gifIndex + 1)
			]);

			socket.emit('event', {
				key: 'pin-item',
				type: 'gif',
				itemKey: gifKey
			});
		}
	};

	const pinImage = (imageKey: string) => {
		const imageIndex = images.findIndex((image) => image.key === imageKey);
		const image = images[imageIndex];
		const room = roomId || 'default';

		if (image && !image.isPinned) {
			firebaseContext.pinRoomItem(room, {
				...image,
				type: 'image',
				left: image.left / window.innerWidth,
				top: image.top / window.innerHeight
			});
			setImages([
				...images.slice(0, imageIndex),
				{ ...image, isPinned: true },
				...images.slice(imageIndex + 1)
			]);

			socket.emit('event', {
				key: 'pin-item',
				type: 'image',
				itemKey: imageKey
			});
		}
	};

	const pinBackground = () => {
		const room = roomId || 'default';

		if (!background.isPinned) {
			firebaseContext.pinRoomItem(room, {
				name: background.name,
				type: 'background',
				top: 0,
				left: 0
			});
			setBackground((background) => ({ ...background, isPinned: true }));

			socket.emit('event', {
				key: 'pin-item',
				type: 'background',
				name: background.name
			});
		}
	};

	const unpinBackground = () => {
		const room = roomId || 'default';

		if (background.isPinned) {
			firebaseContext.unpinRoomItem(room, 'background');
			setBackground({ name: '', isPinned: false });

			socket.emit('event', {
				key: 'unpin-item',
				type: 'background'
			});
		}
	};

	const unpinGif = (gifKey: string) => {
		const gifIndex = gifs.findIndex((gif) => gif.key === gifKey);
		const gif = gifs[gifIndex];
		const room = roomId || 'default';

		if (gif && gif.isPinned) {
			firebaseContext.unpinRoomItem(room, gif.key);
			setGifs([...gifs.slice(0, gifIndex), ...gifs.slice(gifIndex + 1)]);

			socket.emit('event', {
				key: 'unpin-item',
				type: 'gif',
				itemKey: gifKey
			});
		}
	};

	const unpinImage = (imageKey: string) => {
		const index = images.findIndex((image) => image.key === imageKey);
		const image = images[index];
		const room = roomId || 'default';

		if (image && image.isPinned) {
			firebaseContext.unpinRoomItem(room, image.key);
			setImages([...images.slice(0, index), ...images.slice(index + 1)]);

			socket.emit('event', {
				key: 'unpin-item',
				type: 'image',
				itemKey: imageKey
			});
		}
	};

	const unpinText = (key: string) => {
		const newPinnedText = { ...pinnedText };

		delete newPinnedText[key];

		setPinnedText(newPinnedText);

		firebaseContext.unpinRoomItem(roomId || 'default', key);

		socket.emit('event', {
			key: 'unpin-item',
			type: 'text',
			itemKey: key
		});
	};

	if (isRoomError) {
		return <div>Invalid room {roomId}</div>;
	}

	return (
		<div
			className="app"
			style={{
				height: window.innerHeight - bottomPanelHeight
			}}
			onClick={onClickApp}
		>
			<Board
				background={background}
				musicNotes={musicNotes}
				updateNotes={setMusicNotes}
				emojis={emojis}
				updateEmojis={setEmojis}
				gifs={gifs}
				updateGifs={setGifs}
				images={images}
				updateImages={setImages}
				chatMessages={chatMessages}
				updateChatMessages={setChatMessages}
				userLocations={userLocations}
				userProfiles={userProfiles}
				setUserProfiles={setUserProfiles}
				animations={animations}
				updateAnimations={setAnimations}
				avatarMessages={avatarMessages}
				weather={weather}
				updateWeather={setWeather}
				pinGif={pinGif}
				unpinGif={unpinGif}
				pinImage={pinImage}
				unpinImage={unpinImage}
				pinBackground={pinBackground}
				unpinBackground={unpinBackground}
				pinnedText={pinnedText}
				unpinText={unpinText}
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
				title={`version: ${process.env.REACT_APP_VERSION}. production: leo, mike, yinbai, krishang, tony, grant, andrew, sokchetra, and allen`}
				placement="left"
			>
				<div className="adventure-logo">
					<div>adventure</div>
					<div>corp</div>
				</div>
			</Tooltip>

			<BottomPanel
				bottomPanelRef={bottomPanelRef}
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
					deleteSoundType={deleteProfileSoundType}
					isSelectingTower={towerDefenseState.selectedPlacementTower}
					isMovingBoardObject={!!movingBoardItem}
				/>
			)}

			<Modal
				onClose={() => setIsModalOpen(false)}
				className="modal-container"
				open={isModalOpen}
			>
				<NewChatroom
					onClickCancel={() => setIsModalOpen(false)}
					onCreate={onCreateRoom}
				/>
			</Modal>
			<Modal
				onClose={() => setIsEnterRoomModel(false)}
				className="modal-container"
				open={enterIsRoomModel}
			>
				<EnterRoomModal
					roomName={roomNameState}
					onClickCancel={() => setIsEnterRoomModel(false)}
					/>
			</Modal>
		</div>
	);
}

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

const imageToUrl = (name: string) => {
	return name.startsWith('http') ? name : backgrounds[name] || '';
};

const RouterHandler = () => {
	return (
		<Router>
			<Switch>
				<Route path="/room/:roomId">
					<App />
				</Route>
				<Route exact path="/">
					<App />
				</Route>
				<Redirect from="*" to="/" />
			</Switch>
		</Router>
	);
};
export default RouterHandler;
