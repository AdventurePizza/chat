import { MoveButton, PinButton } from './shared/PinButton';
import React, { useState } from 'react';

import { IOpenGraph } from '../types';
import { getUnfurlData, firstLinkFrom, checkAddProtocolTo } from '../App';
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

	onPin: () => void;
	onUnpin: () => void;

	top: number;
	left: number;

	isPinned?: boolean;
}

interface UnfurledTextProps {
	userText: string;
	unfurlOpenGraph: IOpenGraph;
	linkFromText: string;
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
	const classes = useStyles();
	const [isHovering, setIsHovering] = useState(false);
	const [unfurlOpenGraph, setUnfurlOpenGraph] = useState<IOpenGraph>();
	const linkFromText = type === 'text' && text ? firstLinkFrom(text) || '' : '';
	const isTextALink = !!linkFromText;

	useEffect(() => {
		if (unfurlOpenGraph || !isTextALink) return;
		const handleEffect = async () => {
			try {
				const unfurlDataRes = await getUnfurlData(linkFromText);
				const openGraphData = unfurlDataRes.open_graph;
				setUnfurlOpenGraph(openGraphData);
			} catch (error) {
				console.log('error: ' + error);
			}
		};
		handleEffect();
	}, [isTextALink, linkFromText, unfurlOpenGraph]); // Wanted empty but Warning said to put them in...
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
				{type === 'text' && text && unfurlOpenGraph ? (
					<UnfurledText
						unfurlOpenGraph={unfurlOpenGraph}
						linkFromText={linkFromText}
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

const UnfurledText = ({
	userText,
	unfurlOpenGraph,
	linkFromText
}: UnfurledTextProps) => {
	const classes = useStyles();
	const { title, site_name, images } = unfurlOpenGraph;
	const { url: image } = images![0];
	const [leftText, rightText] = userText.split(linkFromText);
	const protocolLink = checkAddProtocolTo(linkFromText);
	return (
		<div className={classes.unfurledContainer}>
			<p className={classes.userText}>
				{leftText}
				<a
					style={{ textDecoration: 'none', color: '#206da8' }}
					href={protocolLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{linkFromText}
				</a>
				{rightText}
			</p>
			<b className={classes.title}>{site_name}</b>
			<a
				href={protocolLink}
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
