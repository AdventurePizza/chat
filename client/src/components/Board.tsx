import "./Board.css";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { IMusicNoteProps, MusicNote } from "./MusicNote";

import React from "react";

interface IBoardProps {
  musicNotes: IMusicNoteProps[];
  updateNotes: (notes: IMusicNoteProps[]) => void;
}

export const Board = ({ musicNotes, updateNotes }: IBoardProps) => {
  return (
    <div className="board-container">
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
                ...musicNotes.slice(noteIndex + 1),
              ]);
            }}
          >
            <MusicNote {...note} />
            {/* <img
              alt="music note"
              src={musicNote}
              className="music-note"
              style={{
                top: noteCoords.top,
                left: noteCoords.left,
              }}
            /> */}
          </CSSTransition>
        ))}
      </TransitionGroup>
      {/* {musicNotes.map((note) => (
        <MusicNote {...note} />
      ))} */}
    </div>
  );
};
