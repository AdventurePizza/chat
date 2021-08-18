import { Button, TextField, makeStyles } from '@material-ui/core';
import { InputOutlined } from '@material-ui/icons';
import React, { useState } from 'react';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		width: '100%',
		'& > *': {
			marginRight: 10
		}
		
	},
	input: {
		borderRadius: 20,
		background: 'white'
	}
});

interface IMarketplacePanel {
	sendHorse: (id: string, type: 'horse') => void;
}

export const MarketplacePanel = ({ sendHorse }: IMarketplacePanel) => {
	const classes = useStyles();
	const [input, setInput] = useState('');

	return (
		<div className={classes.container}>
			<TextField
				value={InputOutlined}
				onChange={(e) => setInput(e.target.value)}
				variant="outlined"
				placeholder="enter collection slug"
				className={classes.input}
			/>
			<Button
				variant="contained" color="primary"
				onClick={() => {
					//sendHorse (input, 'horse');
				}}
			>
				Add
			</Button>
		</div>
	);
};