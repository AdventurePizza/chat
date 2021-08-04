import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

interface ISuccessModalProps {
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
		color: 'black'
	},
	successModalRoot: {
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
		border: '5px solid blue',
		position: 'relative',
		'&:focus': {
			outline: 'none',
			boxShadow: 'none'
		},
	},
	cancelButton: {
		position: 'absolute',
		right: 10,
		top: 10
	}
});

export const SuccessModal = ({
	message,
	onClickCancel
}: ISuccessModalProps) => {
	const classes = useStyles();
	return (
		<div className={classes.successModalRoot}>
			<IconButton onClick={onClickCancel} className={classes.cancelButton}>
				<Cancel />
			</IconButton>

			<div className={classes.title}>Success</div>

			<div className={classes.message}>{message}</div>
		</div>
	);
};
