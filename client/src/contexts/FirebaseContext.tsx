import { IChatRoom, IFetchResponseBase, IOrder, IPinnedItem, IUserProfile } from '../types';
import { IRoomData } from '../components/SettingsPanel';

import React, { useCallback, useContext } from 'react';
import { AuthContext } from './AuthProvider';

export interface IFirebaseContext {
	createRoom: (
		roomName: string,
		isLocked: boolean,
		contractAddress?: string
	) => Promise<IFetchResponseBase>;
	getRoom: (
		roomName: string
	) => Promise<IFetchResponseBase & { data?: IChatRoom }>;
	pinRoomItem: (room: string, item: IPinnedItem) => Promise<IFetchResponseBase>;
	unpinRoomItem: (room: string, itemKey: string) => Promise<IFetchResponseBase>;
	getRoomPinnedItems: (
		room: string
	) => Promise<
		IFetchResponseBase & { data?: IPinnedItem[] | Array<IOrder & IPinnedItem> }
	>;
	getAllRooms: () => Promise<IFetchResponseBase & { data?: IChatRoom[] }>;
	movePinnedRoomItem: (
		room: string,
		item: IPinnedItem
	) => Promise<IFetchResponseBase>;
	acquireTokens: (tokenId: string) => Promise<IFetchResponseBase>;

	//profile routes
	getUser: (
		userId: string
	) => Promise<IFetchResponseBase & { data?: IUserProfile }>;
	getUserRooms: (
		userId?: string
	) => Promise<IFetchResponseBase & { data?: IRoomData[] }>;
	createUser: (
		userId: string,
		screenName: string,
		avatar: string
	) => Promise<IFetchResponseBase>;
	updateScreenname: (
		userId: string,
		screenName: string,
	) => Promise<IFetchResponseBase>;
	updateAvatar: (
		userId: string,
		avatar: string,
	) => Promise<IFetchResponseBase>;
	updateEmail: (
		userId: string,
		email: string,
	) => Promise<IFetchResponseBase>;
}

export const FirebaseContext = React.createContext<IFirebaseContext>({
	createRoom: () => Promise.resolve({ isSuccessful: false }),
	getRoom: () => Promise.resolve({ isSuccessful: false }),
	pinRoomItem: () => Promise.resolve({ isSuccessful: false }),
	unpinRoomItem: () => Promise.resolve({ isSuccessful: false }),
	getRoomPinnedItems: () => Promise.resolve({ isSuccessful: false }),
	getAllRooms: () => Promise.resolve({ isSuccessful: false }),
	movePinnedRoomItem: () => Promise.resolve({ isSuccessful: false }),
	acquireTokens: () => Promise.resolve({ isSuccessful: false }),
	createUser: () => Promise.resolve({ isSuccessful: false }),
	updateScreenname: () => Promise.resolve({ isSuccessful: false }),
	updateAvatar: () => Promise.resolve({ isSuccessful: false }),
	updateEmail: () => Promise.resolve({ isSuccessful: false }),
	getUser: () => Promise.resolve({ isSuccessful: false }),
	getUserRooms: () => Promise.resolve({ isSuccessful: false }),
});

const fetchBase =
	process.env.NODE_ENV === 'development'
		? ''
		: 'https://trychats.herokuapp.com';

export const FirebaseProvider: React.FC = ({ children }) => {
	const { isLoggedIn, jwt } = useContext(AuthContext);

	const fetchAuthenticated = useCallback(
		(path: string, request: Partial<RequestInit>) => {
			return fetch(fetchBase + path, {
				...request,
				headers:
					isLoggedIn && jwt
						? {
								...request.headers,
								Authorization: 'Bearer ' + jwt
						  }
						: {
								...request.headers
						  }
			});
		},
		[jwt, isLoggedIn]
	);

	const acquireTokens = useCallback(
		async (tokenId: string): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/token/${tokenId}`, {
				method: 'POST'
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getRoom = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IChatRoom }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const roomData = (await fetchRes.json()) as IChatRoom;
				return { isSuccessful: true, data: roomData };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const createRoom = useCallback(
		async (
			roomName: string,
			isLocked: boolean,
			contractAddress?: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ isLocked, contractAddress })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const pinRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/pin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ item })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const movePinnedRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(
				`/room/${roomName}/pin/${item.key}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ item })
				}
			);

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const unpinRoomItem = useCallback(
		async (roomName: string, itemId: string): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(
				`/room/${roomName}/pin/${itemId}`,
				{
					method: 'DELETE'
				}
			);

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getRoomPinnedItems = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IPinnedItem[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/pin`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const pinnedItems = await fetchRes.json();
				return { isSuccessful: true, data: pinnedItems };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getAllRooms = useCallback(async (): Promise<
		IFetchResponseBase & { data?: IChatRoom[] }
	> => {
		const fetchRes = await fetchAuthenticated(`/room`, {
			method: 'GET'
		});

		if (fetchRes.ok) {
			const rooms = await fetchRes.json();
			return { isSuccessful: true, data: rooms };
		}

		return { isSuccessful: false, message: fetchRes.statusText };
	}, [fetchAuthenticated]);

	//create new user
	const createUser = useCallback(
		async (
			userId: string,
			screenName: string,
			avatar: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, screenName, avatar })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update screenname
	const updateScreenname = useCallback(
		async (
			userId: string,
			screenName: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/screen-name/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ screenName })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update avatar
	const updateAvatar = useCallback(
		async (
			userId: string,
			avatar: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/avatar/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ avatar })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update email
	const updateEmail = useCallback(
		async (
			userId: string,
			email: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/email/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get user data
	const getUser = useCallback(
		async (
			userId: string
		): Promise<IFetchResponseBase & { data?: IUserProfile }> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/get/${userId}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const userData = (await fetchRes.json()) as IUserProfile;
				return { isSuccessful: true, data: userData };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get user rooms
	const getUserRooms = useCallback(
		async (
			userId?: string
			): Promise<IFetchResponseBase & { data?: IRoomData[] }> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/user-rooms/${userId}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const userRooms = (await fetchRes.json()) as IRoomData[];
				return { isSuccessful: true, data: userRooms };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);



	return (
		<FirebaseContext.Provider
			value={{
				createRoom,
				getRoom,
				pinRoomItem,
				getRoomPinnedItems,
				unpinRoomItem,
				getAllRooms,
				movePinnedRoomItem,
				acquireTokens,
				createUser,
				updateScreenname,
				updateAvatar,
				updateEmail,
				getUser,
				getUserRooms
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};
