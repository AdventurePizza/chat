import ReactPlayer from 'react-player';
import React from 'react';

interface IYouTubeBackgroundProps {
	videoId?: string;
	isPaused: boolean;
	volume: number;
	isYouTubeShowing: boolean;
	pausePlayVideo: () => void;
}

function YouTubeBackground({
	videoId,
	isPaused,
	volume,
	isYouTubeShowing,
	pausePlayVideo
}: IYouTubeBackgroundProps) {
	return (
		<div
			className="youtube-background"
			onClick={() => pausePlayVideo()}
			style={{ position: 'relative', zIndex: 'auto' }} // makes maps disapear; pointerEvents: "none" allows cursor to be tracked
		>
			{videoId !== '' && isYouTubeShowing ? (
				<ReactPlayer
					width="100%"
					height="100%"
					url={`https://www.youtube.com/embed/${videoId}`}
					controls={true}
					style={{
						pointerEvents: 'none'
					}}
					playing={!isPaused} // Autoplay video
					volume={volume} // Add volume slider later
				/>
			) : null}
		</div>
	);
}

export default YouTubeBackground;
