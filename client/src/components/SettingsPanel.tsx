import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	container: {
		'& > *:not(:last-child)': {
			marginRight: 10
		},
		display: 'flex',
		alignItems: 'center'
	}
});

interface ISettingsPanelProps {
	onChangeName: (username: string) => void;
}

export const SettingsPanel = ({ onChangeName }: ISettingsPanelProps) => {
	const [usernameValue, setUsernameValue] = useState('');

	const classes = useStyles();

	const submitName = () => {
		onChangeName(usernameValue);
		setUsernameValue('');
	};

	return (
		<div className={classes.container}>
			<TextField
				onKeyPress={(evt) => evt.key === 'Enter' && submitName()}
				value={usernameValue}
				onChange={(evt) => setUsernameValue(evt.target.value)}
				variant="outlined"
				placeholder="enter new username"
			/>
			<Button onClick={submitName} variant="contained">
				change name
			</Button>
		</div>
	);
};
