import React, { useContext, useEffect, useState } from 'react';
import { IChatRoom } from '../types';
import { FirebaseContext } from './FirebaseContext';
import io from 'socket.io-client';

export interface IAppStateContext {
	rooms?: IChatRoom[];
	socket: SocketIOClient.Socket;
}

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://trychats.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

export const AppStateContext = React.createContext<IAppStateContext>({
	socket
});

interface IAppStateContextProps {
	socket: SocketIOClient.Socket;
	children: React.ReactNode;
}

export const AppStateProvider = (props: IAppStateContextProps) => {
	const [rooms, setRooms] = useState<IChatRoom[]>();
	const { getAllRooms } = useContext(FirebaseContext);

	useEffect(() => {
		async function fetchRooms() {
			const res = await getAllRooms();
			if (res.isSuccessful && res.data) {
				setRooms(res.data);
			}
		}

		if (!rooms) {
			fetchRooms();
		}
	}, [getAllRooms, rooms]);

	return (
		<AppStateContext.Provider
			value={{
				socket: props.socket,
				rooms
			}}
		>
			{props.children}
		</AppStateContext.Provider>
	);
};
