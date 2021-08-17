import { makeStyles } from '@material-ui/core';
import {
	IChatRoom,
	IEmojiDict,
	ITowerDefenseState,
	PanelItemEnum,
	IMusicPlayer
} from '../types';
import React, { useState } from 'react';
// import { Profile } from '../routes/Profile';

import BackgroundPanel from './BackgroundPanel';
import { Chat } from './Chat';
import { Drawer } from '@material-ui/core';
import { EmailPanel } from './EmailPanel';
import EmojiPanel from './EmojiPanel';
import { IGif } from '@giphy/js-types';
import { IImagesState } from './BackgroundPanel';
import { RoomDirectoryPanel } from './RoomDirectoryPanel';
import SoundPanel from './SoundPanel';
import YouTubeMusicPanel from './YouTubeMusicPanel';
import { TowerDefensePanel } from './TowerDefensePanel';
import { Weather } from './Weather';
import { MapsPanel } from './MapsPanel';
import { Poem } from './Poem';
import { NFTPanel } from './NFT/NFTPanel';
import { ISubmit } from './NFT/OrderInput';
import { MusicPlayerPanel } from './MusicPlayerPanel';
import { CryptoPanel } from './Crypto';

export interface IBottomPanelProps {
	bottomPanelRef: React.RefObject<HTMLDivElement>;
	isOpen: boolean;
	isVideoShowing: boolean;
	type?: PanelItemEnum;
	setBrushColor: (color: string) => void;
	onAction: (key: string, ...args: any[]) => void;
	towerDefenseState: ITowerDefenseState;
	updateIsTyping: (isTyping: boolean) => void;
	onNFTError: (message: string) => void;
	onNFTSuccess: (submssion: ISubmit) => void;
	setVideoId: React.Dispatch<React.SetStateAction<string>>;
	setLastVideoId: (id: string) => void;
	updateLastTime: () => void;
	lastVideoId: string;
	hideAllPins: boolean;
	setIsVideoShowing: (value: boolean) => void;
	setHideAllPins: (value: boolean) => void;
	setVolume: (volume: number) => void;
	roomData?: IChatRoom;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	musicPlayer: IMusicPlayer;
	setRaceId: (raceId: string) => void;
	showOpensea: boolean;
	setShowOpensea: (value: boolean) => void;
	addVideo: (videoId: string | undefined) => void;
}

export interface IPanelContentProps {
	type?: PanelItemEnum;
	setBrushColor: (color: string) => void;
	onAction: (key: string, ...args: any[]) => void;
	towerDefenseState: ITowerDefenseState;
	updateIsTyping: (isTyping: boolean) => void;
	images: IImagesState[];
	queriedVideos: Array<any>;
	lastQuery: string;
	hideAllPins: boolean;
	isVideoShowing: boolean;
	lastVideoId: string;
	setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
	setQueriedVideos: React.Dispatch<React.SetStateAction<Array<any>>>;
	setLastQuery: React.Dispatch<React.SetStateAction<string>>;
	setVideoId: (id: string) => void;
	setLastVideoId: (id: string) => void;
	setIsVideoShowing: (value: boolean) => void;
	setHideAllPins: (value: boolean) => void;
	updateLastTime: () => void;
	setVolume: (volume: number) => void;
	onNFTError: (message: string) => void;
	onNFTSuccess: (submssion: ISubmit) => void;
	roomData?: IChatRoom;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	musicPlayer: IMusicPlayer;
	setRaceId: (raceId: string) => void;
	showOpensea: boolean;
	setShowOpensea: (value: boolean) => void;
	addVideo: (videoId: string | undefined) => void;
}

export interface ISoundPairs {
	icon: string;
	type: string;
	category: string;
}

const useStyles = makeStyles((theme) => ({
	drawerRoot: {
		width: 'calc(100vw - 85px)',
		marginLeft: 85
	}
}));

export const BottomPanel = ({
	bottomPanelRef,
	isOpen,
	type,
	setBrushColor,
	onAction,
	towerDefenseState,
	updateIsTyping,
	onNFTError,
	onNFTSuccess,
	setVideoId,
	lastVideoId,
	setLastVideoId,
	isVideoShowing,
	setIsVideoShowing,
	updateLastTime,
	setVolume,
	hideAllPins,
	setHideAllPins,
	roomData,
	showWhiteboard,
	updateShowWhiteboard,
	musicPlayer,
	setRaceId,
	showOpensea,
	setShowOpensea,
	addVideo
}: IBottomPanelProps) => {
	const [images, setImages] = useState<IImagesState[]>([]);
	const [videos, setQueriedVideos] = useState<Array<any>>([]);
	const [lastQuery, setLastQuery] = useState<string>("");
	const classes = useStyles();

	return (
		<Drawer
			variant="persistent"
			anchor="bottom"
			open={isOpen}
			// className="bottom-panel-drawer"
			classes={{
				paper: classes.drawerRoot
			}}
		>
			<div ref={bottomPanelRef} className="bottom-panel-container">
				<PanelContent
					type={type}
					setBrushColor={setBrushColor}
					onAction={onAction}
					towerDefenseState={towerDefenseState}
					updateIsTyping={updateIsTyping}
					images={images}
					queriedVideos={videos}
					lastVideoId={lastVideoId}
					lastQuery={lastQuery}
					isVideoShowing={isVideoShowing}
					setImages={setImages}
					setVideoId={setVideoId}
					setLastVideoId={setLastVideoId}
					setIsVideoShowing={setIsVideoShowing}
					updateLastTime={updateLastTime}
					setVolume={setVolume}
					setQueriedVideos={setQueriedVideos}
					setLastQuery={setLastQuery}
					hideAllPins={hideAllPins}
					setHideAllPins={setHideAllPins}
					onNFTError={onNFTError}
					onNFTSuccess={onNFTSuccess}
					roomData={roomData}
					showWhiteboard={showWhiteboard}
					updateShowWhiteboard={updateShowWhiteboard}
					musicPlayer={musicPlayer}
					setRaceId={setRaceId}
					showOpensea={showOpensea}
					setShowOpensea={setShowOpensea}
					addVideo={addVideo}
				/>
			</div>
		</Drawer>
	);
};

const PanelContent = ({
	type,
	setBrushColor,
	onAction,
	towerDefenseState,
	updateIsTyping,
	images,
	queriedVideos,
	lastQuery,
	setImages,
	setVideoId,
	lastVideoId,
	setLastVideoId,
	setIsVideoShowing,
	isVideoShowing,
	updateLastTime,
	hideAllPins,
	setHideAllPins,
	setVolume,
	setQueriedVideos,
	setLastQuery,
	onNFTError,
	onNFTSuccess,
	roomData,
	showWhiteboard,
	updateShowWhiteboard,
	musicPlayer,
	setRaceId,
	showOpensea,
	setShowOpensea,
	addVideo
}: IPanelContentProps) => {
	switch (type) {
		case 'emoji':
			return (
				<EmojiPanel
					onClick={(data: IEmojiDict) => {
						onAction('emoji', data);
					}}
				/>
			);
		case 'chat':
			return (
				<Chat
					sendMessage={(message) => {
						onAction('chat', message);
					}}
					pinMessage={(message) => {
						onAction('chat-pin', message);
					}}
					pinTweet={(id)=>{
						onAction('tweet', id);
					}}
					updateIsTyping={updateIsTyping}
					showWhiteboard={showWhiteboard}
					updateShowWhiteboard={updateShowWhiteboard}
					setBrushColor={setBrushColor}
					sendAnimation={onAction}

				/>
			);
		case 'sound':
			return <SoundPanel sendSound={onAction} />;

		case 'tower':
			return (
				<TowerDefensePanel
					isStarted={towerDefenseState.isPlaying}
					gold={towerDefenseState.gold}
					onStart={() =>
						onAction('tower defense', {
							key: 'tower defense',
							value: 'start'
						})
					}
					onSelectTower={(towerValue: string) =>
						onAction('tower defense', {
							key: 'tower defense',
							value: 'select tower',
							tower: towerValue
						})
					}
				/>
			);
		case 'background':
			return (
				<BackgroundPanel
					sendImage={(name, type) => onAction(type, name)}
					setImages={setImages}
					images={images}
					sendGif={(gif: IGif) => {
						onAction('gif', gif.id);
					}}
					//youtube
					setVolume={setVolume}
					setVideoId={setVideoId}
					sendVideo={(id) => onAction('youtube', id)}
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
					addVideo={addVideo}
					//+NFT
					roomData={roomData}
					onError={onNFTError}
					onSuccess={onNFTSuccess}
				/>
			);
		case 'settings':
			return null;
		case 'weather':
			return (
				<Weather sendLocation={(location) => onAction('weather', location)} />
			);
		case 'maps':
			return (
				<MapsPanel />
			);
		case 'poem':
			return (
				<Poem
					sendMessage={(message) => {
						onAction('chat', message);
					}}
					pinMessage={(message) => {
						onAction('chat-pin', message);
					}}
					updateIsTyping={updateIsTyping}
				/>
			);
		case 'roomDirectory':
			return (
				<RoomDirectoryPanel
					sendRoomDirectory={onAction}
					onClickNewRoom={() => onAction('new-room')}
				/>
			);
		case 'email':
			return (
				<EmailPanel
					sendEmail={(email, message) => onAction('send-email', email, message)}
				/>
			);

		case 'NFT':
			return (
				<NFTPanel
					roomData={roomData}
					onError={onNFTError}
					onSuccess={onNFTSuccess}
				/>
			);
		case 'youtube':
			return (
				<div>lol</div>
			);
		case 'musicPlayer':
			return (
				<MusicPlayerPanel
					changePlaylist={(url, name) => {
						onAction('change-playlist', {
							url: url,
							name: name
						})
					}}
					musicPlayer={musicPlayer}
				/>
			);
		case 'crypto':
			return (<CryptoPanel 
						sendRace={(id) => onAction('send-race', id)}
						sendHorse={(id) => {onAction('horse', id);}}
						showOpensea={showOpensea}
						setShowOpensea={setShowOpensea}
						hideAllPins={hideAllPins}
						setHideAllPins={setHideAllPins}
					/>);
		default:
			return null;
	}
};