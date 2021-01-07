import { Button, InputBase } from '@material-ui/core';
import React, { useState } from 'react';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
		borderRadius: 50
	},
	input: {
		marginLeft: 10,
		flex: 1,
		fontFamily: 'Didact Gothic',
		fontSize: 25
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	},
	submitButton: {
		backgroundColor: '#87D3F3',
		color: 'white',
		'&:hover': {
			backgroundColor: '#b0e2f6',
			color: 'white'
		},
		borderRadius: 30
	}
});

interface IInputButtonProps {
	placeholder?: string;
	onClick: (value: string) => void;
	buttonText: string;
	inputWidth?: number;
	updateValue?: (inputValue: string) => void;
}

export const InputButton = ({
	placeholder,
	onClick,
	buttonText,
	inputWidth,
	updateValue
}: IInputButtonProps) => {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState('');

	const onClickSubmit = () => {
		setInputValue('');
		onClick(inputValue);
	};

	const onChangeInputValue = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = evt.currentTarget.value;
		setInputValue(value);
		if (updateValue) {
			updateValue(value);
		}
	};

	return (
		<div>
			<Paper
				component="form"
				className={classes.root}
				style={{ width: inputWidth }}
			>
				<InputBase
					className={classes.input}
					placeholder={placeholder}
					inputProps={{ 'aria-label': placeholder }}
					value={inputValue}
					onChange={onChangeInputValue}
				/>
				<Divider className={classes.divider} orientation="vertical" />
				<IconButton
					color="primary"
					className={classes.iconButton}
					aria-label="directions"
				>
					<Button
						onClick={onClickSubmit}
						className={classes.submitButton}
						variant="contained"
					>
						{buttonText}
					</Button>
				</IconButton>
			</Paper>
		</div>
	);
};
