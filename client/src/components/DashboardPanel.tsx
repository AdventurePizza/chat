import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import axios from "axios";


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

	const getHorse = async (id: string)  => await axios.get('https://api.zed.run/api/v1/horses/get/62352');



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
					//<setHorseId(inputValue!);
					//</div>console.log(getHorse(inputValue!));
				}}
			>
				{' '}
				Add{' '}
			</Button>
			
		</div>
	);
};