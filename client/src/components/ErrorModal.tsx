import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

interface IErrorModalProps {
	message: string;
	onClickCancel: () => void;
}

const useStyles = makeStyles({
	title: {
		fontSize: 50,
		fontWeight: 600,
		marginBottom: 20
	},
	message: {
		color: 'red'
	},
	errorModalRoot: {
		width: 'fit-content',
		maxWidth: window.innerWidth * 0.8,
		borderRadius: 20,
		borderWidth: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 100,
		flexDirection: 'column',
		'& > *': {
			fontFamily: 'Blinker'
		},
		backgroundColor: 'whitesmoke',
		border: '5px solid red',
		position: 'relative',
		'&:focus': {
			outline: 'none',
			boxShadow: 'none'
		},
		zIndex: 9999
	},
	cancelButton: {
		position: 'absolute',
		right: 10,
		top: 10
	}
});

export const ErrorModal = ({ message, onClickCancel }: IErrorModalProps) => {
	const classes = useStyles();
	return (
		<div className={classes.errorModalRoot}>
			<IconButton onClick={onClickCancel} className={classes.cancelButton}>
				<Cancel />
			</IconButton>

			<div className={classes.title}>Error</div>

			<div className={classes.message}>{message}</div>
		</div>
	);
};
