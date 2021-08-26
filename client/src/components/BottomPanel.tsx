import { makeStyles } from '@material-ui/core';
import {
	IChatRoom,
	ITowerDefenseState,
	PanelItemEnum,
	IMusicPlayer,
	BackgroundTypes,
	IMap,
	newPanelTypes,
	IMetadata
} from '../types';
import React, { useState } from 'react';
import ThePanel from './ThePanel';
import { Drawer } from '@material-ui/core';
import { IGif } from '@giphy/js-types';
import { IImagesState } from './ThePanel';
import { ISubmit } from './NFT/OrderInput';

/* old commented imports
import { EmailPanel } from './EmailPanel';
import EmojiPanel from './EmojiPanel';
//import { RoomDirectoryPanel } from './RoomDirectoryPanel';
import SoundPanel from './SoundPanel';
import { TowerDefensePanel } from './TowerDefensePanel';
import { Weather } from './Weather';
import { Poem } from './Poem';
import { Profile } from '../routes/Profile';
import {
	IEmojiDict
} from '../types';
*/

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
	updateShowChat: () => void;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	musicPlayer: IMusicPlayer;
	addVideo: (videoId: string | undefined) => void;
	setBottomPanelHeight: (height: number) => void;
	activePanel: newPanelTypes;
	setActivePanel: (panel: newPanelTypes) => void;
	onNewRoom: () => void;
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

const useStyles = makeStyles(() => ({
	drawerRoot: {
		width: '100%',
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
	updateShowChat,
	showWhiteboard,
	updateShowWhiteboard,
	musicPlayer,
	addVideo,
	setBottomPanelHeight,	
	activePanel,
	setActivePanel,
	onNewRoom,
	routeHome,
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

			<ThePanel
					//update bottom panel size so board background can renders correct
					setBottomPanelHeight={setBottomPanelHeight}
					//giphy unsplash google
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
					queriedVideos={videos}
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
					//race
					sendRace={(id) => onAction('send-race', id)}
					addRace={(id) => onAction('add-race', id)}
					//horse
					sendHorse={(id) => {onAction('horse', id)}}
					//marketplace
					pinMarketplace={() => {onAction('marketplace')}}
					//chat
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
					showChat={updateShowChat}
					activePanel={activePanel}
					setActivePanel={setActivePanel}
					//musicplayer
					changePlaylist={(url, name) => {
						onAction('change-playlist', {
							url: url,
							name: name
						})
					}}
					musicPlayer={musicPlayer}
					//email
					sendEmail={(email, message) => onAction('send-email', email, message)}
					//new room
					onNewRoom={onNewRoom}
					//routehome
					routeHome={routeHome}
					//settings
					avatar={avatar}		
					onChangeName={onChangeName}
					onSubmitUrl={onSubmitUrl}
					onChangeAvatar={onChangeAvatar}
					onSendLocation={onSendLocation}
					onSubmitEmail={onSubmitEmail}
					currentAvatar={currentAvatar}
					setStep={setStep}
					username={username}
					email={email}
					myLocation={myLocation}
					music={music}
					clearField={clearField}
					addBackground={addBackground}
				/>
			</div>
		</Drawer>
	);
};
