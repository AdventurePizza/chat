import { Button, TextField, makeStyles } from '@material-ui/core';
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

interface IHorsePanel {
	sendHorse: (id: string, type: 'horse') => void;
}

export const HorsePanel = ({ sendHorse }: IHorsePanel) => {
	const classes = useStyles();
	const [inputHorse, setInputHorse] = useState('');

	return (
		<div className={classes.container}>
			<TextField
				value={inputHorse}
				onChange={(e) => setInputHorse(e.target.value)}
				variant="outlined"
				placeholder="enter horse id"
				className={classes.input}
			/>
			<Button
				variant="contained" color="primary"
				onClick={() => {
					sendHorse (inputHorse, 'horse');
				}}
			>
				Add
			</Button>
		</div>
	);
};