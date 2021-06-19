import React, { useContext } from 'react';

import { makeStyles, Paper } from '@material-ui/core';
import { AuthContext } from '../contexts/AuthProvider';
import { MetamaskButton } from './MetamaskButton';

const useStyles = makeStyles((theme) => ({
	metamaskRoot: {
		position: 'absolute',
		top: 10,
		right: 10,
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
	const { isLoggedIn } = useContext(AuthContext);

	return (
		<div className={classes.metamaskRoot}>
			{!isLoggedIn && <MetamaskButton />}
			{isLoggedIn && <Avatar />}
		</div>
	);
};

const Avatar = () => {
	const { balance, accountId, network } = useContext(AuthContext);
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
