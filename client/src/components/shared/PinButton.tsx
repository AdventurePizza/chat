import { IconButton, Tooltip } from '@material-ui/core';

import { Cancel } from '@material-ui/icons';
import OpenWithIcon from '@material-ui/icons/OpenWith';
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
		opacity: 0.8,
		'& .MuiIconButton-root': {
			padding: 0
		},
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 'fit-content',
		padding: 5
	},
	buttonIcon: {
		fontSize: '0.8em'
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
						<Cancel className={classes.buttonIcon} />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title={`pin ${placeholder || 'item'}`}>
					<IconButton onClick={onPin}>
						<PinButtonImage />
					</IconButton>
				</Tooltip>
			)}
		</div>
	);
};

export const PinButtonImage = ({ style }: { style?: React.CSSProperties }) => {
	const classes = useStyles();
	return (
		<img
			alt="push-pin"
			className={classes.pushPin}
			src={pushPinIcon}
			style={style}
		/>
	);
};

interface IMoveButtonProps {
	onClick: () => void;
	innerRef?: React.RefObject<HTMLDivElement>;
}

export const MoveButton = ({ onClick, innerRef }: IMoveButtonProps) => {
	const classes = useStyles();

	return (
		<div ref={innerRef} className={classes.container}>
			<Tooltip title="move item">
				<IconButton onClick={onClick}>
					<OpenWithIcon className={classes.buttonIcon} />
				</IconButton>
			</Tooltip>
		</div>
	);
};
