import React, { useRef, useState } from 'react';
import { PinButton } from './shared/PinButton';
import { TextField } from '@material-ui/core';

interface ITwitterProps {
	pinTweet: (id: string) => void; 
	updateIsTyping: (isTyping: boolean) => void;
}

export const Twitter = ({
	updateIsTyping,
	pinTweet
}: ITwitterProps) => {
	const [chatValue, setChatValue] = useState('');
	const textfieldRef = useRef<HTMLDivElement>(null);

	const onChangeChat = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatValue(event.target.value);

		if (event.target.value !== chatValue) {
			updateIsTyping(!!event.target.value);
		}
	};


	const onPinTweet = () => {
		pinTweet(chatValue.split("/")[5]);
		clearMessage();
	};

	const clearMessage = () => {
		setChatValue('');
		updateIsTyping(false);
	};


	return (
		<div
		>
			<TextField
				autoFocus={window.innerWidth > 500}
				ref={textfieldRef}
				placeholder="paste your tweet link here"
				variant="outlined"
				value={chatValue}
				onChange={onChangeChat}	
			/>
			<PinButton onPin={onPinTweet} isPinned={false} onUnpin={() => { }} />
		</div>
	);
};

export default Twitter;


