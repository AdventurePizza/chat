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
	//   updateDrumCount: (amt: number) => void;
	//   getDrumCount: () => Promise<number>;
	createRoom: (roomName: string) => Promise<INewChatroomCreateResponse>;
}

export const FirebaseContext = React.createContext<IFirebaseContext>({
	createRoom: () =>
		Promise.resolve({
			message: ''
		})
});

export const FirebaseProvider: React.FC = ({ children }) => {
	//   const createRoom = (amt: number) => {
	//     const docRef = db.collection("drumbeat").doc("tracking");
	//     docRef.set(
	//       { drumbeatCount: firebase.firestore.FieldValue.increment(amt) },
	//       {
	//         merge: true,
	//       }
	//     );
	//   };

	const createRoom = (roomName: string) => {
		return new Promise<INewChatroomCreateResponse>(async (resolve) => {
			const docRef = db.collection('chatrooms').doc(roomName);
			const doc = await docRef.get();

			if (doc.exists) {
				resolve({ message: `room name ${roomName} already taken` });
			} else {
				await db.collection('chatrooms').doc(roomName).set({ name: roomName });
				resolve({ name: roomName, message: 'success' });
			}
		});
	};

	return (
		<FirebaseContext.Provider
			value={{
				createRoom
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};
