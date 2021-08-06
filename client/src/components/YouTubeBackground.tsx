import ReactPlayer from 'react-player';
import React, { useState, useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { PinButtonImage } from './shared/PinButton';
import { Cancel } from '@material-ui/icons';
import { AppStateContext } from '../contexts/AppStateContext';

interface IYouTubeBackgroundProps {
  isVideoPinned: boolean;
  videoId?: string;
  onPinVideo: (videoId: string | undefined) => void;
  unpinVideo: (videoId: string | undefined) => void;
  isPaused: boolean;
  lastTime: any;
  volume: number;
  isYouTubeShowing: boolean;
  pausePlayVideo: () => void;
  videoRef: React.Ref<any>;
}

function YouTubeBackground({
  isVideoPinned,
  videoId,
  onPinVideo,
  unpinVideo,
  isPaused,
  lastTime,
  volume,
  isYouTubeShowing,
  pausePlayVideo,
  videoRef
}: IYouTubeBackgroundProps) {
  const { socket } = useContext(AppStateContext);

  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div className="youtube-background"
			onClick={() => pausePlayVideo()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ 
        position: "relative",
        zIndex: "auto",
        height: "100vh",
        width: "100%"
      }} // makes maps disapear; pointerEvents: "none" allows cursor to be tracked
    >
      {(videoId !== "" && isYouTubeShowing) ? (
        <ReactPlayer width="100%" height="100%"
					url={`https://www.youtube.com/embed/${videoId}`}
          controls={true}
          ref={videoRef}
					style={{
						pointerEvents: isHovering ? "auto" : "none"
					}}
          playing={!isPaused}	// Autoplay video
          volume={volume}	// Add volume slider later
          config={{
            youtube: {
              playerVars: { start: Math.floor(lastTime) } // Must be an integer, so Math.ceil is used
            },
          }}
        />) : null
      }
      {videoId !== "" ?
      <div className="pin-video-button-wrapper"
        style={{
          position: "absolute",
          // backgroundColor: "red",
          width: "10%",
          height: "10%",
          top: "70px",
          right: 0,
          margin: "10px"
        }}
      >
        {videoId !== "" && !isVideoPinned ? 
        <Tooltip title="Pin Video">
					<IconButton 
          style={{
            backgroundColor: videoId !== '' ? "rgb(211, 211, 211, 0.6)" : "none",
            float: "right",
          }}
          onClick={() => {
            onPinVideo(videoId);
            socket.emit('event', {
              key: 'youtube',
              value: videoId,
              pin: true
            });
          }}>
						<PinButtonImage />
					</IconButton>
				</Tooltip> : 
        <Tooltip title="Unpin Video">
        <IconButton 
        style={{
          backgroundColor: videoId !== '' ? "rgb(211, 211, 211, 0.6)" : "none",
          float: "right",
        }}
        onClick={() => {
          unpinVideo(videoId);
        }}>
          <Cancel />
        </IconButton>
        </Tooltip>
        }
      </div> : null}
    </div>
  )
}

export default YouTubeBackground;