import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface PlayListState {
  currentMusicIndex: number
}

interface MusicPlayerProps {
	playlist?: string[];
}

export const MusicPlayer = (props: MusicPlayerProps) => {
  const {
      playlist
  } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    if(playlist!.length === 0){
      return;
    }
    else if(currentIndex === 0){
      setCurrentIndex(playlist!.length -1);
    }
    else{
      setCurrentIndex(currentIndex-1);
    }
  };
  const next = () => {
    if(playlist!.length === 0){
      return;
    }
    else if(currentIndex === playlist!.length - 1 ){
      setCurrentIndex(0);
    }
    else{
      setCurrentIndex(currentIndex+1);
    }
  };

  return (
    <div>
      {playlist && <AudioPlayer
          autoPlayAfterSrcChange={true}
          showSkipControls={true}
          showJumpControls={false}
          src={playlist[currentIndex]}
          onClickPrevious={prev}
          onClickNext={next}
        />
      }
      {playlist?.length}
      {playlist && playlist[currentIndex]}
    </div>
  )
}
