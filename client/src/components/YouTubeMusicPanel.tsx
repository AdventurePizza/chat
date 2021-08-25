import React, { useEffect, useState, useContext } from 'react';
import youtube from './youtube';

import {
	IconButton,
	Tooltip,
	FormControlLabel,
	Switch
} from '@material-ui/core';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { AppStateContext } from '../contexts/AppStateContext';

interface IYouTubePanelProps {
	sendVideo: (id: string) => void; // Sends video id to socket event to be set as background and played

	lastQuery: string; // Last entered query in the search bar
	queriedVideos: Array<any>; // Videos returned from search query
	isVideoShowing: boolean;
	lastVideoId: string;
	hideAllPins: boolean;
	isBackground: boolean;

	setVideoId: (id: string) => void;
	setLastVideoId: (id: string) => void;
	setIsVideoShowing: (value: boolean) => void;
	setLastQuery: (query: string) => void; // modifies BottomPanel state so last queried videos can persist
	setVolume: (volume: number) => void;
	setHideAllPins: (value: boolean) => void;
	setQueriedVideos: (queriedVideos: Array<any>) => void; // modifies BottomPanel state so last queried videos can persist
	updateLastTime: () => void;
	addVideo: (videoId: string | undefined) => void;
}

function YouTubeMusicPanel({
	setVideoId,
	setLastVideoId,
	lastVideoId,
	setVolume,
	sendVideo,
	queriedVideos,
	setQueriedVideos,
	lastQuery,
	setLastQuery,
	setIsVideoShowing,
	isVideoShowing,
	updateLastTime,
	hideAllPins,
	setHideAllPins,
	isBackground,
	addVideo
}: IYouTubePanelProps) {
	// Displays 5 of the 15 videos at a time
	const [selectedVideos, setSelectedVideos] = useState<Array<any>>(
		queriedVideos.slice(0, 5)
	);
	const [text, setText] = useState<string>(lastQuery);
	const [leftIndex, setLeftIndex] = useState<any>(0);
	const [value, setValue] = useState<number>(30);
	const { socket } = useContext(AppStateContext);

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

	const handleChange = (event: any, newValue: any) => {
		setValue(newValue);
		setVolume(newValue / 100);
	};

	return (
		<div className="youtube-container">

			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<div style={{ paddingRight: 20 }} >
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
				<div style={{ paddingInline: 50 }} >
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
				<FormControlLabel
					checked={isVideoShowing}
					onChange={() => {
						const newVal = !isVideoShowing;
						setIsVideoShowing(newVal);

						if (newVal) {
							setVideoId(lastVideoId);
							// console.log({lastTime})
						} else {
							setVideoId('');
							updateLastTime();
						}
					}}
					control={<Switch color="primary" />}
					label="Show Video"
				/>

				<FormControlLabel
					checked={hideAllPins}
					onChange={() => {
						const newVal = !hideAllPins;
						setHideAllPins(newVal);

						if (newVal) {
							console.log('pins hidden');
						} else {
							console.log('pins shown');
						}
					}}
					control={<Switch color="primary" />}
					label="Hide Pins"
				/>
			</div>

			<div
				className="youtube-list-container"
				style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
			>
				<div className="button-wrapper">
					<IconButton
						disabled={lastQuery === '' || leftIndex <= 0}
						color="primary"
						onClick={() => {
							setLeftIndex(leftIndex - 5);
						}}
					>
						<NavigateBeforeIcon />
					</IconButton>
				</div>
				<ul
					className="youtube-list"
					style={{
						display: 'inline-block'
					}}
				>
					{selectedVideos.map((video, i) => (
						<Tooltip key={i} title={video.snippet.title}>
							<li>
								<img
									alt="YouTube Video Thumbnail"
									className="youtube-thumbnail"
									src={video.snippet.thumbnails.default.url}
									onClick={() => {
										const videoId = video.id.videoId;
										if(isBackground){
											sendVideo(videoId);
											setVideoId(videoId);
											setLastVideoId(videoId);
											setIsVideoShowing(true);
										}
										else{
											addVideo(videoId);
											socket.emit('event', {
												key: 'youtube',
												value: videoId,
												pin: true
											  });
										}
									}}
								/>
							</li>
						</Tooltip>
					))}
				</ul>
				<div className="button-wrapper">
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

		</div>
	);
}

export default YouTubeMusicPanel;
