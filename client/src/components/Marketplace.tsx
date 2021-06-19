import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Marketplace } from 'adventure-component-library';

const useStyles = makeStyles((theme) => ({
	marketplaceRoot: {
		display: 'flex',
		overflowX: 'auto',
		width: '100%',
		height: 400
	}
}));

export const MarketplacePanel = () => {
	const classes = useStyles();
	return (
		<div className={classes.marketplaceRoot}>
			<Marketplace hideListingsText />
		</div>
	);
};
