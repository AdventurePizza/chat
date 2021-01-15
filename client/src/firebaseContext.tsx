import { IChatRoom, IPinnedItem } from './types';

import { INewChatroomCreateResponse } from './components/NewChatroom';
import React from 'react';
import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyC19cZLLW3oYWjQxWEFPhdtzSOGWQcgQjQ',
	authDomain: 'adventure-ea7cd.firebaseapp.com',
	databaseURL: 'https://adventure-ea7cd.firebaseio.com',
	projectId: 'adventure-ea7cd',
	storageBucket: 'adventure-ea7cd.appspot.com',
	messagingSenderId: '753400311148',
	appId: '1:753400311148:web:f8f56db5a153280f185749'
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export interface IFirebaseContext {
	createRoom: (roomName: string) => Promise<INewChatroomCreateResponse>;
	getRoom: (roomName: string) => Promise<IChatRoom | null>;
	pinRoomItem: (room: string, item: IPinnedItem) => void;
	unpinRoomItem: (room: string, itemKey: string) => void;
	getRoomPinnedItems: (room: string) => Promise<IPinnedItem[]>;
	getAllRooms: () => Promise<IChatRoom[] | null>;
}

export const FirebaseContext = React.createContext<IFirebaseContext>({
	createRoom: () =>
		Promise.resolve({
			message: ''
		}),
	getRoom: () => Promise.resolve(null),
	pinRoomItem: () => Promise.resolve(),
	unpinRoomItem: () => {},
	getRoomPinnedItems: () => Promise.resolve([]),
	getAllRooms: () => Promise.resolve([])
});

export const FirebaseProvider: React.FC = ({ children }) => {
	const getRoom = (roomName: string) => {
		return new Promise<IChatRoom | null>(async (resolve) => {
			const docRef = db.collection('chatrooms').doc(roomName);
			const doc = await docRef.get();

			if (!doc.exists) {
				resolve(null);
			} else {
				resolve(doc.data);
			}
		});
	};

	const createRoom = (roomName: string) => {
		return new Promise<INewChatroomCreateResponse>(async (resolve) => {
			const docRef = db.collection('chatrooms').doc(roomName);
			const doc = await docRef.get();

			if (doc.exists) {
				resolve({ message: `room name ${roomName} already taken` });
			} else {
				await docRef.set({ name: roomName });
				resolve({ name: roomName, message: 'success' });
			}
		});
	};

	const pinRoomItem = async (room: string, item: IPinnedItem) => {
		const docRef = db.collection('chatrooms').doc(room);
		const doc = await docRef.get();

		if (doc.exists) {
			if (item.type === 'background') {
				docRef.collection('pinnedItems').doc('background').set(item);
			} else if (
				item.type === 'gif' ||
				item.type === 'image' ||
				item.type === 'text'
			) {
				docRef.collection('pinnedItems').doc(item.key).set(item);
			} else if (item.type === 'text' && item.value) {
				docRef.collection('pinnedItems').doc(item.key).set(item);
			}
		}
	};

	const unpinRoomItem = async (room: string, key: string) => {
		await db
			.collection('chatrooms')
			.doc(room)
			.collection('pinnedItems')
			.doc(key)
			.delete();
	};

	const getRoomPinnedItems = (room: string) => {
		return new Promise<IPinnedItem[]>(async (resolve) => {
			const docRef = db
				.collection('chatrooms')
				.doc(room)
				.collection('pinnedItems');
			const snapshot = await docRef.get();
			const docs = snapshot.docs.map((doc) => doc.data() as IPinnedItem);
			resolve(docs);
		});
	};

	const getAllRooms = async () => {
		return new Promise<IChatRoom[] | null>(async (resolve) => {
			const docRef = db.collection('chatrooms')
			const snapshot = await docRef.get();
			const rooms = snapshot.docs.map((doc) => doc.data() as IChatRoom);
			resolve(rooms);
		});
	};

	return (
		<FirebaseContext.Provider
			value={{
				createRoom,
				getRoom,
				pinRoomItem,
				getRoomPinnedItems,
				unpinRoomItem,
				getAllRooms
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};
