import React, { useContext, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import { Cancel } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import { IChatRoom } from '../types';
import { IconButton } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { NewRoomPanelButton } from './NewChatroom';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'underscore';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { AppStateContext } from '../contexts/AppStateContext';

const useStyles = makeStyles({
	title: {
		fontSize: 50,
		fontWeight: 600,
		marginBottom: 20
	},
	container: {
		width: 'fit-content',
		maxWidth: window.innerWidth * 0.8,
		borderRadius: 20,
		borderWidth: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 100,
		flexDirection: 'column',
		'& > *': {
			fontFamily: 'Blinker'
		},
		backgroundColor: 'whitesmoke',
		border: '5px solid #87D3F3',
		'&:focus': {
			outline: 'none',
			boxShadow: 'none'
		},
	},
	cancelButton: {
		position: 'absolute',
		right: 10,
		top: 10
	}
});

const buttonStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	}
}));

interface IRoomDirectoryProps {
	sendRoomDirectory: (roomDirectory: string, roomName: string) => void;
	onClickNewRoom: () => void;
}

interface IEnterRoomProps {
	roomName: string;
	onClickCancel: () => void;
	clearVideo: () => void; // for stopping video when switching rooms
}

export const RoomDirectoryPanel = ({
	sendRoomDirectory,
	onClickNewRoom
}: IRoomDirectoryProps) => {
	const [displayedRooms, setDisplayedRooms] = useState<IChatRoom[] | null>([]);
	const [allRooms, setAllRooms] = useState<IChatRoom[] | null>([]);
	const { rooms } = useContext(AppStateContext);
	const [searchText, setSearchText] = useState<string>('');
	const history = useHistory();

	useEffect(() => {
		if (!rooms) return;

		const shuffledRooms = _.shuffle(rooms);
		let slicedShuffledRooms = shuffledRooms.slice(0, 11);
		const mainRoomIndex = slicedShuffledRooms.findIndex(
			(room) => room.name === 'default'
		);
		if (mainRoomIndex === -1) {
			slicedShuffledRooms = slicedShuffledRooms.slice(0, 10);
		} else {
			slicedShuffledRooms.splice(mainRoomIndex, 1);
		}
		setDisplayedRooms(slicedShuffledRooms);
		setAllRooms(rooms);
	}, [rooms]);

	const onSearchSubmit = async () => {
		if (searchText.length >= 0) {
			let foundRooms: IChatRoom[] = [];
			allRooms?.forEach((room) => {
				if (
					room.name !== undefined &&
					searchText.length > 2 &&
					room.name.includes(searchText)
				) {
					foundRooms.push(room);
				} else if (
					room.name !== undefined &&
					searchText.length <= 2 &&
					room.name.startsWith(searchText)
				) {
					foundRooms.push(room);
				}
			});
			foundRooms.length > 10
				? setDisplayedRooms(foundRooms.slice(0, 10))
				: setDisplayedRooms(foundRooms);
		}
	};

	const displayRooms = displayedRooms?.map((room, index) => {
		return (
			<div key={index} className="room-icon">
				<button
					style={{ background: 'none', border: 'none' }}
					onClick={() => sendRoomDirectory('roomDirectory', room.name)}
				>
					<p>{room.name}</p>
				</button>
			</div>
		);
	});

	return (
		<div className="room-container">
			<div style={{ justifyContent: 'center', display: 'flex' }}>
				<InputBase
					placeholder="Search Rooms"
					onChange={(event) => setSearchText(event.target.value)}
					onKeyPress={(event) => event.key === 'Enter' && onSearchSubmit()}
					value={searchText}
				/>
				<IconButton color="primary" onClick={onSearchSubmit}>
					<SearchIcon />
				</IconButton>
				<IconButton color="primary" onClick={() => history.push('/')}>
					<HomeIcon />
				</IconButton>
				<IconButton color="primary" onClick={onClickNewRoom}>
					<NewRoomPanelButton isRow />
				</IconButton>
			</div>
			<div className="room-icon-list"> {displayRooms} </div>
		</div>
	);
};

export const EnterRoomModal = ({
	roomName,
	onClickCancel,
	clearVideo // for stopping video when switching rooms
}: IEnterRoomProps) => {
	const classes = useStyles();
	const buttonClasses = buttonStyles();
	const history = useHistory();
	return (
		<div className={classes.container}>
			<IconButton onClick={onClickCancel} className={classes.cancelButton}>
				<Cancel />
			</IconButton>
			<div className={classes.title}> {`Enter room: ${roomName}`}</div>
			<Button
				variant="contained"
				color="primary"
				className={buttonClasses.button}
				onClick={() => {
					history.push(`/room/${roomName}`);
					onClickCancel();
					clearVideo();
				}}
			>
				Enter
			</Button>
		</div>
	);
};
