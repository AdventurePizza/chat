import ReactPlayer from 'react-player';
import React, { useState } from 'react';
import "./Board.css";


interface IYouTubeBackgroundProps {
  videoId?: string;
  isPaused: boolean;
  lastTime: any;
  volume: number;
  pausePlayVideo: () => void;
  videoRef: React.Ref<any>;
  showYoutube: boolean;
}

function YouTubeBackground({
  videoId,
  isPaused,
  lastTime,
  volume,
  pausePlayVideo,
  videoRef,
  showYoutube
}: IYouTubeBackgroundProps) {


  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div className={showYoutube ? "youtube-background-active" : "youtube-background"}
			onClick={() => pausePlayVideo()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ 
        position: "relative",
        //zIndex: "auto",
        height: "100vh",
        width: "100%"
      }} // makes maps disapear; pointerEvents: "none" allows cursor to be tracked
    >
      {videoId !== "" ? (
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
     
    </div>
  )
}

export default YouTubeBackground;