import React, { useCallback, useEffect, useState } from 'react';

import Web3 from 'web3';

declare let ethereum: any;
let web3: Web3;

const requestConnectAccount = (): Promise<string | undefined> =>
	ethereum
		.request({ method: 'eth_requestAccounts' })
		.then((accounts: string[]) => accounts[0])
		.catch(console.error);

const isUsingMetamask = (): boolean => {
	//@ts-ignore
	return !!window.ethereum;
};

const getConnectedAccount = (): Promise<string | undefined> =>
	web3.eth.getAccounts().then((accounts) => accounts[0]);

const chainIDMap: { [key: string]: string } = {
	'1': 'ethereum',
	'3': 'ropsten',
	'137': 'matic'
};

interface IAppStateContext {
	isLoggedIn?: boolean;
	accountId?: string;
	onLogout: () => void;
	connectMetamask: () => void;
	network?: string;
	balance?: string;
}

const initialContext: IAppStateContext = {
	onLogout: () => {},
	connectMetamask: () => {}
};

export const AppStateContext = React.createContext<IAppStateContext>(
	initialContext
);

export const AppStateContextProvider: React.FC = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
	const [accountId, setAccountId] = useState<string>();
	const [network, setNetwork] = useState<string>('');
	const [balance, setBalance] = useState<string>('');

	const handleChainChange = useCallback(async (chainId: number): Promise<{
		error?: string;
		accountId?: string;
		network?: string;
	}> => {
		return new Promise((resolve, reject) => {
			let error;
			let accountId;

			const network = chainIDMap[chainId] || 'Unknown';

			web3.eth.getAccounts().then(async (accounts) => {
				if (!accounts || !accounts.length) {
					error = 'No metamask account found, connect metamask';
					resolve({ error });
				} else {
					accountId = accounts[0];
					resolve({ accountId, network });
				}
			});
		});
	}, []);

	const onChain = useCallback(
		async (chainId: number, web3: Web3) => {
			const { accountId, network } = await handleChainChange(chainId);

			if (accountId) {
				const balance = await web3.eth.getBalance(accountId);
				setBalance(balance);
				setAccountId(accountId);
				setNetwork(network || '');
			} else {
				setAccountId('');
				setNetwork('');
			}
		},
		[handleChainChange]
	);

	const autoConnect = useCallback(async () => {
		if (!isUsingMetamask()) return setIsLoggedIn(false);

		web3 = new Web3(ethereum);

		ethereum.on('chainChanged', (chainIdHex: string) => {
			const chainId = web3.utils.hexToNumber(chainIdHex);
			onChain(chainId, web3);
		});

		ethereum.on('accountsChanged', async (accounts: string[]) => {
			const balance = await web3.eth.getBalance(accounts[0]);
			setBalance(balance);
			setAccountId(accounts[0]);
		});

		let account: string | undefined = await getConnectedAccount();

		if (!account) return setIsLoggedIn(false);

		web3.eth.getChainId().then((chainId) => {
			onChain(chainId, web3);
		});

		setAccountId(account);
	}, [onChain]);

	useEffect(() => {
		if (!isLoggedIn) {
			autoConnect();
		}
	}, [autoConnect, isLoggedIn]);

	const connectMetamask = async () => {
		console.log('connect metamask called');
		if (!isUsingMetamask()) {
			return alert('Metamask not found');
		}

		web3 = new Web3(ethereum);

		let account: string | undefined = await getConnectedAccount();

		if (!account) {
			account = await requestConnectAccount();
			setAccountId(account);
		}

		ethereum.on('chainChanged', (chainIdHex: string) => {
			const chainId = web3.utils.hexToNumber(chainIdHex);
			onChain(chainId, web3);
			window.location.reload();
		});

		ethereum.on('accountsChanged', (accounts: string[]) => {
			setAccountId(accounts[0]);
		});
	};

	useEffect(() => {
		setIsLoggedIn(!!accountId);
	}, [accountId]);

	const onLogout = () => {
		setIsLoggedIn(false);
		setAccountId(undefined);
	};

	return (
		<AppStateContext.Provider
			value={{
				isLoggedIn,
				accountId,
				onLogout,
				connectMetamask,
				network,
				balance
			}}
		>
			{props.children}
		</AppStateContext.Provider>
	);
};
