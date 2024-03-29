import {
	Avatar,
	IconButton,
	makeStyles, 
	createStyles, 
	Theme
} from '@material-ui/core';
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { backgroundIcons } from './BackgroundImages';
import { AppStateContext } from '../contexts/AppStateContext';
import { BackgroundTypes, IMap } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    size: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  }),
);

interface IBackgroundPanelProps {
	//sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	images: IImagesState[];
	setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
	searchValue: string;
	isGoogle: boolean;
	isBackground: boolean;
	searchSubmit: (
		textToSearch: string,
		setImages?: React.Dispatch<React.SetStateAction<IImagesState[]>>
	) => void;
	addBackground: (type: BackgroundTypes, data: IMap | string) => void;
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
	//sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	addBackground: (type: BackgroundTypes, data: IMap | string) => void;
	isSwitchChecked: boolean;
}

export type unsplashIconsProps = IIconsProps & { images: IImagesState[] };

export const getSearchedUnsplashImages = async (text: string) =>
	await axios.get('https://api.unsplash.com/search/photos?per_page=15', {
		params: { query: text },
		headers: {
			authorization: 'Client-ID MZjo-jtjTqOzH1e0MLB5wDm19tMAhILsBEOcS9uGYyQ'
		}
	});

const BackgroundPanel = ({
	addBackground,
	images,
	setImages,
	isBackground,
	searchSubmit
}: IBackgroundPanelProps) => {
	const isImagesEmpty = images.length === 0;

	useEffect(() => {
		if (!isImagesEmpty) return;

		searchSubmit('trending', setImages);
	}, [isImagesEmpty, setImages, searchSubmit]); // Wanted empty deps but warning said to put them in.....

	return (
		<div className="background-container" style={{overflowY: 'auto'}}>
			<div className="background-icon-list" >
				{isImagesEmpty ? (
					<DefaultIcons
						addBackground={addBackground}
						isSwitchChecked={isBackground}
					/>
				) : (
					<UnsplashIcons
						addBackground={addBackground}
						images={images}
						isSwitchChecked={isBackground}
					/>
				)}
			</div>
		</div>
	);
};

const DefaultIcons = ({ addBackground, isSwitchChecked }: IIconsProps) => {
	const classes = useStyles();
	const { socket } = useContext(AppStateContext);
	const defaultIcons = Object.keys(backgroundIcons).map((backgroundName) => {
		const backgroundIcon = backgroundIcons[backgroundName];

		return (
			<IconButton
				key={backgroundName}
				onClick={() => {
					//sendImage(backgroundName, isSwitchChecked ? 'background' : 'image');
					addBackground("image", backgroundName);
					socket.emit('event', {
						key: 'background',
						type: "image",
						func: 'add',
						name: backgroundName
					})
				}}
			>
				<Avatar
					variant="rounded"
					src={backgroundIcon}
					alt={backgroundName + ' background'}
					className={classes.size} 
				/>
			</IconButton>
		);
	});

	return <>{defaultIcons}</>;
};

const UnsplashIcons = ({
	addBackground,
	images,
	isSwitchChecked
}: unsplashIconsProps) => {
	const classes = useStyles();
	const { socket } = useContext(AppStateContext);
	const unsplashIcons = images.map(({ alt, thumbnailLink, imageLink, id }) => (
		<IconButton
			key={id}
			onClick={() => {
				//sendImage(imageLink, isSwitchChecked ? 'background' : 'image')
				addBackground("image", imageLink);
				socket.emit('event', {
					key: 'background',
					type: "image",
					func: 'add',
					name: imageLink
				})
			}}
		>
			<Avatar variant="rounded" src={thumbnailLink} alt={alt} className={classes.size} />
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