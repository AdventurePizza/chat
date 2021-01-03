import { InputButton } from './InputButton';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	container: {
		'& > *:not(:last-child)': {
			marginRight: 10
		},
		display: 'flex',
		alignItems: 'center',
		overflowX: 'auto'
	}
});

interface ISettingsPanelProps {
	onChangeName: (username: string) => void;
	onSubmitUrl: (url: string) => void;
}

export const SettingsPanel = ({
	onChangeName,
	onSubmitUrl
}: ISettingsPanelProps) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<InputButton
				buttonText="go!"
				placeholder="enter name"
				onClick={onChangeName}
				inputWidth={300}
			/>
			<InputButton
				buttonText="go!"
				placeholder="enter music url"
				onClick={onSubmitUrl}
				inputWidth={300}
			/>
		</div>
	);
};
