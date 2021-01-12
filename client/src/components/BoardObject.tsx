import React, { useState } from 'react';

import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper } from '@material-ui/core';
import { PinButton } from './shared/PinButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	container: {
		position: 'absolute',
		zIndex: 9999998,
		userSelect: 'none',
		display: 'flex'
	},
	paper: {
		padding: 5
	},
	buttonList: {
		display: 'flex',
		flexDirection: 'column'
	},
	text: {
		padding: 5,
		display: 'flex',
		justifyContent: 'center'
	}
});

interface BoardObjectProps {
	type: 'gif' | 'image' | 'text';
	data?: IGif;
	imgSrc?: string;
	text?: string;

	onPin: () => void;
	onUnpin: () => void;

	top: number;
	left: number;

	isPinned?: boolean;
}

export const BoardObject = ({
	top,
	left,
	data,
	onPin,
	onUnpin,
	isPinned,
	type,
	imgSrc,
	text
}: BoardObjectProps) => {
	const [isHovering, setIsHovering] = useState(false);
	const classes = useStyles();

	return (
		<div
			style={{
				top,
				left
			}}
			className={classes.container}
		>
			<Paper
				elevation={5}
				className={classes.paper}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onTouchStart={() => setIsHovering(true)}
				onTouchEnd={() => setIsHovering(false)}
			>
				{type === 'gif' && data && <Gif gif={data} width={180} noLink={true} />}
				{type === 'image' && imgSrc && (
					<img alt="user-selected-img" src={imgSrc} style={{ width: 180 }} />
				)}
				{type === 'text' && text && (
					<div className={classes.text} style={{ width: 180 }}>
						{text}
					</div>
				)}
			</Paper>

			{isHovering && (
				<div
					className={classes.buttonList}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					onTouchStart={() => setIsHovering(true)}
					onTouchEnd={() => setIsHovering(false)}
				>
					<PinButton isPinned={isPinned} onPin={onPin} onUnpin={onUnpin} />
				</div>
			)}
		</div>
	);
};
