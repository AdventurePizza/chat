import React, { useRef, useState } from 'react';

import { PinButton } from './shared/PinButton';
import { StyledButton } from './shared/StyledButton';
import { TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import WhiteboardPanel from './WhiteboardPanel';
import AnimationPanel from './AnimationPanel';
import animationIcon from '../assets/buttons/animation.png'
import pencilIcon from '../assets/buttons/pencil.png'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		background: 'var(--background)',
		width: '100%',
		'& > *': {
			marginRight: 10
		}
		
	},
	input: {
		borderRadius: 20,
		background: 'white'
	}
});

interface IChatProps {
	pinMessage: (message: string) => void;
	sendMessage: (message: string) => void;
	updateIsTyping: (isTyping: boolean) => void;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	setBrushColor: (color: string) => void;
	sendAnimation: (animationText: string, animationType: string) => void;
	pinTweet: (id: string) => void; 
	showChat: () => void;
}

export const Chat = ({
	sendMessage,
	updateIsTyping,
	pinMessage,
	showWhiteboard,
	updateShowWhiteboard,
	setBrushColor,
	sendAnimation,
	pinTweet,
	showChat
}: IChatProps) => {
	const classes = useStyles();

	const [chatValue, setChatValue] = useState('');
	const textfieldRef = useRef<HTMLDivElement>(null);
	const [showAnimations, setShowAnimations] = useState<boolean>(false);

	const onChangeChat = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatValue(event.target.value);

		if (!!event.target.value !== !!chatValue) {
			updateIsTyping(!!event.target.value);
		}
	};

	const onKeyPressChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			onButtonClickChat();
		}
	};

	const onButtonClickChat = () => {
		sendMessage(chatValue);
		clearMessage();
	};

	const onPinMessage = () => {
		if(chatValue.startsWith('https://twitter.com/')){
			pinTweet(chatValue.split("/")[5]);
		}
		else{
			pinMessage(chatValue);
			clearMessage();
		}
	};

	const clearMessage = () => {
		setChatValue('');
		updateIsTyping(false);
	};

	const onFocus = () => {
		if (window.innerWidth < 500 && textfieldRef.current) {
			const offsetTop = textfieldRef.current.offsetTop;
			document.body.scrollTop = offsetTop;
		}
	};

	return (
		<div className={classes.container}>
			<div className={classes.container}>
				<TextField
					autoFocus={window.innerWidth > 500}
					ref={textfieldRef}
					placeholder="type your message here"
					variant="outlined"
					value={chatValue}
					onChange={onChangeChat}
					onKeyPress={onKeyPressChat}
					className={classes.input}
					onFocus={onFocus}
				/>
				<StyledButton onClick={onButtonClickChat}>send</StyledButton>
				<PinButton onPin={onPinMessage} isPinned={false} onUnpin={() => {}} />
				<StyledButton onClick={showChat}>show chat</StyledButton>

				<IconButton onClick={() => { setShowAnimations(!showAnimations)}}>
					<img src={animationIcon} alt="animation" width= "25" height= "25"/>
				</IconButton>
				<IconButton onClick={() => { updateShowWhiteboard(!showWhiteboard)}}>
					<img src={pencilIcon} alt="pencil" width= "25" height= "25"/>
				</IconButton>

				{showWhiteboard &&
					<WhiteboardPanel setBrushColor={setBrushColor} />
				}
				{showAnimations &&
					<AnimationPanel sendAnimation={sendAnimation} />
				}
			</div>

		</div>
	);
};
