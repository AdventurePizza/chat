import {
	Avatar,
	FormControlLabel,
	IconButton,
	Switch,
	makeStyles, 
	createStyles, 
	Theme,
	InputBase 
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {
	Carousel,
	SearchContextManager,
} from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api'
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { backgroundIcons } from './BackgroundImages';
import { FirebaseContext } from '../contexts/FirebaseContext';
import loadingDots from '../assets/loading-dots.gif';
import YouTubeMusicPanel from './YouTubeMusicPanel';

const API_KEY = 'lK7kcryXkXX2eV2kOUbVZUhaYRLlrWYh';
const giphyfetch = new GiphyFetch(API_KEY)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    size: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  }),
);

interface IBackgroundPanelProps {
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	images: IImagesState[];
	setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
	sendGif: (gif: IGif) => void;
	//youtube
	sendVideo: (id: string) => void; // Sends video id to socket event to be set as background and played
	lastQuery: string; // Last entered query in the search bar
	queriedVideos: Array<any>; // Videos returned from search query
	isVideoShowing: boolean;
	lastVideoId: string;
	hideAllPins: boolean;
	setVideoId: (id: string) => void;
	setLastVideoId: (id: string) => void;
	setIsVideoShowing: (value: boolean) => void;
	setLastQuery: (query: string) => void; // modifies BottomPanel state so last queried videos can persist
	setVolume: (volume: number) => void;
	setHideAllPins: (value: boolean) => void;
	setQueriedVideos: (queriedVideos: Array<any>) => void; // modifies BottomPanel state so last queried videos can persist
	updateLastTime: () => void;
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

interface IGifsProps {
	//Gif data IGif
	sendGif: (gif: IGif) => void;
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
	sendImage,
	images,
	setImages,
	sendGif,
	//youtube
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
	setHideAllPins
}: IBackgroundPanelProps) => {
	const [text, setText] = useState('');
	const [isSwitchChecked, setIsSwitchChecked] = useState(false);
	const isImagesEmpty = images.length === 0;
	const [searchByGoogle, setSearchByGoogle] = useState(false);
	const [searchByUnsplash, setSearchByUnsplash] = useState(true);
	const [searchByGiphy, setSearchByGiphy] = useState(false);
	const [searchByYoutube, setSearchByYoutube] = useState(false);
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

	const GifComponent = ({ sendGif }: IGifsProps) => {
		let search = text;
		if(!search){
			search = "hello";
		}
		const fetchGifs = (offset: number) => giphyfetch.search(search, { offset, limit: 10 })

		return (
			<div className='background-icon-list'>
				<Carousel
					key={search}
					gifHeight={130}
					gutter={6}
					fetchGifs={fetchGifs}
					onGifClick={(gif: IGif) =>{
						if(isSwitchChecked)
							sendImage("https://i.giphy.com/media/" + gif.id + "/giphy.webp",  'background' );
						else
						sendGif(gif);
					}}
					noLink={true}
				/>
			</div>
		);
	};

	useEffect(() => {
		if (!isImagesEmpty) return;
		searchSubmit('trending', setImages);
	}, [isImagesEmpty, setImages]); // Wanted empty deps but warning said to put them in.....

	return (
		<div className="background-container" style={{overflowY: 'auto'}}>
			<div className="background-search-settings">
				<div style={{ display: 'flex' }}>
					<FormControlLabel
						checked={isSwitchChecked}
						onChange={() => setIsSwitchChecked(!isSwitchChecked)}
						control={<Switch color="primary" />}
						label="background"
					/>
				</div>
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
						checked={searchByGoogle}
						onChange={() => {
							setSearchByGoogle(true);
							setSearchByUnsplash(false);
							setSearchByGiphy(false);
							setSearchByYoutube(false);
						}}
						control={<Switch color="primary" />}
						label="Google"
					/>
					<FormControlLabel
						checked={searchByUnsplash}
						onChange={() => {
							setSearchByGoogle(false);
							setSearchByUnsplash(true);
							setSearchByGiphy(false);
							setSearchByYoutube(false);
						}}
						control={<Switch color="primary" />}
						label="Unsplash"
					/>
					<FormControlLabel
						checked={searchByGiphy}
						onChange={() => {
							setSearchByGoogle(false);
							setSearchByUnsplash(false);
							setSearchByGiphy(true);
							setSearchByYoutube(false);
						}}
						control={<Switch color="primary" />}
						label="Giphy"
					/>
					<FormControlLabel
						checked={searchByYoutube}
						onChange={() => {
							setSearchByGoogle(false);
							setSearchByUnsplash(false);
							setSearchByGiphy(false);
							setSearchByYoutube(true);
						}}
						control={<Switch color="primary" />}
						label="Youtube"
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
			{(searchByGoogle || searchByUnsplash) && 
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
					)
					}
				</div>
			}
			{searchByGiphy && 
				<SearchContextManager apiKey={API_KEY}>
					<GifComponent sendGif={sendGif} />
				</SearchContextManager>
			}
			{searchByYoutube && 
				<YouTubeMusicPanel
					setVolume={setVolume}
					setVideoId={setVideoId}
					sendVideo={sendVideo}
					queriedVideos={queriedVideos}
					setQueriedVideos={setQueriedVideos}
					lastQuery={lastQuery}
					setLastQuery={setLastQuery}
					setIsVideoShowing={setIsVideoShowing}
					isVideoShowing={isVideoShowing}
					lastVideoId={lastVideoId}
					setLastVideoId={setLastVideoId}
					updateLastTime={updateLastTime}
					hideAllPins={hideAllPins}
					setHideAllPins={setHideAllPins}
				/>
			}
		</div>
	);
};

const DefaultIcons = ({ sendImage, isSwitchChecked }: IIconsProps) => {
	const classes = useStyles();
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
					className={classes.size} 
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
	const classes = useStyles();
	const unsplashIcons = images.map(({ alt, thumbnailLink, imageLink, id }) => (
		<IconButton
			key={id}
			onClick={() =>
				sendImage(imageLink, isSwitchChecked ? 'background' : 'image')
			}
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
