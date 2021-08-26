import React, { useContext, useEffect, useState } from 'react';

import { CircularProgress, makeStyles } from '@material-ui/core';
import { ISubmit, OrderInput } from './OrderInput';
import { AuthContext } from '../../contexts/AuthProvider';
import { Marketplace as MarketplaceType } from '../../typechain/Marketplace';
import { CustomToken as NFT } from '../../typechain/CustomToken';
import abiMarketplace from '../../abis/Marketplace.abi.json';
import abiNFT from '../../abis/NFT.abi.json';
import * as ethers from 'ethers';
import { config, network } from '../../config';
import { IChatRoom } from '../../types';

const contractAddressMarketplace = config[network].contractAddressMarketplace;

const useStyles = makeStyles((theme) => ({
	nftPanelRoot: {
		display: 'flex',
		flexDirection: 'column',
		maxHeight: 400,
		overflowY: 'auto',

		paddingInline: 15
	},
	loadingNFTRoot: {
		width: 300,
		height: 300,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		'& > *': {
			marginBottom: 10
		},
		background: 'rgba(0,0,0,.25)',
		position: 'absolute',
		margin: '0 auto',
		left: 0,
		right: 0,
		marginTop: '20%'
	}
}));

interface INFTPanelProps {
	onError: (message: string) => void;
	onSuccess: (submission: ISubmit) => void;
	roomData?: IChatRoom;
}

export const NFTPanel = ({ onError, onSuccess, roomData }: INFTPanelProps) => {
	const classes = useStyles();
	const { provider, isLoggedIn, accountId } = useContext(AuthContext);
	const [contractsNFT, setContractsNFT] = useState<{
		[contractAddress: string]: NFT;
	}>({});

	const [
		contractMarketplace,
		setContractMarketplace
	] = useState<MarketplaceType>();

	useEffect(() => {
		if (provider) {
			setMarketplaceContract(provider);
		}
	}, [provider]);

	const setMarketplaceContract = async (
		provider: ethers.providers.Web3Provider
	) => {
		if (!provider) return;

		const newContractMarketplace = new ethers.Contract(
			contractAddressMarketplace,
			abiMarketplace,
			provider.getSigner()
		) as MarketplaceType;

		await newContractMarketplace.deployed();

		setContractMarketplace(newContractMarketplace);
	};

	const onSubmit = async (submission: ISubmit) => {
		const {
			nftAddress,
			tokenId,
			priceEth,
			isPartnered,
			isPiped,
			partnerSharePerc,
			pipes
		} = submission;

		if (!provider || !contractMarketplace) return;

		// check if valid submission
		const { isValid, error } = verifySubmission(submission);

		if (!isValid) {
			onError(error!);
			return;
		}

		const txFee = ethers.utils.parseEther('0.01');
		const price = ethers.utils.parseEther(priceEth);

		let contractNFT = contractsNFT[nftAddress];
		if (!contractNFT) {
			let newContractNFT = await addNewContract(nftAddress);
			if (newContractNFT) {
				contractNFT = newContractNFT;
			} else {
				onError(
					'Error adding order, could not add contract with address ' +
						nftAddress
				);
				// return alert(
				//   "Error adding order, could not add contract with address " +
				//     nftAddress
				// );
			}
		}

		contractNFT
			.approve(contractAddressMarketplace, tokenId)
			.then(async (result) => {
				await result.wait();
				if (isPartnered) {
					return contractMarketplace.addOrderPartnered(
						nftAddress,
						tokenId,
						price,
						partnerSharePerc,
						pipes,
						{
							value: txFee
						}
					);
				} else if (isPiped) {
					return contractMarketplace.addOrderWithPipe(
						nftAddress,
						tokenId,
						price,
						pipes,
						{
							value: txFee
						}
					);
				}

				return contractMarketplace.addOrder(nftAddress, tokenId, price, {
					value: txFee
				});
			})
			.then((addOrderResult) => {
				addOrderResult.wait().then(() => {
					console.log('transaction confirmed');
				});
				// alert("successfully added order");
				// setSuccess(true);

				onSuccess(submission);
			})
			.catch((e) => {
				console.error(e);
				if (e && e.data && e.data.message) {
					const indexOfRevert = e.data.message.indexOf('reverted');
					if (indexOfRevert !== -1) {
						onError(
							'error adding order: ' +
								e.data.message.substring(indexOfRevert + 'reverted'.length)
						);
						// alert(
						//   "error adding order: " +
						//     e.data.message.substring(indexOfRevert + "reverted".length)
						// );
					}
				} else {
					//   alert("error adding order");
					onError('error adding order');
				}
			});
	};

	const addNewContract = async (
		nftAddress: string
	): Promise<NFT | undefined> => {
		if (!provider) return undefined;

		const contractNFT = new ethers.Contract(
			nftAddress,
			abiNFT,
			provider.getSigner()
		) as NFT;

		await contractNFT.deployed();

		setContractsNFT((contractsNFT) => ({
			...contractsNFT,
			[nftAddress]: contractNFT
		}));

		return contractNFT;
	};

	const isAddOrderDisabled =
		!roomData ||
		!roomData.isLocked ||
		!roomData.lockedOwnerAddress ||
		!isLoggedIn ||
		!accountId ||
		accountId?.toLowerCase() !== roomData.lockedOwnerAddress.toLowerCase();

	return (
		<div className={classes.nftPanelRoot}>
			<OrderInput
				disabledMessage={
					isAddOrderDisabled
						? 'You must be the owner of a locked room to add NFTs'
						: undefined
				}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

const verifySubmission = ({
	nftAddress,
	tokenId,
	priceEth,
	isPartnered,
	isPiped,
	partnerSharePerc,
	pipes
}: ISubmit): { isValid: boolean; error?: string } => {
	if (!ethers.utils.isAddress(nftAddress)) {
		return { isValid: false, error: `Invalid NFT address ${nftAddress}` };
	}

	if (isNaN(tokenId) || tokenId < 0) {
		return { isValid: false, error: `Invalid token id ${tokenId}` };
	}

	if (isPartnered && (isNaN(partnerSharePerc) || partnerSharePerc <= 0)) {
		return {
			isValid: false,
			error: `Invalid partner share percent ${partnerSharePerc}`
		};
	}

	if (isPiped) {
		if (!pipes.length) {
			return {
				isValid: false,
				error: 'Invalid pipes, must have at least 1 pipe'
			};
		}

		let sumPipes = 0;

		for (const { sharePerc, toAddress } of pipes) {
			sumPipes += sharePerc;
			if (!ethers.utils.isAddress(toAddress)) {
				return {
					isValid: false,
					error: `Invalid pipe to address: ${toAddress}`
				};
			}
		}

		if (isPartnered) {
			sumPipes += partnerSharePerc;
		}

		if (sumPipes !== 100) {
			if (isPartnered) {
				return {
					isValid: false,
					error: `Invalid pipe sum including partner: ${sumPipes}, should sum to 100`
				};
			} else {
				return {
					isValid: false,
					error: `Invalid pipe sum: ${sumPipes}, should sum to 100`
				};
			}
		}
	}

	return { isValid: true };
};

export const LoadingNFT = ({ submission }: { submission: ISubmit }) => {
	const classes = useStyles();
	return (
		<div className={classes.loadingNFTRoot}>
			<div>contract address: {submission.nftAddress}</div>
			<div>price: {submission.priceEth} matic</div>
			<div>tokenId: {submission.tokenId}</div>
			<div>Waiting for order to be added</div>
			<CircularProgress />
		</div>
	);
};
