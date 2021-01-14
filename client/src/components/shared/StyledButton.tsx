import { Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	button: {
		backgroundColor: 'var(--primary)',
		color: 'white',
		'&:hover': {
			backgroundColor: '#b0e2f6',
			color: 'white'
		},
		borderRadius: 30
	}
});

interface IStyledButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}

export const StyledButton = ({ onClick, children }: IStyledButtonProps) => {
	const classes = useStyles();

	return (
		<Button className={classes.button} onClick={onClick}>
			{children}
		</Button>
	);
};
