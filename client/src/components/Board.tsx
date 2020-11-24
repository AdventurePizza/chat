import "./Board.css";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { IMusicNoteProps, MusicNote } from "./MusicNote";

import { IEmoji } from "../types";
import React from "react";

interface IBoardProps {
  musicNotes: IMusicNoteProps[];
  updateNotes: (notes: IMusicNoteProps[]) => void;
  emojis: IEmoji[];
  updateEmojis: (emojis: IEmoji[]) => void;
}

export const Board = ({
  musicNotes,
  updateNotes,
  emojis,
  updateEmojis,
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
                ...emojis.slice(index + 1),
              ]);
            }}
          >
            {/* <MusicNote {...note} /> */}
            <div
              style={{
                width: 40,
                height: 40,
                top: emoji.top,
                left: emoji.left,
                position: "absolute",
                zIndex: 9999999,
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
                ...musicNotes.slice(noteIndex + 1),
              ]);
            }}
          >
            <MusicNote {...note} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};
