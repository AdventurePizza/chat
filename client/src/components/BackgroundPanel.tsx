import {
	Avatar,
	FormControlLabel,
	IconButton,
	Switch
} from '@material-ui/core';
import React, { useState } from 'react';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { backgroundIcons } from './BackgroundImages';

interface IBackgroundPanelProps {
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
}

interface IResponseData {
	urls: {
		full: string;
		raw: string;
		regular: string;
		small: string;
		thumb: string;
	};
	alt_description: string;
	id: string;
}

interface IImagesState {
	alt: string;
	imageLink: string;
	thumbnailLink: string;
	id: string;
}

const BackgroundPanel = ({ sendImage }: IBackgroundPanelProps) => {
	const [text, setText] = useState('');
	const [images, setImages] = useState<IImagesState[]>([]);
	const [isSwitchChecked, setIsSwitchChecked] = useState(false);

	const displayDefaultIcons = () =>
		Object.keys(backgroundIcons).map((backgroundName) => {
			const backgroundIcon = backgroundIcons[backgroundName];
			return (
				<IconButton
					key={backgroundName}
					onClick={() => {
						sendImage(backgroundName, isSwitchChecked ? 'background' : 'image');
					}}
				>
					<Avatar
						variant="rounded"
						src={backgroundIcon}
						alt={backgroundName + ' background'}
					/>
				</IconButton>
			);
		});

	const displayUnSplashIcons = () =>
		images.map(({ alt, thumbnailLink, imageLink, id }) => {
			return (
				<IconButton
					key={id}
					onClick={() =>
						sendImage(imageLink, isSwitchChecked ? 'background' : 'image')
					}
				>
					<Avatar variant="rounded" src={thumbnailLink} alt={alt} />
				</IconButton>
			);
		});

	const onSearchSubmit = async () => {
		const response = await axios.get('https://api.unsplash.com/search/photos', {
			params: { query: text },
			headers: {
				authorization: 'Client-ID MZjo-jtjTqOzH1e0MLB5wDm19tMAhILsBEOcS9uGYyQ' // Change this to actual
			}
		});
		const responseData = response.data.results;
		const imageDataWanted = responseData.map(
			({ urls, alt_description, id }: IResponseData) => {
				const { regular, thumb } = urls;
				return {
					alt: alt_description,
					imageLink: regular,
					thumbnailLink: thumb,
					id: id
				};
			}
		);
		setImages(imageDataWanted);
	};

	const iconsToDisplay =
		images.length === 0 ? displayDefaultIcons : displayUnSplashIcons;

	return (
		<div className="background-container">
			<div className="background-icon-list">
				<InputBase
					placeholder="Search Images"
					onChange={(e) => setText(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
					value={text}
				/>
				<IconButton color="primary" onClick={onSearchSubmit}>
					<SearchIcon />
				</IconButton>
				<div style={{ display: 'flex' }}>
					<FormControlLabel
						checked={isSwitchChecked}
						onChange={() => setIsSwitchChecked(!isSwitchChecked)}
						control={<Switch color="primary" />}
						label="background"
					/>
				</div>
			</div>
			<div className="background-icon-list">{iconsToDisplay()}</div>
		</div>
	);
};

export default BackgroundPanel;
