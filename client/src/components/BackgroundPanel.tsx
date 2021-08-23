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
import { NFTPanel } from './NFT/NFTPanel';
import { ISubmit } from './NFT/OrderInput';
import { BackgroundTypes, IChatRoom, IMap } from '../types';
import googleIcon from '../assets/buttons/google.png'
import giphyIcon from '../assets/buttons/giphy.png'
import unsplashIcon from '../assets/buttons/unsplash.png'
import youtubeIcon from '../assets/buttons/youtube.png'
import mapsIcon from '../assets/buttons/maps.png'
import marketplaceIcon from '../assets/buttons/marketplace.png'
import raceIcon from '../assets/buttons/watch.png'
import horseIcon from '../assets/buttons/horse.png'
import { MapsPanel } from './MapsPanel';
import { RacePanel } from './RacePanel';
import { HorsePanel } from './HorsePanel';

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
	addVideo: (videoId: string | undefined) => void;
	//+NFT
	onError: (message: string) => void;
	onSuccess: (submission: ISubmit) => void;
	roomData?: IChatRoom;
	//race
	sendRace: (id: string) => void;
	//horse
	sendHorse: (id: string, type: 'horse') => void;
	//marketplace
	setShowOpensea: (value: boolean) => void;
	//map
	addBackground: (type: BackgroundTypes, data: string | IMap) => void;
}

type PanelTypes= 'google' | 'unsplash' | 'giphy' | 'youtube' | 'maps' | 'marketplace' | 'race' | 'horse' |'+NFT';

interface IPanel {
	type: PanelTypes;
	icon?: string;
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
	setHideAllPins,
	addVideo,
	//+NFT
	onError, 
	onSuccess, 
	roomData,
	//race
	sendRace,
	//horse
	sendHorse,
	//marketplace
	setShowOpensea,
	//map
	addBackground,

}: IBackgroundPanelProps) => {
	const [text, setText] = useState('');
	const [isSwitchChecked, setIsSwitchChecked] = useState(false);
	const isImagesEmpty = images.length === 0;
	const [activePanel, setActivePanel] = useState<PanelTypes>('unsplash');
	const firebaseContext = useContext(FirebaseContext);
	const [loading, setLoading] = useState(false);
	const [panels] =  useState<IPanel[]>(
		[
			{type: 'google', icon: googleIcon},
			{type: 'unsplash', icon: unsplashIcon},
			{type: 'giphy', icon: giphyIcon},
			{type: 'youtube', icon: youtubeIcon}, 
			{type: 'maps', icon: mapsIcon}, 
			{type: 'marketplace', icon: marketplaceIcon}, 
			{type: 'race', icon: raceIcon}, 
			{type: 'horse', icon: horseIcon}, 
			{type: '+NFT'} 
		]); 

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

	const checked = () => {
		if(activePanel === "maps" || activePanel === "race" || activePanel === "marketplace" ){
			return true;
		}
		else if(activePanel === "+NFT" || activePanel === "horse" ){
			return false;
		}
		else{
			return isSwitchChecked;
		}
	};

	useEffect(() => {
		if (!isImagesEmpty) return;
		searchSubmit('trending', setImages);
	}, [isImagesEmpty, setImages]); // Wanted empty deps but warning said to put them in.....

	return (
		<div className="background-container" style={{overflowY: 'auto'}}>
			<div className="background-search-settings">
				
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
					<div>
						<FormControlLabel
							checked={checked()}
							onChange={() => setIsSwitchChecked(!isSwitchChecked)}
							control={<Switch color="primary" />}
							label="background"
						/>
					</div>
					{panels.map((panel, index) => (
						<IconButton
							color= { "primary" }
							disabled= {activePanel === panel.type ? true : false }
							onClick={() => {setActivePanel(panel.type); 
								if(panel.type === "marketplace"){setShowOpensea(true);}
								else{setShowOpensea(false);}
								if(panel.type === "maps"){
									addBackground("map", {
										coordinates: {
											lat: 33.91925555555555,
											lng: -118.41655555555555
										},
										markers: [],
										zoom: 12
									});
								}
							}} 
							key= {index}
						>
							{panel.icon ? 
								<img className = {activePanel === panel.type ? "button-disabled" : "" } src={ panel.icon } alt= { panel.type }  width= "30" height= "30"/> 
								: panel.type
							}
							
						</IconButton>
					))}


					{(activePanel === 'unsplash' || activePanel === 'google' ||  activePanel === 'giphy') ? 
						<div style={{ paddingInline: 20 }}> 
							<InputBase
								placeholder={"Search by " + activePanel}
								onChange={(e) => setText(e.target.value)}
								onKeyPress={(e) => {
										if(e.key === 'Enter'){
											if(activePanel === 'unsplash'){searchSubmit(text, setImages);} else if (activePanel === 'google') {googleSearch(text);}
										}
									}
								}
								value={text}
							/>
							<IconButton
								color="primary"
								onClick={() => {if(activePanel === 'unsplash'){searchSubmit(text, setImages);} else if (activePanel === 'google') {googleSearch(text);}}}
							>
								<SearchIcon />
							</IconButton>

						</div> : <div style={{ width: 289 }}> </div> 
					}
					
					{loading &&
						<img
							style={{
								height: 8,
								width: 30,
								
							}}
							src={loadingDots}
							alt="three dots"
						/>
					}

				</div>

			</div>
			{(activePanel === 'google' || activePanel === 'unsplash') && 
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
			{activePanel === 'giphy' && 
				<SearchContextManager apiKey={API_KEY}>
					<GifComponent sendGif={sendGif} />
				</SearchContextManager>
			}
			{activePanel === 'youtube' && 
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}} >
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
						isBackground={isSwitchChecked}
						addVideo={addVideo}
					/>
				</div>
			}

			{activePanel === '+NFT' && 
				<NFTPanel
					roomData={roomData}
					onError={onError}
					onSuccess={onSuccess}
				/>
			}

			{activePanel === 'maps' && 
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="background-icon-list" >
					<MapsPanel />
				</div>
			}

			{activePanel === 'marketplace' && 
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="background-icon-list" >
					<HorsePanel sendHorse= {sendHorse}/>
				</div>
			}

			{activePanel === 'race' && 
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="background-icon-list" >
					<RacePanel 
						sendRace={sendRace}
						hideAllPins={hideAllPins}
						setHideAllPins={setHideAllPins}
					/>
				</div>
			}

			{activePanel === 'horse' &&
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="background-icon-list" >
					<HorsePanel sendHorse= {sendHorse}/>
				</div>
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
