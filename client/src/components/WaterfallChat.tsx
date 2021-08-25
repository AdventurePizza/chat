import React, { useEffect, useRef } from 'react'
import { IWaterfallMessage, newPanelTypes } from '../types';
import { Box, Avatar } from '@material-ui/core';
import { avatarMap } from './UserCursors';

interface IWaterfallChatProps {
	chat: IWaterfallMessage[];
	setActivePanel: (panel: newPanelTypes) => void;
}

export const WaterfallChat = ({ chat, setActivePanel }: IWaterfallChatProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollToBottom = () => {
		if(messagesEndRef && messagesEndRef.current){
	    	messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	}

	useEffect(scrollToBottom, [chat]);

	let boxColors: Array<string> = ['primary.main', 'secondary.main', 'success.main', 'text.primary'];

	return (
			<div onClick={(e) => { 
				setActivePanel('chat');
				e.stopPropagation();
			}}> 
<				Box color="primary.main" mb={1} style={{width:320, fontSize: 20, textAlign: 'center' }}> CHAT </Box>
				<div style={{overflowY: 'scroll', maxHeight: 300}}>
				{
					chat.map((ch, index) =>
						<div key={index.toString()} style={{ width: 300, clear: 'left'}}>
							{
								<Box color={boxColors[ch.avatar.charCodeAt(ch.avatar.length -1) % 4]}  mt={2} mb={2} style={{fontSize: 16 }}>
									<Avatar alt= {ch.avatar} src= {!ch.avatar.startsWith("https") ? avatarMap[ch.avatar] : ch.avatar} style={{ float: 'left' }} /> {ch.name + ": "} {ch.message}
								</Box>
							}
						</div>
					)
				}
				<div ref={messagesEndRef} />
				</div>
			</div>
	);
};
