//style
import './Panel.css';
//material ui
import {
	FormControlLabel,
	IconButton,
	Switch,
	InputBase 
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
//react
import React, { useEffect, useState, useContext, useRef } from 'react';
//utility
import axios from 'axios';
import { FirebaseContext } from '../contexts/FirebaseContext';
//icons
import loadingDots from '../assets/loading-dots.gif';
import googleIcon from '../assets/buttons/google.png'
import giphyIcon from '../assets/buttons/giphy.png'
import unsplashIcon from '../assets/buttons/unsplash.png'
import youtubeIcon from '../assets/buttons/youtube.png'
import mapsIcon from '../assets/buttons/maps.png'
import marketplaceIcon from '../assets/buttons/marketplace.png'
import raceIcon from '../assets/buttons/watch.png'
import horseIcon from '../assets/buttons/horse.png'
import chatIcon from '../assets/buttons/chat.png'
import musicIcon from '../assets/buttons/music.png'
import homeIcon from '../assets/buttons/home.png'
import emailIcon from '../assets/buttons/email.png'
import newroomIcon from '../assets/buttons/newroom.png'
//panels
import YouTubeMusicPanel from './YouTubeMusicPanel';
import { NFTPanel } from './NFT/NFTPanel';
import { RacePanel } from './RacePanel';
import { HorsePanel } from './HorsePanel';
import { MusicPlayerPanel } from './MusicPlayerPanel';
import { Chat } from './Chat';
import { EmailPanel } from './EmailPanel';
import BackgroundPanel from './BackgroundPanel';
import { GiphyPanel } from './GiphyPanel';
import {SettingsPanel} from './SettingsPanel';
//types
import { ISubmit } from './NFT/OrderInput';
import { IChatRoom, newPanelTypes, IMusicPlayer, IMetadata, BackgroundTypes, IMap } from '../types';
import { IGif } from '@giphy/js-types';
import { AppStateContext } from '../contexts/AppStateContext';

interface IThePanelProps {
	//panel
	activePanel: newPanelTypes;
	setActivePanel: (panel: newPanelTypes) => void;
	setBottomPanelHeight: (height: number) => void;
	//google, unsplash, giphy
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
	addRace: (id: string) => void;
	//horse
	sendHorse: (id: string, type: 'horse') => void;
	//marketplace
	pinMarketplace: () => void;
	//chat
	pinMessage: (message: string) => void;
	sendMessage: (message: string) => void;
	updateIsTyping: (isTyping: boolean) => void;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	setBrushColor: (color: string) => void;
	sendAnimation: (animationText: string, animationType: string) => void;
	pinTweet: (id: string) => void; 
	showChat: () => void;
	//musicplayer
	changePlaylist: (url: string, name: string) => void;
	musicPlayer: IMusicPlayer;
	//email
	sendEmail: (email: string, message: string) => void;
	//new room
	onNewRoom: () => void;
	//route Home
	routeHome: () => void;
	//settings
	avatar?: string;
	setStep: (step: number) => void;
	onChangeName: (username: string) => void;
	onSubmitUrl: (url: string) => void;
	onChangeAvatar: (avatar: string) => void;
	onSendLocation: (location: string) => void;
	onSubmitEmail: (email: string) => void;
	currentAvatar: string;
	username: string;
	email: string;
	myLocation?: string;
	music?: IMetadata;
	clearField: (field: string) => void;
	addBackground: (type: BackgroundTypes, data: string | IMap) => void;
}

interface IPanel {
	type: newPanelTypes;
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

const panels: IPanel[] =
	[
		{type: 'settings'},
		{type: 'home', icon: homeIcon},
		{type: 'chat', icon: chatIcon},
		{type: 'google', icon: googleIcon},
		{type: 'unsplash', icon: unsplashIcon},
		{type: 'giphy', icon: giphyIcon},
		{type: 'youtube', icon: youtubeIcon}, 
		{type: 'maps', icon: mapsIcon}, 
		{type: 'marketplace', icon: marketplaceIcon}, 
		{type: 'race', icon: raceIcon}, 
		{type: 'horse', icon: horseIcon}, 
		{type: 'music', icon: musicIcon}, 
		{type: 'email', icon: emailIcon}, 
		{type: 'newroom', icon: newroomIcon}, 
		{type: '+NFT'},
	] 

const ThePanel = ({
	//panel
	activePanel,
	setActivePanel,
	setBottomPanelHeight,
	//home button
	routeHome,
	//google, unsplash, giphy
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
	addRace,
	//horse
	sendHorse,
	//marketplace
	pinMarketplace,
	//chat
	sendMessage,
	updateIsTyping,
	pinMessage,
	showWhiteboard,
	updateShowWhiteboard,
	setBrushColor,
	sendAnimation,
	pinTweet,
	showChat,
	//musicplayer
	changePlaylist,
	musicPlayer,
	//email
	sendEmail,
	//newroom
	onNewRoom,
	//settings
	avatar,
	onChangeName,
	onSubmitUrl,
	onChangeAvatar,
	onSendLocation,
	onSubmitEmail,
	currentAvatar,
	setStep,
	username,
	email,
	myLocation,
	music,
	clearField,
	addBackground
}: IThePanelProps) => {
	const [text, setText] = useState('');
	const [isBackground, setisBackground] = useState(false);
	const isImagesEmpty = images.length === 0;
	const firebaseContext = useContext(FirebaseContext);
	const [loading, setLoading] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const { socket } = useContext(AppStateContext);

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

	const checked = () => {
		if(activePanel === "maps" || activePanel === "marketplace" ){
			return true;
		}
		else if(activePanel === "+NFT" || activePanel === "horse" ){
			return false;
		}
		else{
			return isBackground;
		}
	};

	useEffect(() => {
		if(panelRef.current){
			setBottomPanelHeight(panelRef.current.offsetHeight);
		}
	}, [activePanel, setBottomPanelHeight]);

	useEffect(() => {
		if (!isImagesEmpty) return;
		searchSubmit('trending', setImages);
	}, [isImagesEmpty, setImages]); // Wanted empty deps but warning said to put them in.....

	return (
		<div ref={panelRef} className="background-container" style={{overflowY: 'auto'}}>
			
			{activePanel === 'chat' &&
				<div  className="background-icon-list" >
					<Chat
						sendMessage={sendMessage}
						pinMessage={pinMessage}
						pinTweet={pinTweet}
						updateIsTyping={updateIsTyping}
						showWhiteboard={showWhiteboard}
						updateShowWhiteboard={updateShowWhiteboard}
						setBrushColor={setBrushColor}
						sendAnimation={sendAnimation}
						showChat={showChat}
					/>
				</div>
			}

			{(activePanel === 'google' || activePanel === 'unsplash') && 
				<BackgroundPanel
					addBackground={addBackground}
					images={images}
					setImages={setImages}
					searchValue={text}
					isGoogle={activePanel === 'google'}
					isBackground={isBackground}
					searchSubmit={searchSubmit}
				/>
			}

			{activePanel === 'giphy' && 
				<GiphyPanel
					sendGif={sendGif} 
					search={text}
					isBackground={isBackground}
					sendImage={sendImage} 
				/>
			}

			{activePanel === 'youtube' && 
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
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
						isBackground={isBackground}
						addVideo={addVideo}
						addBackground={addBackground}
					/>
				</div>
			}

			{activePanel === 'race' && 
				<div  className="background-icon-list" >
					<RacePanel 
						sendRace={sendRace}
						addRace={addRace}
						isBackground={isBackground}
						hideAllPins={hideAllPins}
						setHideAllPins={setHideAllPins}
						addBackground={addBackground}
					/>
				</div>
			}

			{activePanel === 'horse' &&
				<div  className="background-icon-list" >
					<HorsePanel sendHorse= {sendHorse}/>
				</div>
			}

			{activePanel === 'music' &&
				<div  className="background-icon-list" >
					<MusicPlayerPanel
						changePlaylist={changePlaylist}
						musicPlayer={musicPlayer}
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

			{activePanel === 'email' && 
				<EmailPanel
					sendEmail={sendEmail}
				/>
			}

			{activePanel === 'settings' && 
				<SettingsPanel
					setStep={setStep}
					onSubmitUrl={onSubmitUrl}
					onChangeName={onChangeName}
					onChangeAvatar={onChangeAvatar}
					onSendLocation={onSendLocation}
					onSubmitEmail={onSubmitEmail}
					currentAvatar={currentAvatar}
					username={username}
					email={email}
					myLocation={myLocation}
					music={music}
					clearField={clearField}
					setActivePanel={setActivePanel}
				/>
			}
			
			<div className="background-search-settings">
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >

					{//panel icon-buttons & special cases for newroom home & marketplace
					panels.map((panel, index) => (
						<IconButton
							color= { "inherit" }
							disabled= {activePanel === panel.type ? true : false }
							onClick={() => {setActivePanel(panel.type); 
								if(panel.type === "newroom"){onNewRoom()}
								else if(panel.type === "home"){routeHome()}
								else if(panel.type === "marketplace"){
									addBackground("marketplace", "");
									socket.emit('event', {
										key: 'background',
										type: "marketplace",
										func: 'add'
									})
								}
								else if(panel.type === "maps"){
									addBackground("map", {
										coordinates: {
											lat: 33.91925555555555,
											lng: -118.41655555555555
										},
										markers: [],
										zoom: 12
									});
									socket.emit('event', {
										key: 'background',
										type: "map",
										func: 'add'
									})
								}
								if(panel.type === "settings"){setHideAllPins(true)}
								else{setHideAllPins(false)}
							}} 
							key= {index}
						>
							{panel.icon ? 
								<img className = {activePanel === panel.type ? "button-disabled" : "" } src={ panel.icon } alt= { panel.type }  width= "30" height= "30"/> 
								: (panel.type === "settings" ? <img className = {activePanel === panel.type ? "button-disabled" : "" } src={ avatar } alt= { panel.type }  width= "30" height= "30"/> : panel.type) 
							}
							
						</IconButton>
					))}

					<div>
						<FormControlLabel
							checked={checked()}
							onChange={() => setisBackground(!isBackground)}
							control={<Switch color="primary" />}
							label="background"
						/>
					</div>

					{//input for image searchs
					(activePanel === 'unsplash' || activePanel === 'google' ||  activePanel === 'giphy') ? 
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
		</div>
	);
};

export const getSearchedUnsplashImages = async (text: string) =>
	await axios.get('https://api.unsplash.com/search/photos?per_page=15', {
		params: { query: text },
		headers: {
			authorization: 'Client-ID MZjo-jtjTqOzH1e0MLB5wDm19tMAhILsBEOcS9uGYyQ'
		}
	});

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

export default ThePanel;
