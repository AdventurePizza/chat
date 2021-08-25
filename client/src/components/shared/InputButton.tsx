import React, { useState } from 'react';

import Divider from '@material-ui/core/Divider';
import { InputBase } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { StyledButton } from './StyledButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		padding: '2px 5px',
		height: 45,
		display: 'flex',
		alignItems: 'center',
		width: 400,
		borderRadius: 50
	},
	input: {
		marginLeft: 10,
		flex: 1,
		fontFamily: 'Didact Gothic',
		fontSize: 16
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
});

interface IInputButtonProps {
	placeholder?: string;
	onClick: (value: string) => void;
	buttonText: string;
	inputWidth?: string | number;
	updateValue?: (inputValue: string) => void;
	setStep?: (step: number) => void;
	onSubmit?: (val: boolean) => void;
}

export const InputButton = ({
	placeholder,
	onClick,
	buttonText,
	inputWidth,
	updateValue,
	setStep,
	onSubmit
}: IInputButtonProps) => {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState('');

	const onClickSubmit = () => {
		setInputValue('');
		onClick(inputValue);
		if(setStep){
			setStep(2);
		}
		if(onSubmit){
			onSubmit(false);
		}
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
			
				<StyledButton onClick={onClickSubmit}>{buttonText}</StyledButton>
			</Paper>
		</div>
	);
};
