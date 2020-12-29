import { IconButton } from '@material-ui/core';
import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';

interface IUserSettingsProps {
	onClick: () => void;
}

export const UserSettings = ({ onClick }: IUserSettingsProps) => {
	return (
		<IconButton onClick={onClick}>
			<SettingsIcon />
		</IconButton>
	);
};
