import React from 'react';
import musicNote from '../assets/musical-note.svg';

export interface IMusicNoteProps {
	top: number;
	left: number;
	key: string;
}

export const MusicNote = ({ top, left }: IMusicNoteProps) => {
	return (
		<img
			alt="musical note"
			style={{ width: 40, height: 40, top, left, position: 'absolute' }}
			src={musicNote}
		/>
	);
};
