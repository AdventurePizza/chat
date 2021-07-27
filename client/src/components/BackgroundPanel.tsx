import {
	Avatar,
	FormControlLabel,
	IconButton,
	Switch
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { backgroundIcons } from './BackgroundImages';
import { FirebaseContext } from '../contexts/FirebaseContext';
import loadingDots from '../assets/loading-dots.gif';

interface IBackgroundPanelProps {
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	images: IImagesState[];
	setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
}

export interface IResponseDataUnsplash {
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

export interface IResponseDataGoogle {
	url: string;
	origin: {
		title: string;
	};
}

export interface IImagesState {
	alt: string;
	imageLink: string;
	thumbnailLink: string;
	id: string;
}

export interface IIconsProps {
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	isSwitchChecked: boolean;
}

export type unsplashIconsProps = IIconsProps & { images: IImagesState[] };

export const getSearchedUnsplashImages = async (text: string) =>
	await axios.get('https://api.unsplash.com/search/photos', {
		params: { query: text },
		headers: {
			authorization: 'Client-ID MZjo-jtjTqOzH1e0MLB5wDm19tMAhILsBEOcS9uGYyQ'
		}
	});

const BackgroundPanel = ({
	sendImage,
	images,
	setImages
}: IBackgroundPanelProps) => {
	const [text, setText] = useState('');
	const [isSwitchChecked, setIsSwitchChecked] = useState(false);
	const isImagesEmpty = images.length === 0;
	const [searchByGoogle, setSearchByGoogle] = useState(false);
	const firebaseContext = useContext(FirebaseContext);
	const [loading, setLoading] = useState(false);


	const googleSearch = async (textToSearch: string) => {
		setLoading(true);
		const res = await firebaseContext.getImage(textToSearch);
		const response = JSON.parse(JSON.stringify(res.message as string));

		const imageDataWanted = response.map(
			({ url, origin }: IResponseDataGoogle) => {
				const { title } = origin;
				return {
					alt: title,
					imageLink: url,
					thumbnailLink: url,
					id: url
				};
			}
		);

		setLoading(false);
		if (setImages) setImages(imageDataWanted);
	}

	useEffect(() => {
		if (!isImagesEmpty) return;

		searchSubmit('trending', setImages);
	}, [isImagesEmpty, setImages]); // Wanted empty deps but warning said to put them in.....

	return (
		<div className="background-container" style={{overflowY: 'auto'}}>
			<div className="background-icon-list">
				<InputBase
					placeholder="Search Images"
					onChange={(e) => setText(e.target.value)}
					onKeyPress={(e) => {
							if(e.key === 'Enter'){
								if(!searchByGoogle){searchSubmit(text, setImages);} else{googleSearch(text);}
							}
						}
					}
					value={text}
				/>
				<IconButton
					color="primary"
					onClick={() => {if(!searchByGoogle){searchSubmit(text, setImages);} else{googleSearch(text);}}}
				>
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
				<div style={{ display: 'flex' }}>
					<FormControlLabel
						checked={searchByGoogle}
						onChange={() => {
							setSearchByGoogle(!searchByGoogle);
						}}
						control={<Switch color="primary" />}
						label="Google"
					/>
					{loading &&
					<img
						style={{
							height: 8,
							width: 30,
							paddingTop: 20
						}}
						src={loadingDots}
						alt="three dots"
					/>}
				</div>

			</div>
			<div className="background-icon-list" >
				{isImagesEmpty ? (
					<DefaultIcons
						sendImage={sendImage}
						isSwitchChecked={isSwitchChecked}
					/>
				) : (
					<UnsplashIcons
						sendImage={sendImage}
						images={images}
						isSwitchChecked={isSwitchChecked}
					/>
				)}
			</div>
		</div>
	);
};

const DefaultIcons = ({ sendImage, isSwitchChecked }: IIconsProps) => {
	const defaultIcons = Object.keys(backgroundIcons).map((backgroundName) => {
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

	return <>{defaultIcons}</>;
};

const UnsplashIcons = ({
	sendImage,
	images,
	isSwitchChecked
}: unsplashIconsProps) => {
	const unsplashIcons = images.map(({ alt, thumbnailLink, imageLink, id }) => (
		<IconButton
			key={id}
			onClick={() =>
				sendImage(imageLink, isSwitchChecked ? 'background' : 'image')
			}
		>
			<Avatar variant="rounded" src={thumbnailLink} alt={alt} />
		</IconButton>
	));

	return <>{unsplashIcons}</>;
};

export const searchSubmit = async (
	textToSearch: string,
	setImages?: React.Dispatch<React.SetStateAction<IImagesState[]>>
) => {

	const response = await getSearchedUnsplashImages(textToSearch);

	const imageDataWanted = response.data.results.map(
		({ urls, alt_description, id }: IResponseDataUnsplash) => {
			const { regular, thumb } = urls;
			return {
				alt: alt_description,
				imageLink: regular,
				thumbnailLink: thumb,
				id: id
			};
		}
	);

	if (setImages) setImages(imageDataWanted);
};

export default BackgroundPanel;
