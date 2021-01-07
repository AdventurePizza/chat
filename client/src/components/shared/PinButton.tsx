import { IconButton, Tooltip } from '@material-ui/core';

import { Cancel } from '@material-ui/icons';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import pushPinIcon from '../../assets/push-pin.svg';

const useStyles = makeStyles({
	pushPin: {
		width: 25,
		height: 25
	},
	container: {
		background: 'whitesmoke',
		borderRadius: 20,
		opacity: 0.8
	},
	paper: {
		padding: 5
	},
	buttonList: {
		display: 'flex',
		flexDirection: 'column'
	}
});

interface IPinButtonProps {
	isPinned?: boolean;
	onPin: () => void;
	onUnpin: () => void;
	placeholder?: string;
}

export const PinButton = ({
	isPinned,
	onPin,
	onUnpin,
	placeholder
}: IPinButtonProps) => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			{isPinned ? (
				<Tooltip title={`unpin ${placeholder || 'item'}`} placement="top">
					<IconButton onClick={onUnpin}>
						<Cancel />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title={`pin ${placeholder || 'item'}`}>
					<IconButton onClick={onPin}>
						<img alt="push-pin" className={classes.pushPin} src={pushPinIcon} />
					</IconButton>
				</Tooltip>
			)}
		</div>
	);
};
