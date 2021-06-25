import React from 'react';

import { makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	profileRoot: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%'
	},
	left: {},
	right: {}
}));

export const Profile = () => {
	const classes = useStyles();

	return (
		<div className={classes.profileRoot}>
			<div className={classes.left}>
				<span>metamask account:</span>
				<span>balance: X matic</span>
			</div>

			<div className={classes.right}>
				<span>
					weather <TextField />
				</span>
				<span>
					music url <TextField />
				</span>
			</div>
		</div>
	);
};
