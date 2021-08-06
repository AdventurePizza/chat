import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
	horsePanelRoot: {
		padding: 20,
		display: 'flex',
		alignItems: 'center',
		'& > *': {
			marginRight: 10
		}
	}
}));

interface IDashboardPanel {
	sendHorse: (id: string, type: 'horse') => void;
}

export const DashboardPanel = ({ sendHorse }: IDashboardPanel) => {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState('');

	return (
		<div className={classes.horsePanelRoot}>
			<TextField
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				variant="outlined"
				label="enter horse id"
			/>
			<Button
				variant="contained"
				onClick={() => {
					sendHorse (inputValue, 'horse');
				}}
			>
				{' '}
				Add{' '}
			</Button>
			
		</div>
	);
};