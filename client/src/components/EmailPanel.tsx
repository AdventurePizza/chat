import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { Email } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	buttonContainer: {
		fontSize: 20
	},
	panelContainer: {
		'& > *': {
			marginRight: 5
		},
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingTop: 10,
	}
});

interface IEmailPanelProps {
	sendEmail: (email: string, message: string) => void;
}

export const EmailPanel = ({ sendEmail }: IEmailPanelProps) => {
	const classes = useStyles();

	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const onClickSend = () => {
		sendEmail(email, message);
		setEmail('');
		setMessage('');
	};

	return (
		<div className={classes.panelContainer}>
			<TextField
				value={email}
				onChange={(evt) => setEmail(evt.currentTarget.value)}
				variant="outlined"
				label="enter email address"
			/>
			<TextField
				value={message}
				variant="outlined"
				onChange={(evt) => setMessage(evt.currentTarget.value)}
				label="add message"
			/>
			<Button onClick={onClickSend} variant="contained" color="primary">
				send
			</Button>
		</div>
	);
};

export const EmailButton = () => {
	const classes = useStyles();
	return (
		<div className={classes.buttonContainer}>
			<Email />
			<div>invite</div>
		</div>
	);
};
