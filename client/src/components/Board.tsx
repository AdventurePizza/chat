import './Board.css';

import {
	AnimationTypes,
	IAnimation,
	IAvatarChatMessages,
	IBackgroundState,
	IBoardImage,
	IBoardVideo,
	IChatMessage,
	IEmoji,
	IGifs,
	IOrder,
	IPinnedItem,
	IUserLocations,
	IUserProfiles,
	IWeather,
	ITweet,
	PinTypes,
	IWaterfallChat,
	IBoardHorse,
	IMusicPlayer,
	PanelItemEnum,
	newPanelTypes,
	IBoardRace
} from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IMusicNoteProps, MusicNote } from './MusicNote';
import { XYCoord, useDrop } from 'react-dnd';

import { BoardObject } from './BoardObject';
import { PinButton } from './shared/PinButton';
import React, { useState } from 'react';
import { UserCursors } from './UserCursors';
import { backgrounds } from './BackgroundImages';
import { ISubmit } from './NFT/OrderInput';
import { LoadingNFT } from './NFT/NFTPanel';
import { CustomToken as NFT } from '../typechain/CustomToken';
// import introShark from '../assets/intro/leftshark.gif';
// import present from '../assets/intro/present.gif';
import { useContext } from 'react';
import { MapsContext } from '../contexts/MapsContext';
import { Map } from './Maps';
import YouTubeBackground from './YouTubeBackground';
import { useEffect } from 'react';

interface IBoardProps {
	videoId: string;
	hideAllPins: boolean;
	setPinnedVideoId: React.Dispatch<React.SetStateAction<string>>;
	pinnedVideoId: string;
	lastTime: number;
	videoRef: React.Ref<any>;
	volume: number;
	musicNotes: IMusicNoteProps[];
	updateNotes: (notes: IMusicNoteProps[]) => void;
	emojis: IEmoji[];
	updateEmojis: (emojis: IEmoji[]) => void;
	gifs: IGifs[];
	updateGifs: (gifs: IGifs[]) => void;
	images: IBoardImage[];
	updateImages: (images: IBoardImage[]) => void;
	videos: IBoardVideo[];
	updateVideos: (videos: IBoardVideo[]) => void;
	chatMessages: IChatMessage[];
	updateChatMessages: (chatMessages: IChatMessage[]) => void;
	userLocations: IUserLocations;
	userProfiles: IUserProfiles;
	setUserProfiles: React.Dispatch<React.SetStateAction<IUserProfiles>>;
	animations: IAnimation[];
	updateAnimations: (animations: IAnimation[]) => void;
	avatarMessages: IAvatarChatMessages;
	weather: IWeather;
	updateWeather: (weather: IWeather) => void;
	pinGif: (gifKey: string) => void;
	unpinGif: (gifKey: string) => void;
	pinImage: (imageKey: string) => void;
	unpinImage: (gifKey: string) => void;
	addVideo: (videoId: string | undefined) => void;
	pinVideo: (videoId: string | undefined) => void;
	unpinVideo: (videoId: string | undefined) => void;
	isVideoPinned: boolean;
	pinBackground: () => void;
	unpinBackground: () => void;
	background: IBackgroundState;
	pinnedText: { [key: string]: IPinnedItem };
	unpinText: (textKey: string) => void;
	moveItem: (
		type: PinTypes,
		itemKey: string,
		left: number,
		top: number,
		deltaX: number,
		deltaY: number
	) => void;
	NFTs: Array<IOrder & IPinnedItem>;
	loadingNFT?: ISubmit;
	updateNFTs: (nfts: Array<IOrder & IPinnedItem>) => void;
	pinNFT: (nftId: string) => void;
	unpinNFT: (nftId: string) => void;
	addNewContract: (nftAddress: string) => Promise<NFT | undefined>;
	onBuy: (nftId: string) => void;
	onCancel: (nftId: string) => void;
	onClickNewRoom: () => void;
	onClickPresent: () => void;
	musicPlayer: IMusicPlayer;
	tweets: ITweet[];
	pinTweet: (tweetID: string) => void;
	unpinTweet: (tweetID: string) => void;
	waterfallChat: IWaterfallChat;
	races: IBoardRace[];
	updateRaces: (races: IBoardRace[]) => void;
	horses: IBoardHorse[];
	pinHorse: (horseKey: string) => void;
	unpinHorse: (horseKey: string) => void;
	updateHorses: (horses: IBoardHorse[]) => void;
	updateSelectedPanelItem: (panelItem: PanelItemEnum | undefined) => void;
	setActivePanel: (panel: newPanelTypes) => void;
	pinRace: (raceKey: string) => void;
	unpinRace: (raceKey: string) => void;
}

export const Board = ({
	videoId,
	hideAllPins,
	setPinnedVideoId,
	pinnedVideoId,
	videoRef,
	lastTime,
	volume,
	musicNotes,
	updateNotes,
	emojis,
	updateEmojis,
	gifs,
	updateGifs,
	images,
	updateImages,
	videos,
	updateVideos,
	chatMessages,
	updateChatMessages,
	userLocations,
	userProfiles,
	setUserProfiles,
	animations,
	updateAnimations,
	avatarMessages,
	weather,
	pinGif,
	unpinGif,
	pinImage,
	unpinImage,
	addVideo,
	pinVideo,
	unpinVideo,
	isVideoPinned,
	background,
	pinBackground,
	unpinBackground,
	pinnedText,
	unpinText,
	moveItem,
	NFTs,
	loadingNFT,
	updateNFTs,
	pinNFT,
	unpinNFT,
	addNewContract,
	onBuy,
	onCancel,
	onClickNewRoom,
	onClickPresent,
	unpinTweet,
	tweets,
	pinTweet,
	waterfallChat,
	races,
	updateRaces,
	horses,
	pinHorse,
	unpinHorse,
	updateHorses,
	musicPlayer,
	updateSelectedPanelItem,
	setActivePanel,
	pinRace,
	unpinRace

}: IBoardProps) => {
	// const [introState, setIntroState] = useState<'begin' | 'appear' | 'end'>(
	// 	'begin'
	// );
	// const [presentState, setPresentState] = useState<'begin' | 'appear' | 'end'>(
	// 	'begin'
	// );

	// const renderPresent = () => {
	// 	if (presentState === 'appear' || presentState === 'begin') {
	// 		return (
	// 			<button onClick={onClickPresent} className="board-present">
	// 				<span>trychats tokens for you</span>
	// 				<img alt="present" src={present} style={{ width: 100 }} />
	// 			</button>
	// 		);
	// 	}
	// 	// else if (introState === 'begin') {
	// 	// 	return <button>hello</button>;
	// 	// }
	// 	else {
	// 		return null;
	// 	}
	// };

	// const renderIntro = () => {
	// 	if (introState === 'appear') {
	// 		return (
	// 			<button onClick={onClickNewRoom} className="board-intro">
	// 				<span>create new room</span>
	// 				<img alt="shark" src={introShark} style={{ width: 100 }} />
	// 			</button>
	// 		);
	// 	} else if (introState === 'begin') {
	// 		return <button>hello</button>;
	// 	} else {
	// 		return null;
	// 	}
	// };

	const pausePlayVideo = () => {
		if (isYouTubeShowing) {
			setIsPaused(!isPaused);
		}
	};

	const backgroundImg = background.name?.startsWith('http')
		? background.name
		: backgrounds[background.name!];

	const [, drop] = useDrop({
		accept: 'item',
		drop(item: IPinnedItem, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
			const left = Math.round(item.left + delta.x);
			const top = Math.round(item.top + delta.y);
			console.log(item);
			moveItem(item.itemType, item.id, left, top, delta.x, delta.y);
			return undefined;
		}
	});

	const { isMapShowing } = useContext(MapsContext);
	const [isYouTubeShowing, setIsYouTubeShowing] = useState<boolean>(
		videoId !== ''
	);
	const [isPaused, setIsPaused] = useState<boolean>(true);
	// const [ volume, setVolume ] = useState<number>(0.4);

	useEffect(() => {
		if (isMapShowing) {
			setIsYouTubeShowing(false);
		} else {
			setIsYouTubeShowing(true);
		}
	}, [isMapShowing]);

	useEffect(() => {
		setIsPaused(false);
	}, [videoId]);

	return (
		<div
			className="board-container"
			style={{
				backgroundImage: `url(${backgroundImg})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover'
			}}
			ref={drop}
			onClick={()=>{setActivePanel("empty")}}
		>
			{(background.type === 'map' || isMapShowing) && <Map mapData={background.mapData} />}

			<div className="board-container-pin">
				{background.name && (
					<PinButton
						isPinned={background.isPinned}
						onPin={pinBackground}
						onUnpin={unpinBackground}
						placeholder="background"
					/>
				)}
			</div>

			{background.type === 'race' && (
				<iframe
					src={`https://3d-racing.zed.run/live/${background.raceId}`}
					width="100%"
					height="100%"
					title="zed racing"
					style={{ pointerEvents: 'auto' }}
				/>
			)}

			{background.type === 'marketplace' && (
				<iframe
					className="opensea-listings"
					title="Opensea Listings"
					src="https://opensea.io/assets?embed=true"
					width="100%"
					height="100%"
				></iframe>
			)}

			{background.type === 'video' && <YouTubeBackground
				isVideoPinned={isVideoPinned}
				lastTime={lastTime}
				videoId={videoId}
				isPaused={isPaused}
				volume={volume}
				isYouTubeShowing={isYouTubeShowing}
				pausePlayVideo={pausePlayVideo}
				onPinVideo={addVideo}
				unpinVideo={unpinVideo}
				videoRef={videoRef}
			/>}

			{!hideAllPins && waterfallChat.show &&<BoardObject
				id={'chat'}
				type="chat"
				onPin={() => {}}
				onUnpin={() => {}}
				updateSelectedPanelItem={updateSelectedPanelItem}
				setActivePanel={setActivePanel}
				chat={waterfallChat.messages}
				top={waterfallChat.top}
				left={waterfallChat.left}
			/>}

			{!hideAllPins ? (
				<TransitionGroup>
					{races.map((race) => (
						<CSSTransition
							key={race.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!race.isPinned) {
									const index = races.findIndex(
										(_race) => _race.key === race.key
									);
									updateRaces([
										...races.slice(0, index),
										...races.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...race}
								id={race.key}
								type="race"
								raceId={race.id}
								onPin={() => {
									pinRace(race.key);
								}}
								onUnpin={() => {
									unpinRace(race.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins && musicPlayer.playlist.length !== 0 && (
				<BoardObject
					id={'musicPlayer'}
					type="musicPlayer"
					onPin={() => {}}
					onUnpin={() => {}}
					playlist={musicPlayer.playlist}
					top={musicPlayer.top}
					left={musicPlayer.left}
					setActivePanel={setActivePanel}
				/>
			)}
			{!hideAllPins ? (
				<TransitionGroup>
					{horses.map((horse) => (
						<CSSTransition
							key={horse.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!horse.isPinned) {
									const index = horses.findIndex(
										(_horse) => _horse.key === horse.key
									);
									updateHorses([
										...horses.slice(0, index),
										...horses.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...horse}
								id={horse.key}
								type="horse"
								horseData={horse.horseData}
								onPin={() => {
									pinHorse(horse.key);
								}}
								onUnpin={() => {
									unpinHorse(horse.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			<TransitionGroup>
				{emojis.map((emoji) => (
					<CSSTransition
						key={emoji.key}
						timeout={emoji.dict.speed || 1000}
						classNames="note-transition"
						onEntered={() => {
							const index = emojis.findIndex(
								(_emoji) => _emoji.key === emoji.key
							);
							updateEmojis([
								...emojis.slice(0, index),
								...emojis.slice(index + 1)
							]);
						}}
					>
						<div
							style={{
								width: 40,
								height: 40,
								top: emoji.top,
								left: emoji.left,
								position: 'absolute',
								zIndex: 9999996,
								userSelect: 'none'
							}}
						>
							{emoji.dict.url ? (
								<img src={emoji.dict.url} alt={emoji.dict.name} width="24" />
							) : (
								emoji.dict.name
							)}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>

			<TransitionGroup>
				{musicNotes.map((note) => (
					<CSSTransition
						key={note.key}
						timeout={1000}
						classNames="note-transition"
						onEntered={() => {
							const noteIndex = musicNotes.findIndex(
								(_note) => _note.key === note.key
							);
							updateNotes([
								...musicNotes.slice(0, noteIndex),
								...musicNotes.slice(noteIndex + 1)
							]);
						}}
					>
						<MusicNote {...note} />
					</CSSTransition>
				))}
			</TransitionGroup>

			<TransitionGroup>
				{chatMessages.map((message) => (
					<CSSTransition
						key={message.key}
						timeout={7000}
						classNames="message-transition"
						onEntered={() => {
							const index = chatMessages.findIndex(
								(msg) => msg.key === message.key
							);
							updateChatMessages([
								...chatMessages.slice(0, index),
								...chatMessages.slice(index + 1)
							]);
						}}
					>
						<div
							className="board-message"
							style={
								message.isCentered
									? {
											width: window.innerWidth,
											textAlign: 'center',
											left: 0,
											right: 0,
											top: message.top,
											maxWidth: 'none',
											userSelect: 'auto'
									  }
									: {
											top: message.top,
											left: message.left
									  }
							}
						>
							{message.value}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>

			{/* <TransitionGroup>
				<CSSTransition
					appear
					timeout={5000}
					classNames="room-button-transition"
					onEnter={() => {
						setTimeout(() => {
							setIntroState('appear');
						}, 5000);
						setTimeout(() => {
							setIntroState('end');
						}, 20000);
					}}
				>
					<div className="room-button">{renderIntro()}</div>
				</CSSTransition>
				<CSSTransition
					appear
					timeout={5000}
					classNames="room-button-transition"
					onEnter={() => {
						setTimeout(() => {
							setPresentState('appear');
						}, 5000);
						setTimeout(() => {
							setPresentState('end');
						}, 20000);
					}}
				>
					<div className="room-present">{renderPresent()}</div>
				</CSSTransition>
			</TransitionGroup> */}

			{!hideAllPins ? (
				<TransitionGroup>
					{Object.values(pinnedText).map((text) => (
						<CSSTransition
							key={text.key}
							timeout={5000}
							classNames="gif-transition"
						>
							{!hideAllPins ? (
								<BoardObject
									{...text}
									id={text.key!}
									type="text"
									onPin={() => {}}
									onUnpin={() => {
										unpinText(text.key || '');
									}}
								/>
							) : null}
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}
			{!hideAllPins ? (
				<TransitionGroup>
					{tweets.map((tweet) => (
						<CSSTransition
							key={tweet.id}
							timeout={5000}
							classNames="gif-transition"
						>
							<BoardObject
								type="tweet"
								{...tweet}
								onPin={() => {
									pinTweet(tweet.id);
								}}
								onUnpin={() => {
									unpinTweet(tweet.id);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{gifs.map((gif) => (
						<CSSTransition
							key={gif.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!gif.isPinned) {
									const index = gifs.findIndex((_gif) => _gif.key === gif.key);
									updateGifs([
										...gifs.slice(0, index),
										...gifs.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								type="gif"
								id={gif.key}
								{...gif}
								onPin={() => {
									pinGif(gif.key);
								}}
								onUnpin={() => {
									unpinGif(gif.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{images.map((image) => (
						<CSSTransition
							key={image.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!image.isPinned) {
									const index = images.findIndex(
										(_image) => _image.key === image.key
									);
									updateImages([
										...images.slice(0, index),
										...images.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...image}
								id={image.key}
								type="image"
								imgSrc={image.url}
								onPin={() => {
									pinImage(image.key);
								}}
								onUnpin={() => {
									unpinImage(image.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{videos.map((video) => (
						<CSSTransition
							key={video.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!video.isPinned) {
									const index = videos.findIndex(
										(_video) => _video.key === video.key
									);
									updateVideos([
										...videos.slice(0, index),
										...videos.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								type="video"
								isPinnedPlaying={video.isPlaying}
								setPinnedVideoId={setPinnedVideoId}
								pinnedVideoId={pinnedVideoId}
								id={video.key}
								{...video}
								onPin={() => {
									pinVideo(video.key);
								}}
								onUnpin={() => {
									unpinVideo(video.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			<TransitionGroup>
				{animations.map((animation) => (
					<CSSTransition
						key={animation.type}
						timeout={5000}
						classNames="animation-transition"
						onEntered={() => {
							const index = animations.findIndex(
								(_animation) => _animation.type === animation.type
							);
							updateAnimations([
								...animations.slice(0, index),
								...animations.slice(index + 1)
							]);
						}}
					>
						<Animation {...animation} />
					</CSSTransition>
				))}
			</TransitionGroup>

			{!hideAllPins ? (
				<TransitionGroup>
					{NFTs.map((nft) => (
						<CSSTransition
							key={nft.key}
							timeout={5000}
							classNames="gif-transition"
							onEntered={() => {
								if (!nft.isPinned) {
									const index = NFTs.findIndex((_nft) => _nft.key === nft.key);
									updateNFTs([
										...NFTs.slice(0, index),
										...NFTs.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...nft}
								id={nft.key!}
								type="NFT"
								onPin={() => {
									pinNFT(nft.key!);
								}}
								onUnpin={() => {
									unpinNFT(nft.key!);
								}}
								addNewContract={addNewContract}
								onBuy={onBuy}
								onCancel={onCancel}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{/* <TransitionGroup> */}
			{loadingNFT && (
				<CSSTransition timeout={3000} classNames="gif-transition">
					<LoadingNFT submission={loadingNFT} />
				</CSSTransition>
			)}
			{/* </TransitionGroup> */}

			<div className="board-container-pin">
				{(videoId || isMapShowing || background.name || background.mapData) && (
					<PinButton
						isPinned={background.isPinned}
						onPin={pinBackground}
						onUnpin={unpinBackground}
						placeholder="background"
					/>
				)}
			</div>
			<div className="board-container-pin">
				{isMapShowing && background.type !== 'map' && (
					<PinButton
						isPinned={false}
						onPin={pinBackground}
						onUnpin={unpinBackground}
						placeholder="background"
					/>
				)}
			</div>

			{isMapShowing ? <Map /> : null}

			<UserCursors
				userLocations={userLocations}
				userProfiles={userProfiles}
				setUserProfiles={setUserProfiles}
				avatarChatMessages={avatarMessages}
				weather={weather}
			/>
		</div>
	);
};

interface IAnimationProps {
	type: AnimationTypes;
}

const Animation = ({ type }: IAnimationProps) => {
	if (type === 'start game') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '20vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '2em'
				}}
			>
				starting tower defense!
			</div>
		);
	}

	if (type === 'info') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '30vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '1.8em'
				}}
			>
				place your tower to defend yourself
			</div>
		);
	}

	if (type === 'end game') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '20vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '2em'
				}}
			>
				finished tower defense
			</div>
		);
	}

	return null;
};
