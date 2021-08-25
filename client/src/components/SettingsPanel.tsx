import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { FirebaseContext } from '../contexts/FirebaseContext';
import axios from 'axios';
import './SettingsPanel.css';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { Map } from './Maps';
import { EditField } from './shared/EditField';

import dollar from '../assets/dollar.png';

import character1 from '../assets/character1.png';
import character2 from '../assets/character2.png';
import character3 from '../assets/character3.png';
import character4 from '../assets/character4.png';
import character5 from '../assets/character5.png';
import character6 from '../assets/character6.png';
import character7 from '../assets/character7.png';
import character8 from '../assets/character8.png';
import kirby from '../assets/kirby.gif';
import link from '../assets/link-run.gif';
import mario from '../assets/mario.gif';
import nyancat from '../assets/nyancat_big.gif';
import redghost from '../assets/red_ghost.gif';
import yoshi from '../assets/yoshi.gif';
import placeholder from '../assets/default-placeholder.png';
import { IMetadata, newPanelTypes } from '../types';
import { InputButton } from './shared/InputButton';
import { Opensea } from './Opensea';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


interface ISettingsPanelProps {
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
	setActivePanel: (panel: newPanelTypes) => void;
}

interface IWalletItem {
	contract_name?: string;
	balance?: string;
	contract_decimals?: number;
	type?: string;
	logo_url?: string;
}

export interface IRoomData {
	roomData: {
		isLocked: string;
		lockedOwnerAddress: string;
		name: string;
	};
	background?: {
		name?: string;
		mapData: any;
		subType: string;
		left: number;
		top: number;
		type: string;
	};
}

interface IWalletItem {
	contract_name?: string;
	balance?: string;
	contract_decimals?: number;
	type?: string;
}

interface IWalletItem {
	contract_name?: string;
	balance?: string;
	contract_decimals?: number;
	type?: string;
}

interface IWalletItem {
	contract_name?: string;
	balance?: string;
	contract_decimals?: number;
	type?: string;
}

export const SettingsPanel = ({
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
	setActivePanel
}: ISettingsPanelProps) => {
	let walletItems: IWalletItem[] = [];
	const [items, setItems] = useState(walletItems);
	const [isWalletLoaded, setIsWalletLoaded] = useState(false);
	const { isLoggedIn, accountId } = useContext(AuthContext);
	const [rooms, setRooms] = useState<IRoomData[]>([]);
	const [showNftModal, setShowNftModal] = useState(false);
	const [showImageUrlModal, setShowImageUrlModal] = useState(false);

	const firebaseContext = useContext(FirebaseContext);

	const [activeAvatar, setActiveAvatar] = useState(currentAvatar);
	const avatars = [
		{
			data: character1,
			name: 'character1'
		},
		{
			data: character2,
			name: 'character2'
		},
		{
			data: character3,
			name: 'character3'
		},
		{
			data: character4,
			name: 'character4'
		},
		{
			data: character5,
			name: 'character5'
		},
		{
			data: character6,
			name: 'character6'
		},
		{
			data: character7,
			name: 'character7'
		},
		{
			data: character8,
			name: 'character8'
		},
		{
			data: kirby,
			name: 'kirby'
		},
		{
			data: link,
			name: 'link'
		},
		{
			data: mario,
			name: 'mario'
		},
		{
			data: nyancat,
			name: 'nyancat'
		},
		{
			data: redghost,
			name: 'ghost'
		},
		{
			data: yoshi,
			name: 'yoshi'
		}
	];

	useEffect(() => {
		const fetchData = () => {
			axios
				.get(
					`https://api.covalenthq.com/v1/137/address/${accountId}/balances_v2/?key=ckey_33c257415ca047ff9c04fdc29c3`
				)
				.then((res) => {
					setItems(res.data.data.items);
					setIsWalletLoaded(true);
				})
				.catch((err) => console.log(err));

			firebaseContext
				.getUserRooms(accountId)
				.then((res) => {
					if (res.data) {
						setRooms(res.data);
					}
				})
				.catch((err) => console.log(err));
		};

		if (isLoggedIn) {
			fetchData();
		}
	}, [isLoggedIn, accountId, firebaseContext]);

	const history = useHistory();

	const onRoomClick = (roomId: string) => {
		let urlRoomId = roomId.split(' ').join('%20');
		history.push(`/room/${urlRoomId}`);
		setActivePanel('empty');
	};

	return (
		<div className="settings-panel-container">
			{showNftModal ? (
				<Opensea 
					onChangeAvatar={onChangeAvatar}
					setShowNftModal={setShowNftModal}
					setActiveAvatar={setActiveAvatar}
				/>
			 ) : null}
			{showImageUrlModal ? (
				<ImageUrlModal 
					onChangeAvatar={onChangeAvatar}
					setShowImageUrlModal={setShowImageUrlModal}
				/>
			) : null}
			<div className="settings-input-container">
				<EditField
					prefix="SCREEN NAME"
					placeholder={username}
					onClick={onChangeName}
					setStep={setStep}
					containsRemove={false}
				/>
				<EditField
					prefix="EMAIL"
					placeholder={email ? email : 'add email'}
					onClick={onSubmitEmail}
					containsRemove={true}
					clearField={() => clearField('email')}
				/>
				<EditField
					prefix="LOCATION"
					placeholder={myLocation ? myLocation : 'add location'}
					onClick={onSendLocation}
					containsRemove={true}
					clearField={() => clearField('weather')}
				/>
				<EditField
					prefix="MUSIC"
					placeholder={music ? music.title : 'add song url'}
					onClick={onSubmitUrl}
					containsRemove={true}
					clearField={() => clearField('music')}
				/>
			</div>
			<h2 className="settings-header">AVATAR</h2>
			<div className="settings-avatar third-step">
				{avatars.map((avatar, index) => {
					let classes = 'settings-avatar-container';
					if (activeAvatar === avatar.name) {
						classes =
							'settings-avatar-container settings-avatar-container-active';
					}
					return (
						<div className={classes} key={index}>
							<img
								src={avatar.data}
								height={80}
								onClick={() => setActiveAvatar(avatar.name)}
								alt="user avatar"
							/>
						</div>
					);
				})}
				<Button
					className="settings-avatar-button"
					onClick={() => {
						onChangeAvatar(activeAvatar);
						setStep(3);
					}}
					variant="contained"
					color="primary"
				>
					GO!
				</Button>
				<Button
					className="settings-avatar-button"
					onClick={() => setShowNftModal(true)}
					variant="contained"
					color="primary"
				>
					Choose from your Ethereum NFT's
				</Button>
				<Button
					className="settings-avatar-button"
					onClick={() => setShowImageUrlModal(true)}
					variant="contained"
					color="primary"
				>
					Add Image Url
				</Button>
				
			</div>
			<h2 className="settings-header">ROOMS</h2>
			{rooms ? (
				<div className="settings-rooms">
					{rooms.map((room, index) => (
						<div
							className="settings-room-container"
							key={index}
							onClick={() => onRoomClick(room.roomData.name)}
						>
							<div className="settings-image-container">
								{room.background && room.background.name ? (
									<img src={room.background.name} alt="room background" />
								) : null}
								{room.background && room.background.subType === 'map' ? (
									<Map mapData={room.background.mapData} />
								) : null}
								{!room.background ? (
									<img src={placeholder} alt="room background" />
								) : null}
							</div>
							<p>{room.roomData.name}</p>
						</div>
					))}
				</div>
			) : null}
			<h2 className="settings-header">TOKENS</h2>
			{isWalletLoaded ? (
				<div className="settings-wallet">
					{items.map((item, index) => {
						let decimal = 4;
						if (item.type === 'nft') {
							decimal = 0;
						}

						//nft icon
						let image = (
							<img src={dollar} height={50} width={50} alt="token icon" />
						);
						if (item.type === 'cryptocurrency' && item.logo_url) {
							image = (
								<img
									src={item.logo_url}
									height={50}
									width={50}
									alt="token icon"
								/>
							);
						}

						return (
							<div className="settings-token-container" key={index}>
								{image}
								<p> {item.contract_name} </p>
								<p>
									{' '}
									{typeof item.contract_decimals === 'number' &&
										(
											Number(item.balance) /
											Math.pow(10, item.contract_decimals)
										).toFixed(decimal)}{' '}
								</p>
							</div>
						);
					})}
				</div>
			) : null}
		</div>
	);
};

interface IImageUrlModalProps {
	onChangeAvatar: (imageUrl: string) => void;
	setShowImageUrlModal: (val: boolean) => void;
}

const ImageUrlModal = ({
	onChangeAvatar,
	setShowImageUrlModal
}: IImageUrlModalProps) => {
	return(
		<div className="image-url-modal-container">
			<div className="image-url-modal-close">
                <IconButton onClick={() => setShowImageUrlModal(false)} color="primary">
                    <CloseIcon />
                </IconButton>
            </div>
			<InputButton 
					placeholder="image url"
					onClick={onChangeAvatar}
					buttonText="set"
					onSubmit={setShowImageUrlModal}
				/>
		</div>
	)
}