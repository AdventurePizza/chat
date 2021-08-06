import { MoveButton, PinButton } from './shared/PinButton';
import React, { useState, useContext } from 'react';

import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDrag } from 'react-dnd';
import { IOrder, IWaterfallMessage } from '../types';
import { Order } from './NFT/Order';
import { CustomToken as NFT } from '../typechain/CustomToken';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Map } from "./Maps";
import { WaterfallChat } from "./WaterfallChat";
import ReactPlayer from 'react-player';
import { AppStateContext } from '../contexts/AppStateContext';
import { useEffect } from 'react';

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
		justifyContent: 'center',
		whiteSpace: 'pre-line' //allows it to display multiple lines!
	}
});

interface BoardObjectProps {
	id: string;
	type: 'gif' | 'image' | 'video' | 'text' | 'NFT' | 'map' | 'chat';
	data?: IGif;
	imgSrc?: string;
	text?: string;

	onPin: () => void;
	onUnpin: () => void;
	setPinnedVideoId?: (id: string) => void;

	top: number;
	left: number;

	isPinnedPlaying?: boolean;
	pinnedVideoId?: string;
	isPinned?: boolean;
	order?: IOrder;

	addNewContract?: (nftAddress: string) => Promise<NFT | undefined>;

	onBuy?: (nftId: string) => void;
	onCancel?: (nftId: string) => void;

	chat?: IWaterfallMessage[];
}

export const BoardObject = (props: BoardObjectProps) => {
	const {
		top,
		left,
		data,
		onPin,
		onUnpin,
		isPinnedPlaying,
		pinnedVideoId,
		setPinnedVideoId,
		isPinned,
		type,
		imgSrc,
		text,
		id,
		order,
		addNewContract,
		onBuy,
		onCancel,
		chat
	} = props;
	const [isHovering, setIsHovering] = useState(false);
	const [pinPlaying, setPinPlaying] = useState(isPinnedPlaying);
	const classes = useStyles();

	const { socket } = useContext(AppStateContext);

	// useEffect(() => {

	// }, [isPinned ])

	const [{ isDragging }, drag, preview] = useDrag({
		item: { id, left, top, itemType: type, type: 'item' },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});

	if (isDragging) {
		return <div ref={preview} />;
	}

	const noLinkPrev = <div className={classes.text} style={{ width: 180 }}>{text}</div>;

	return (
		<div
			style={{
				top,
				left,
				/* zIndex: isHovering ? 99999999 : 'auto' */
				zIndex: isHovering ? 99999999 : 99999997
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
				{type === 'text' && text && (
					<div className={classes.text} style={{ width: 200 }}>
						<div>{text && <LinkPreview url= {text!}fallback= {noLinkPrev} descriptionLength= {50} imageHeight= {100} showLoader= {false} />}</div>
					</div>
				)}
				{type === 'NFT' && order && (
					<Order
						onBuy={() => (onBuy ? onBuy(id) : undefined)}
						onCancel={() => (onCancel ? onCancel(id) : undefined)}
						addNewContract={addNewContract}
						order={order}
					/>
				)}
				{type === 'map' && data && <Map />}
				{type === 'video' && id && (
				<div className="pinned-video-player"
					style={{
						height: "225px",
						width: "400px"
					}}
					onClick={() => {
						console.log("hello")
					}}
				>
					<ReactPlayer width="100%" height="100%"
						url={`https://www.youtube.com/watch/${id}`}
						controls={true}
						playing={isPinnedPlaying}
						onPlay={
							() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: true
								})
							}
						}
						onPause={
							() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: false
								})
							}
						}
					/>
				</div>
					)
				}
				{type === 'chat' && chat && <WaterfallChat chat= {chat}/>}
			</Paper>

			{isHovering && (
				<div
					className={classes.buttonList}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					onTouchStart={() => setIsHovering(true)}
					onTouchEnd={() => setIsHovering(false)}
				>
					{type !== 'chat' && <PinButton isPinned={isPinned} onPin={onPin} onUnpin={onUnpin} />}
					{/*@ts-ignore needs better typing for innerRef*/}
					{(isPinned || type === 'chat') && <MoveButton innerRef={drag} />}
				</div>
			)}

		</div>
	);
};
