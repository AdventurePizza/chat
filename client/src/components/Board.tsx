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
	IPinnedItem,
	IUserLocations,
	IUserProfiles,
	IWeather,
	PinTypes
} from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IMusicNoteProps, MusicNote } from './MusicNote';

import { BoardObject } from './BoardObject';
import { PinButton } from './shared/PinButton';
import React from 'react';
import { UserCursors } from './UserCursors';
import { backgrounds } from './BackgroundImages';

interface IBoardProps {
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
	moveItem: (type: PinTypes, itemKey: string) => void;
}

export const Board = ({
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
	moveItem
}: IBoardProps) => {
	const backgroundImg = background.name?.startsWith('http')
		? background.name
		: backgrounds[background.name!];

	return (
		<div
			className="board-container"
			style={{
				backgroundImage: `url(${backgroundImg})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover'
			}}
		>
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
						timeout={1000}
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
							{emoji.type}
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
				{Object.values(pinnedText).map((text) => (
					<CSSTransition
						key={text.key}
						timeout={5000}
						classNames="gif-transition"
					>
						<BoardObject
							{...text}
							type="text"
							onPin={() => {}}
							onUnpin={() => {
								unpinText(text.key || '');
							}}
							onMove={() => moveItem('text', text.key || '')}
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
							{...gif}
							onPin={() => {
								pinGif(gif.key);
							}}
							onUnpin={() => {
								unpinGif(gif.key);
							}}
							onMove={() => moveItem('gif', gif.key)}
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
							type="image"
							imgSrc={image.url}
							onPin={() => {
								pinImage(image.key);
							}}
							onUnpin={() => {
								unpinImage(image.key);
							}}
							onMove={() => moveItem('image', image.key)}
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
