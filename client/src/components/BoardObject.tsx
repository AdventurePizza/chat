import { MoveButton, PinButton } from './shared/PinButton';
import React, { useState, useContext } from 'react';

import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDrag } from 'react-dnd';
import {
	IOrder,
	IWaterfallMessage,
	IHorse,
	IPlaylist,
	PanelItemEnum,
	newPanelTypes
} from '../types';
import { Order } from './NFT/Order';
import { CustomToken as NFT } from '../typechain/CustomToken';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Map } from './Maps';
import { Tweet } from 'react-twitter-widgets';
import { WaterfallChat } from './WaterfallChat';
import { MusicPlayer } from './MusicPlayer';
import ReactPlayer from 'react-player';
import { AppStateContext } from '../contexts/AppStateContext';
import { Horse } from './Horse';

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
	type:
		| 'horse'
		| 'gif'
		| 'image'
		| 'video'
		| 'text'
		| 'NFT'
		| 'map'
		| 'chat'
		| 'musicPlayer'
		| 'tweet';
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

	setActivePanel?: (panel: newPanelTypes) => void;
	updateSelectedPanelItem?: (panelItem: PanelItemEnum | undefined) => void;
	chat?: IWaterfallMessage[];
	horseData?: IHorse;
	playlist?: IPlaylist[];
}

export const BoardObject = (props: BoardObjectProps) => {
	const {
		top,
		left,
		data,
		onPin,
		onUnpin,
		isPinnedPlaying,
		isPinned,
		type,
		imgSrc,
		text,
		id,
		order,
		addNewContract,
		onBuy,
		onCancel,
		chat,
		horseData,
		playlist,
		updateSelectedPanelItem,
		setActivePanel
	} = props;

	const [isHovering, setIsHovering] = useState(false);
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

	const noLinkPrev = (
		<div className={classes.text} style={{ width: 180 }}>
			{text}
		</div>
	);

	const shouldShowMoveButton =
		isPinned || type === 'chat' || type === 'musicPlayer';

	return (
		<div
			style={{
				top,
				left,
				/* zIndex: isHovering ? 99999999 : 'auto' */
				zIndex: isHovering || type === 'chat' ? 99999999 : 99999997
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
						<div>
							{text && (
								<LinkPreview
									url={text!}
									fallback={noLinkPrev}
									descriptionLength={50}
									imageHeight={100}
									showLoader={false}
								/>
							)}
						</div>
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
				{type === 'tweet' && id && <Tweet tweetId={id} />}
				{type === 'video' && id && (
					<div
						className="pinned-video-player"
						style={{
							height: '225px',
							width: '400px'
						}}
					>
						<ReactPlayer
							width="100%"
							height="100%"
							url={`https://www.youtube.com/watch/${id}`}
							controls={true}
							playing={isPinnedPlaying}
							onPlay={() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: true
								});
							}}
							onPause={() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: false
								});
							}}
						/>
					</div>
				)}
				{type === 'horse' && horseData && <Horse horse={horseData} />}
				{type === 'chat' && chat && updateSelectedPanelItem && setActivePanel &&(
					<WaterfallChat
						updateSelectedPanelItem={updateSelectedPanelItem}
						setActivePanel={setActivePanel}
						chat={chat}
					/>
				)}
				{type === 'musicPlayer' && playlist && (
					<div style={{ width: 400 }}>
						<MusicPlayer playlist={playlist} />
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
					{type !== 'chat' && type !== 'musicPlayer' && (
						<PinButton isPinned={isPinned} onPin={onPin} onUnpin={onUnpin} />
					)}
					{/*@ts-ignore needs better typing for innerRef*/}
					{shouldShowMoveButton && <MoveButton innerRef={drag} />}
				</div>
			)}
		</div>
	);
};
