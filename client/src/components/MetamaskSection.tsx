import React, { useContext } from 'react';

import { makeStyles, Button, Paper } from '@material-ui/core';
import { AppStateContext } from '../contexts/appState';

const useStyles = makeStyles((theme) => ({
	metamaskRoot: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 100
	},
	avatarRoot: {
		display: 'flex',
		flexDirection: 'column',
		width: 250,
		padding: 20
	},
	balance: {},
	account: {}
}));

export const MetamaskSection = () => {
	const classes = useStyles();
	const { isLoggedIn, connectMetamask } = useContext(AppStateContext);

	return (
		<div className={classes.metamaskRoot}>
			{!isLoggedIn && (
				<Button
					variant="contained"
					onClick={() => {
						console.log('connect called');
						connectMetamask();
					}}
				>
					connect metamask
				</Button>
			)}
			{isLoggedIn && <Avatar />}
		</div>
	);
};

const Avatar = () => {
	const { balance, accountId, network } = useContext(AppStateContext);
	console.log(balance);
	const classes = useStyles();
	const slicedAccountAddress = accountId
		? accountId.slice(0, 4) + '...' + accountId.slice(-3)
		: '';
	return (
		<Paper className={classes.avatarRoot}>
			<div className={classes.balance}>
				balance: {balance?.slice(0, -18)} eth
			</div>
			<div title={accountId} className={classes.account}>
				account: {slicedAccountAddress}
			</div>
			{network && <div>network: {network}</div>}
		</Paper>
	);
};
