import React, { useEffect, useRef } from 'react'
import { IWaterfallMessage, PanelItemEnum, newPanelTypes } from '../types';
import { Box, Avatar, Button } from '@material-ui/core';
import { avatarMap } from './UserCursors';

interface IWaterfallChatProps {
	chat: IWaterfallMessage[];
	updateSelectedPanelItem: (panelItem: PanelItemEnum | undefined) => void;
	setActivePanel: (panel: newPanelTypes) => void;
}

export const WaterfallChat = ({ chat, updateSelectedPanelItem, setActivePanel }: IWaterfallChatProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollToBottom = () => {
		if(messagesEndRef && messagesEndRef.current){
	    	messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	}

	useEffect(scrollToBottom, [chat]);

	let boxColors: Array<string> = ['primary.main', 'secondary.main', 'success.main', 'text.primary'];

	return (
			<div>
				<Button 
					style={{ maxWidth: 300, maxHeight: 40 , minWidth: 300, minHeight: 40, fontSize: 20 }} 
					size="medium" color="primary" onClick={() => { 
						updateSelectedPanelItem(PanelItemEnum.background as PanelItemEnum );
						setActivePanel('chat');
					}} > CHAT
				</Button>
				<div style={{overflowY: 'scroll', maxHeight: 300}}>
				{
					chat.map((ch, index) =>
						<div key={index.toString()} style={{ width: 300, clear: 'left'}}>
							{
								<Box color={boxColors[ch.avatar.charCodeAt(ch.avatar.length -1) % 4]}  mt={5} style={{fontSize: 16 }}>
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
