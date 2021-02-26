import React, { useRef, useState } from 'react';

import { PinButton } from './shared/PinButton';
import { StyledButton } from './shared/StyledButton';
import { makeStyles } from '@material-ui/core/styles';

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
}

export const Poem = ({
	sendMessage,
	updateIsTyping,
	pinMessage
}: IChatProps) => {
	const classes = useStyles();

	const [chatValue, setChatValue] = useState('');
	const textfieldRef = useRef<HTMLTextAreaElement>(null);

	const onChangeChat = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setChatValue(event.target.value);

		if (!!event.target.value !== !!chatValue) {
			updateIsTyping(!!event.target.value);
		}
	};

	const onKeyPressChat = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Allow for multiple lines of text to accumulate in input field
		//jk seems like this whole area below isn't necessary
		if (event.key === 'Enter') {
			//sendMessage(chatValue);
			setChatValue(chatValue);
			//updateIsTyping(false);
		}
	};

	const onButtonClickChat = () => {
		sendMessage(chatValue);
		clearMessage();
	};

	const onPinMessage = () => {
		pinMessage(chatValue);
		clearMessage();
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
			<textarea
				autoFocus={window.innerWidth > 500}
				ref={textfieldRef}
				placeholder="type your message here"
				//variant="outlined"
				value={chatValue}
				onChange={onChangeChat}
				onKeyPress={onKeyPressChat}
				className={classes.input}
				onFocus={onFocus}
			/>
			<StyledButton onClick={onButtonClickChat}>send</StyledButton>
			<PinButton onPin={onPinMessage} isPinned={false} onUnpin={() => {}} />
		</div>
	);
};
