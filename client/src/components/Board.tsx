import './Board.css';

import {
	AnimationTypes,
	IAnimation,
	IAvatarChatMessages,
	IBackgroundState,
	IBoardImage,
	IChatMessage,
	IEmoji,
	IGifs,
	IOrder,
	IPinnedItem,
	IUserLocations,
	IUserProfiles,
	IWeather,
	PinTypes
} from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IMusicNoteProps, MusicNote } from './MusicNote';
import { XYCoord, useDrop } from 'react-dnd';

import { BoardObject } from './BoardObject';
import { PinButton } from './shared/PinButton';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { UserCursors } from './UserCursors';
import { backgrounds } from './BackgroundImages';
import { ISubmit } from './NFT/OrderInput';
import { LoadingNFT } from './NFT/NFTPanel';
import { CustomToken as NFT } from '../typechain/CustomToken';
import introShark from '../assets/intro/leftshark.gif';

interface IBoardProps {
	videoId: string;
	musicNotes: IMusicNoteProps[];
	updateNotes: (notes: IMusicNoteProps[]) => void;
	emojis: IEmoji[];
	updateEmojis: (emojis: IEmoji[]) => void;
	gifs: IGifs[];
	updateGifs: (gifs: IGifs[]) => void;
	images: IBoardImage[];
	updateImages: (images: IBoardImage[]) => void;
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
	pinBackground: () => void;
	unpinBackground: () => void;
	background: IBackgroundState;
	pinnedText: { [key: string]: IPinnedItem };
	unpinText: (textKey: string) => void;
	moveItem: (
		type: PinTypes,
		itemKey: string,
		left: number,
		top: number
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
}

export const Board = ({
	videoId,
	musicNotes,
	updateNotes,
	emojis,
	updateEmojis,
	gifs,
	updateGifs,
	images,
	updateImages,
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
	onClickNewRoom
}: IBoardProps) => {
	const [introState, setIntroState] = useState<'begin' | 'appear' | 'end'>(
		'begin'
	);

	const renderIntro = () => {
		if (introState === 'appear') {
			return (
				<button onClick={onClickNewRoom} className="board-intro">
					<span>create new room</span>
					<img alt="shark" src={introShark} style={{ width: 100 }} />
				</button>
			);
		} else if (introState === 'begin') {
			return <button>hello</button>;
		} else {
			return null;
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
			moveItem(item.itemType, item.id, left, top);
			return undefined;
		}
	});

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
		>
			<div className="youtube-background">
				{(videoId !== "") ? (
					<ReactPlayer width="100%" height="100%"
						url={`https://www.youtube.com/watch?v=${videoId}`}
						playing={true}	// Autoplay video
						volume={0.4}
						style={{
							position: "fixed",
							zIndex: -100	// puts video at the very back so it doesn't disturb the rest of the components
						}}
					/>) : null
				}
			</div>
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

			<TransitionGroup>
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
			</TransitionGroup>

			<TransitionGroup>
				{Object.values(pinnedText).map((text) => (
					<CSSTransition
						key={text.key}
						timeout={5000}
						classNames="gif-transition"
					>
						<BoardObject
							{...text}
							id={text.key!}
							type="text"
							onPin={() => {}}
							onUnpin={() => {
								unpinText(text.key || '');
							}}
						/>
					</CSSTransition>
				))}
			</TransitionGroup>

			<TransitionGroup>
				{gifs.map((gif) => (
					<CSSTransition
						key={gif.key}
						timeout={5000}
						classNames="gif-transition"
						onEntered={() => {
							if (!gif.isPinned) {
								const index = gifs.findIndex((_gif) => _gif.key === gif.key);
								updateGifs([...gifs.slice(0, index), ...gifs.slice(index + 1)]);
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

			<TransitionGroup>
				{NFTs.map((nft) => (
					<CSSTransition
						key={nft.key}
						timeout={5000}
						classNames="gif-transition"
						onEntered={() => {
							if (!nft.isPinned) {
								const index = NFTs.findIndex((_nft) => _nft.key === nft.key);
								updateNFTs([...NFTs.slice(0, index), ...NFTs.slice(index + 1)]);
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

			{/* <TransitionGroup> */}
			{loadingNFT && (
				<CSSTransition timeout={3000} classNames="gif-transition">
					<LoadingNFT submission={loadingNFT} />
				</CSSTransition>
			)}
			{/* </TransitionGroup> */}

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
