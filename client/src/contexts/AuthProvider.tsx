import * as ethers from 'ethers';

import React, { useCallback, useEffect, useState } from 'react';

import Web3 from 'web3';

declare let ethereum: any;

const chainIDMap: { [key: string]: string } = {
	'1': 'ethereum',
	'3': 'ropsten',
	'137': 'matic',
	'31337': 'local'
};

const msgParams = (nonce: string) => [
	{
		type: 'string', // Any valid solidity type
		name: 'Message', // Any string label you want
		value: 'Hi, please sign in' // The value to sign
	},
	{
		type: 'string',
		name: 'One-time nonce',
		value: nonce
	}
];

export interface IAuthContext {
	jwt: string;
	signIn: () => void;
	accountId?: string;
	isLoggedIn: boolean;
	provider?: ethers.providers.Web3Provider;
	network?: string;
	balance?: string;
}

export const AuthContext = React.createContext<IAuthContext>({
	jwt: '',
	signIn: () => {},
	isLoggedIn: false
});

interface IAuthProviderProps {
	children: React.ReactNode;
	socket: SocketIOClient.Socket;
}

let web3: Web3;
try {
	web3 = new Web3(ethereum);
} catch (e) {
	console.log('Please use the metamask extension');
}

export const AuthProvider = (props: IAuthProviderProps) => {
	const [hasTriedAutoSignIn, setHasTriedAutoSignIn] = useState(false);

	const [balance, setBalance] = useState<string>('');
	//   const [chainId, setChainId] = useState("");
	const [jwt, setJWT] = useState('');
	const [network, setNetwork] = useState<string>('');
	const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	// for logged in acct
	const [accountId, setAccountId] = useState<string>();

	const handleAccountsChanged = useCallback(
		async (accounts: string[]) => {
			let newAccount = '';
			if (accounts.length === 0) {
				// MetaMask is locked or the user has not connected any accounts
				console.log('Please connect to MetaMask.');
			} else if (accounts[0] !== accountId) {
				newAccount = accounts[0];

				const balance = await web3.eth.getBalance(accounts[0]);
				setBalance(balance);
				// Do any other work!
			}

			setAccountId(newAccount);
		},
		[accountId]
	);

	const handleChainChange = useCallback(
		async (
			chainId: number | string
		): Promise<{
			error?: string;
			accountId?: string;
			network?: string;
		}> => {
			return new Promise((resolve, reject) => {
				let error;
				let accountId;

				// handle case chainId is given hexadecimal
				if (typeof chainId === 'string') {
					chainId = parseInt(chainId, 16);
				}

				let network = chainIDMap[chainId] || 'Unknown';

				web3.eth.getAccounts().then(async (accounts) => {
					if (!accounts || !accounts.length) {
						error = 'No metamask account found, connect metamask';
						resolve({ error });
					} else {
						accountId = accounts[0];

						const balance = await web3.eth.getBalance(accounts[0]);
						setBalance(balance);
						resolve({ accountId, network });
						setNetwork(network);
					}
				});
			});
		},
		[]
	);

	const connectMetamask = useCallback(() => {
		return new Promise<string | null>(async (resolve) => {
			if (!window.ethereum) return null;
			const chainId = await ethereum.request({ method: 'eth_chainId' });
			handleChainChange(chainId);

			ethereum.on('chainChanged', handleChainChange);

			//       function handleChainChanged(_chainId: string) {
			//         const newChainId = "" + parseInt(_chainId, 16);
			//         setChainId(newChainId);
			//       }

			ethereum
				.request({ method: 'eth_requestAccounts' })
				.then((accounts: string[]) => {
					handleAccountsChanged(accounts);

					const provider = new ethers.providers.Web3Provider(ethereum, 'any');
					setProvider(provider);
					resolve(accounts[0] ?? null);
					//   onConnect(provider);
				})
				.catch((err: any) => {
					if (err.code === 4001) {
						// EIP-1193 userRejectedRequest error
						// If this happens, the user rejected the connection request.
						console.log('Please connect to MetaMask.');
					} else {
						console.error(err);
					}
				});
		});
	}, [handleAccountsChanged, handleChainChange]);

	const onLogin = useCallback(
		(userData: IUserData, accessToken: string) => {
			setIsLoggedIn(true);
			setAccountId(userData.publicAddress);
			setJWT(accessToken);
			localStorage.setItem('jwt', accessToken);

			props.socket.emit('authenticate', { token: accessToken });

			const provider = new ethers.providers.Web3Provider(ethereum, 'any');
			setProvider(provider);
		},
		[props.socket]
	);

	const verifyLogin = useCallback(
		(account: string, accessToken: string) => {
			return new Promise<{ error?: string }>(async (resolve, reject) => {
				fetchAuthUserData(accessToken).then(async (res) => {
					if (res.ok && account) {
						const userData = (await res.json()) as IUserData;
						onLogin(userData, accessToken);
						resolve({});
					} else resolve({ error: res.statusText });
				});

				const chainId = await web3.eth.net.getId();
				await handleChainChange(chainId);
				// const { network } = await handleChainChange(chainId);
				// setNetwork(network || '');
			});
		},
		[onLogin, handleChainChange]
	);

	const autoSignIn = useCallback(async () => {
		setHasTriedAutoSignIn(true);
		const localjwt = localStorage.getItem('jwt');

		let account = accountId;

		if (!accountId) {
			account = (await connectMetamask()) || '';
		}

		if (account) {
			if (localjwt) {
				verifyLogin(account, localjwt);
			}
		}
	}, [verifyLogin, accountId, connectMetamask]);

	useEffect(() => {
		if (!hasTriedAutoSignIn) {
			autoSignIn();
		}
	}, [autoSignIn, hasTriedAutoSignIn]);

	const signIn = async () => {
		const localjwt = localStorage.getItem('jwt');

		let account = accountId;

		if (accountId) {
			if (localjwt) {
				verifyLogin(accountId, localjwt);
			}
		} else {
			try {
				const connectResult = await connectMetamask();
				if (connectResult === null) return alert('error signing in');
				account = connectResult;
			} catch (e) {
				return console.log('error connecting');
			}
		}

		if (!account) return;

		const accessToken = await generateToken(account);

		verifyLogin(account, accessToken);
	};

	return (
		<AuthContext.Provider
			value={{
				jwt,
				signIn,
				accountId,
				isLoggedIn,
				provider,
				network,
				balance
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

const generateToken = async (account: string) => {
	const userInfo = await getUserInfo(account);

	let publicAddress: string;
	let nonce: string;

	if (!userInfo) {
		const signupRes = await handleSignup(account);

		publicAddress = signupRes.publicAddress;
		nonce = signupRes.nonce;
	} else {
		publicAddress = userInfo.publicAddress;
		nonce = userInfo.nonce;
	}

	const { signature } = await signMsg(publicAddress, nonce);

	const { accessToken } = await authAccountSig(publicAddress, signature);

	return accessToken;
};

const getUserInfo = (accountId: string): Promise<IGetUserInfo | null> =>
	fetch(fetchBase + `/users/${accountId}`)
		.then((res) => res.json())
		.then(async (res: IGetUserInfo) => {
			if (!res.nonce || !res.publicAddress) {
				return null;
			}

			return res;
		});

const authAccountSig = (
	publicAddress: string,
	signature: string
): Promise<{ accessToken: string; userData: IUserData }> =>
	fetch(fetchBase + '/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ publicAddress, signature })
	}).then((res) => res.json());

const handleSignup = (
	publicAddress: string
): Promise<{ publicAddress: string; nonce: string }> => {
	return fetch(fetchBase + '/users', {
		body: JSON.stringify({ publicAddress }),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	}).then((response) => response.json());
};
function signMsg(from: string, nonce: string) {
	return new Promise<{ publicAddress: string; signature: string }>(
		(resolve, reject) => {
			if (!web3 || !web3.currentProvider) {
				web3 = new Web3(ethereum);
			}
			// reject("no web3 library and/or provider found");

			//@ts-ignore
			web3.currentProvider?.sendAsync(
				{
					method: 'eth_signTypedData',
					params: [msgParams(nonce), from],
					from: from
				},
				function (err: string, result: any) {
					if (err) return console.error(err);
					if (result.error) {
						console.error(result.error.message);
						reject(result.error.message);
					}
					resolve({ publicAddress: from, signature: result.result });
				}
			);
		}
	);
}

interface IGetUserInfo {
	nonce: string;
	publicAddress: string;
}
const fetchBase =
	process.env.NODE_ENV === 'development'
		? ''
		: 'https://trychats.herokuapp.com';

export interface IUserData {
	txHash: string;
	transferAmount: number;
	publicAddress: string;
}

const fetchAuthUserData = (jwt: string) =>
	fetch(fetchBase + '/users/auth', {
		method: 'POST',
		headers: {
			//   "Content-Type": "application/json",
			Authorization: 'Bearer ' + jwt
		}
	});
