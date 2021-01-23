import { MoveButton, PinButton } from './shared/PinButton';
import React, { useState } from 'react';

import { checkAddProtocolTo } from '../App';
import { IMetadata } from '../types';
import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDrag } from 'react-dnd';

const useStyles = makeStyles({
	container: {
		position: 'absolute',
		zIndex: 9999995,
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
	},
	unfurledContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '200px'
	},
	userText: {
		margin: '0px',
		wordWrap: 'break-word'
	},
	title: {
		fontSize: '14px',
		fontWeight: 'bolder'
	},
	link: {
		textDecoration: 'none',
		fontWeight: 'bold',
		lineHeight: '16px',
		marginBottom: '3px',
		color: '#206da8',
		fontSize: '14px'
	},
	image: {
		borderRadius: '6px'
	}
});

interface BoardObjectProps {
	id: string;
	type: 'gif' | 'image' | 'text';
	data?: IGif;
	imgSrc?: string;
  text?: string;
  metadata?: IMetadata;
	textLink?: string;

	onPin: () => void;
	onUnpin: () => void;

	top: number;
	left: number;

	isPinned?: boolean;
}

interface UnfurledTextProps {
	userText: string;
	textLink: string;
	metadata: IMetadata;
}

export const BoardObject = (props: BoardObjectProps) => {
	const {
		top,
		left,
		data,
		onPin,
		onUnpin,
		isPinned,
		type,
		imgSrc,
    text,
    metadata,
		textLink,
		id
	} = props;
	const [isHovering, setIsHovering] = useState(false);
	const classes = useStyles();

	const [{ isDragging }, drag, preview] = useDrag({
		item: { id, left, top, itemType: type, type: 'item' },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
  });
  
  if (isDragging) {
		return <div ref={preview} />;
	}

	return (
		<div
			style={{
				top,
				left,
				zIndex: isHovering ? 99999999 : 'auto'
			}}
			className={classes.container}
			ref={preview}
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
				{type === 'text' && text && (metadata && textLink) ? (
					<UnfurledText
						metadata={metadata}
						textLink={textLink}
						userText={text}
					/>
				) : (
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
					{/*@ts-ignore needs better typing for innerRef*/}
					{isPinned && <MoveButton innerRef={drag} />}
				</div>
			)}
		</div>
	);
};

export const UnfurledText = ({
	userText,
	metadata,
	textLink
}: UnfurledTextProps) => {
	const classes = useStyles();
	const { title, provider: siteName, image } = metadata;
	const [textLeft, textRight] = userText.split(textLink);
	const LinkWithProtocol = checkAddProtocolTo(textLink);
	return (
		<div className={classes.unfurledContainer}>
			<p className={classes.userText}>
				{textLeft}
				<a
					style={{ textDecoration: 'none', color: '#206da8' }}
					href={LinkWithProtocol}
					target="_blank"
					rel="noopener noreferrer"
				>
					{textLink}
				</a>
				{textRight}
			</p>
			<b className={classes.title}>{siteName}</b>
			<a
				href={LinkWithProtocol}
				target="_blank"
				rel="noopener noreferrer"
				className={classes.link}
			>
				{title}
			</a>
			<img className={classes.image} src={image} alt={title} />
		</div>
	);
};