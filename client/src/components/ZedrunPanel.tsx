import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

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

	useEffect(() => {
		fetch('https://zed-ql.zed.run/graphql', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		    'x-developer-secret': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjcnlwdG9maWVsZF9hcGkiLCJleHAiOjE2MzAzMTMxNzUsImlhdCI6MTYyNzg5Mzk3NSwiaXNzIjoiY3J5cHRvZmllbGRfYXBpIiwianRpIjoiZmYyY2ZkMjEtYWZiOS00M2YyLWFlNmYtMWQxYzg1YWJmNjFjIiwibmJmIjoxNjI3ODkzOTc0LCJzdWIiOnsiZXh0ZXJuYWxfaWQiOiJkOTY5Y2U3Yi0xNjQzLTQ5NTItODdkZS0zZGVkYjNkZDY4NDAiLCJpZCI6MTUwMzIxLCJwdWJsaWNfYWRkcmVzcyI6IjB4MjI1MUEyMjJCOWQ4MTYxNEJkMzdiRGE1RGY0OWU3RDJiMjk2MmM3MSIsInN0YWJsZV9uYW1lIjoiVHVscGFyIn0sInR5cCI6ImFjY2VzcyJ9.OOa-g_0NzD8ak0ylS-fQJRoHPq3tHKvdWEsSOyPKp2YIQs5qFF2o959T_bySNrIpINoQj5IQzxROpC8F2-KRxg',
		  },
		  body: JSON.stringify({query: "{get_race_results(first:12, input: {only_my_racehorses: false, classes: [0,1,2,3,4,5]}) {edges {node {race_id}}      }  }"})
		})
		  .then(r => r.json())
		  .then(data => console.log('data returned:', data));
	}, []);

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
