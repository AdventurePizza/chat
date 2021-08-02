import { IChatRoom, IFetchResponseBase, IOrder, IPinnedItem } from '../types';

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
	getImage:(query: string) => Promise<IFetchResponseBase>;
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
	getImage: () => Promise.resolve({ isSuccessful: false })
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

	const getImage= useCallback(
		async (
			query: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/google-image-search/${query}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				return { isSuccessful: true, message: await fetchRes.json() };
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
				getImage
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};
