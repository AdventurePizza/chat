import { InputButton } from './shared/InputButton';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../contexts/AuthProvider';
import { FirebaseContext } from '../contexts/FirebaseContext';
import axios from 'axios';
import './SettingsPanel.css';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { Map } from './Maps';

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
/* import { _fetchData } from 'ethers/lib/utils'; */
import placeholder from '../assets/default-placeholder.png';

interface ISettingsPanelProps {
	onChangeName: (username: string) => void;
	onSubmitUrl: (url: string) => void;
	onChangeAvatar: (avatar: string) => void;
	onSendLocation: (location: string) => void;
	currentAvatar: string;
	setStep: (step: number) => void;
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
	contract_name? : string,
	balance? : string,
	contract_decimals? : number,
	type?: string
}

const useStyles = makeStyles({
	container: {
		'& > *:not(:last-child)': {
			marginRight: 10
		},
		display: 'flex',
		alignItems: 'center',
		overflowX: 'auto',
		background: 'var(--background)',
		width: '100%',
		justifyContent: 'center',
		height: 100
	}
});

export const SettingsPanel = ({
	onChangeName,
	onSubmitUrl,
	onChangeAvatar,
	onSendLocation,
	currentAvatar,
	setStep
}: ISettingsPanelProps) => {
	let walletItems: IWalletItem[] = [];
	const [items, setItems] = useState(walletItems);
	const [isWalletLoaded, setIsWalletLoaded] = useState(false);
	const { isLoggedIn, accountId } = useContext(AuthContext);
	const [rooms, setRooms] = useState<IRoomData[]>([]);
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
	};

	return (
		<div className="settings-panel-container">
			<div className="settings-input-container">
				<div className="second-step">
					<InputButton
						buttonText="update"
						placeholder="enter name"
						onClick={onChangeName}
						inputWidth={300}
						setStep={setStep}
					/>
					{/* <input type="text" placeholder="add text"/> */}
				</div>
				<InputButton
					buttonText="add"
					placeholder="enter location"
					onClick={onSendLocation}
					inputWidth={300}
				/>
				<InputButton
					buttonText="add"
					placeholder="enter music url"
					onClick={onSubmitUrl}
					inputWidth={300}
				/>
			</div>
			<h2>AVATAR</h2>
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
								height={100}
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
			</div>
			<h2>ROOMS</h2>
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
			<h2>TOKENS</h2>
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
