import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';

const useStyles = makeStyles((theme) => ({
	horsePanelRoot: {
		padding: 20,
		display: 'flex',
		alignItems: 'center',
		'& > *': {
			marginRight: 10
		}
	},
	link: {
		fontStyle: 'none',
		textDecoration: 'none'
	}
}));

const baseURLRace = 'https://3d-racing.zed.run/';

interface IZedrunPanel {
	setRaceId: (raceId: string) => void;
}

export const ZedrunPanel = ({ setRaceId }: IZedrunPanel) => {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState('');
	const firebaseContext = useContext(FirebaseContext);

	const roomId = useMemo(() => {
		if (inputValue.includes(baseURLRace)) {
			let textIndex = inputValue.indexOf('replay');

			if (textIndex !== -1) {
				return inputValue.slice(textIndex + 'replay/'.length);
			} else {
				textIndex = inputValue.indexOf('live');
				if (textIndex !== -1) {
					return inputValue.slice(textIndex + 'live/'.length);
				}
			}
		} else return inputValue;
	}, [inputValue]);

	const getRaces = async () => {
		const res = await firebaseContext.getRaces();
		console.log(res);
	}

	getRaces();
	return (
		<div className={classes.horsePanelRoot}>
			<TextField
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				variant="outlined"
				label="enter race id or url"
			/>
			<Button
				variant="contained"
				onClick={() => {
					setRaceId(roomId!);
				}}
			>
				{' '}
				Watch{' '}
			</Button>
			<Button
				variant="contained"
				onClick={() => {
					setRaceId('');
				}}
			>
				{' '}
				Close{' '}
			</Button>
		</div>
	);
};
