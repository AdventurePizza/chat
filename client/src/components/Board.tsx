import './Board.css';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IChatMessage, IEmoji, IGifs } from '../types';
import { IMusicNoteProps, MusicNote } from './MusicNote';

import { Gif } from '@giphy/react-components';
import React from 'react';

interface IBoardProps {
	musicNotes: IMusicNoteProps[];
	updateNotes: (notes: IMusicNoteProps[]) => void;
	emojis: IEmoji[];
	updateEmojis: (emojis: IEmoji[]) => void;
	gifs: IGifs[];
	updateGifs: (gifs: IGifs[]) => void;
	chatMessages: IChatMessage[];
	updateChatMessages: (chatMessages: IChatMessage[]) => void;
}

export const Board = ({
	musicNotes,
	updateNotes,
	emojis,
	updateEmojis,
	gifs,
	updateGifs,
	chatMessages,
	updateChatMessages
}: IBoardProps) => {
	return (
		<div className="board-container">
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
								zIndex: 9999999,
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
							style={{
								top: message.top,
								left: message.left
							}}
						>
							{message.value}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>

			<TransitionGroup>
				{gifs.map((gif) => (
					<CSSTransition
						key={gif.key}
						timeout={2000}
						classNames="note-transition"
						onEntered={() => {
							const index = gifs.findIndex((_gif) => _gif.key === gif.key);
							updateGifs([...gifs.slice(0, index), ...gifs.slice(index + 1)]);
						}}
					>
						<div
							style={{
								top: gif.top,
								left: gif.left,
								position: 'absolute',
								zIndex: 9999999,
								userSelect: 'none'
							}}
						>
							<Gif gif={gif.data} width={180} noLink={true} />
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>

			{/* <div className="board-container" style={{backgroundImage: background ? background.src : undefined}}></div> */}
		</div>
	);
};
