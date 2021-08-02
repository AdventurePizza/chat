import React, { useEffect, useState } from 'react';
import youtube from './youtube';

import { IconButton, Tooltip } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

interface IYouTubePanelProps {
	sendVideo: (id: string) => void; // Sends video id to socket event to be set as background and played

	lastQuery: string; // Last entered query in the search bar
	queriedVideos: Array<any>; // Videos returned from search query

	setVideoId: (id: string) => void;
	setLastQuery: (query: string) => void; // modifies BottomPanel state so last queried videos can persist
	setVolume: (volume: number) => void;
	setQueriedVideos: (queriedVideos: Array<any>) => void; // modifies BottomPanel state so last queried videos can persist
}

function YouTubeMusicPanel({
	setVideoId,
	setVolume,
	sendVideo,
	queriedVideos,
	setQueriedVideos,
	lastQuery,
	setLastQuery
}: IYouTubePanelProps) {
	// Displays 5 of the 15 videos at a time
	const [selectedVideos, setSelectedVideos] = useState<Array<any>>(
		queriedVideos.slice(0, 5)
	);
	const [text, setText] = useState<string>(lastQuery);
	const [leftIndex, setLeftIndex] = useState<any>(0);

	// Function called when search icon is clicked
	const queryYouTube = (ytquery: string) => {
		youtube
			.get('/search', {
				params: {
					q: ytquery
				}
			})
			.then((res) => {
				console.log('Querying YouTube...');
				setLastQuery(ytquery);
				setLeftIndex(0);
				setSelectedVideos(res.data.items.slice(0, 5));
				setQueriedVideos(res.data.items);
			});
	};

	useEffect(() => {
		if (leftIndex >= 0) {
			setSelectedVideos(queriedVideos.slice(leftIndex, leftIndex + 5));
		}
	}, [leftIndex, queriedVideos]);

	const [value, setValue] = useState(30);

	const handleChange = (event: any, newValue: any) => {
		setValue(newValue);
		setVolume(newValue / 100);
	};

	return (
		<div className="youtube-container">
			<div className="youtube-search">
				<InputBase
					className="searchbar"
					placeholder="Search YouTube"
					onChange={(e) => setText(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && queryYouTube(text)}
					value={text}
				/>
				<IconButton color="primary" onClick={() => queryYouTube(text)}>
					<SearchIcon />
				</IconButton>
			</div>
			<div className="youtube-list-container">
				<ul className="youtube-list">
					{selectedVideos.map((video, i) => (
						<Tooltip key={i} title={video.snippet.title}>
							<li>
								<img
									alt="YouTube Video Thumbnail"
									className="youtube-thumbnail"
									src={video.snippet.thumbnails.default.url}
									onClick={() => {
										sendVideo(video.id.videoId);
										setVideoId(video.id.videoId);
									}}
								/>
							</li>
						</Tooltip>
					))}
				</ul>
				<div className="youtube-controls">
					<VolumeDown />
					<Slider
						style={{
							width: '200px'
						}}
						value={value}
						onChange={handleChange}
					/>
					<VolumeUp />
				</div>
				<IconButton
					disabled={lastQuery === '' || leftIndex <= 0}
					color="primary"
					onClick={() => {
						setLeftIndex(leftIndex - 5);
					}}
				>
					<NavigateBeforeIcon />
				</IconButton>

				<IconButton
					disabled={lastQuery === '' || leftIndex >= 10}
					color="primary"
					onClick={() => {
						setLeftIndex(leftIndex + 5);
					}}
				>
					<NavigateNextIcon />
				</IconButton>
			</div>
		</div>
	);
}

export default YouTubeMusicPanel;
