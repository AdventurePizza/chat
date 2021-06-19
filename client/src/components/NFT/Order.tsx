import { Button, Paper, Tooltip, makeStyles } from '@material-ui/core';
import { INFTMetadata, OrderWithMetadata } from '../../types';
import React, { useContext, useEffect, useState } from 'react';

import { CustomToken as NFT } from '../../typechain/CustomToken';
import { ethers } from 'ethers';
import { AuthContext } from '../../contexts/AuthProvider';

const useStyles = makeStyles((theme) => ({
	orderRoot: {
		display: 'flex',
		flexDirection: 'column',
		padding: 25,
		alignItems: 'center',
		width: 400,
		height: 400,
		minWidth: 400,
		minHeight: 400,
		margin: 10,
		textDecoration: 'none',
		fontSize: '1rem'
	},
	orderName: {
		fontSize: '1.5rem'
		// margin: 10,
	},
	contractAddress: {
		fontSize: '0.8rem'
	},
	orderImage: {
		width: 180
	},
	sameLine: {
		display: 'flex',
		alignItems: 'center',
		'& > *': {
			marginRight: 10
		}
	},
	spaceVert: {
		marginTop: 20,
		marginBottom: 20
	},

	button: {
		width: 150
	},
	buttonContainer: {
		width: 'fit-content'
	},
	owner: {
		border: '1px solid lightblue',
		background: 'lightgreen',
		padding: 5,
		width: 'fit-content',
		height: 'fit-content'
	},
	orderBody: {
		height: 210,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
}));

interface IOrderProps {
	order: OrderWithMetadata;
	provider?: ethers.providers.Web3Provider;
	onBuy?: () => void;
	onCancel?: () => void;
	contract?: NFT;
	addNewContract?: (nftAddress: string) => Promise<NFT | undefined>;
}

export const Order = ({
	order,
	onBuy,
	onCancel,
	provider,
	contract,
	addNewContract
}: IOrderProps) => {
	const classes = useStyles();
	const [metadata, setMetadata] = useState<INFTMetadata>();
	const { accountId } = useContext(AuthContext);

	useEffect(() => {
		const getMetadata = async () => {
			if (!contract) return;

			const tokenURI = await contract.tokenURI(order.tokenId);
			const contractName = await contract.name();

			fetch(tokenURI)
				.then((res) => res.json())
				.then((data) => setMetadata({ ...data, contractName }));
		};

		if (!metadata && order && provider) {
			if (!contract && addNewContract) {
				addNewContract(order.contractAddress);
			} else {
				getMetadata().catch(console.log);
			}
		} else if (!metadata && !provider && order.metadata) {
			setMetadata(order.metadata);
		}
	}, [metadata, order, provider, contract, addNewContract, accountId]);

	const isOwnNFT =
		accountId?.toLowerCase() === order.ownerAddress.toLowerCase();

	//   const onClickCopyAddress = (address: string) => {
	//     navigator.clipboard.writeText(address);
	//   };

	return (
		<Paper elevation={12} className={classes.orderRoot}>
			{metadata && (
				<span>
					{metadata.contractName}

					{/* <Tooltip title={order.contractAddress}>
            <IconButton
              onClick={() => onClickCopyAddress(order.contractAddress)}
            >
              <FileCopy />
            </IconButton>
          </Tooltip> */}
				</span>
			)}
			{metadata && <div className={classes.orderName}>{metadata.name}</div>}
			<div className={classes.orderBody}>
				{metadata && (
					<img
						className={classes.orderImage}
						src={metadata.image}
						alt="token metadata"
					/>
				)}
				<div>price: {order.priceEth} matic</div>
				<div>id: {order.tokenId}</div>
			</div>
			<div className={`${classes.sameLine} ${classes.spaceVert}`}>
				{onBuy && (
					<Tooltip title={isOwnNFT ? 'cannot buy own nft' : ''}>
						<div className={classes.buttonContainer}>
							<Button
								disabled={isOwnNFT}
								className={classes.button}
								onClick={onBuy}
							>
								buy
							</Button>
						</div>
					</Tooltip>
				)}

				{isOwnNFT && <div className={classes.owner}>owner</div>}
				{isOwnNFT && onCancel && (
					<Button className={classes.button} onClick={onCancel}>
						remove
					</Button>
				)}

				{/* {metadata && metadata.lockedId && (
          <Tooltip title="contains unlockable content">
            <Lock />
          </Tooltip>
        )} */}
			</div>

			<div className={classes.contractAddress}>
				contract id: {order.contractAddress}
			</div>
		</Paper>
	);
};
