import { Cancel, ControlPoint } from '@material-ui/icons';
import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import { InputButton } from './shared/InputButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	container: {
		width: 'fit-content',
		maxWidth: window.innerWidth * 0.8,
		borderRadius: 20,
		borderWidth: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 100,
		flexDirection: 'column',
		'& > *': {
			fontFamily: 'Blinker'
		},
		backgroundColor: 'whitesmoke',
		border: '5px solid #87D3F3',
		position: 'relative'
	},
	title: {
		fontSize: 50,
		fontWeight: 600,
		marginBottom: 20
	},
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
		// maxWidth: '80%',
		borderRadius: 50
	},
	input: {
		marginLeft: 10,
		flex: 1,
		fontFamily: 'Didact Gothic',
		fontSize: 25
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	},
	createButton: {
		backgroundColor: '#87D3F3',
		color: 'white',
		'&:hover': {
			backgroundColor: '#b0e2f6',
			color: 'white'
		},
		borderRadius: 30
	},
	cancelButton: {
		position: 'absolute',
		right: 10,
		top: 10
	},
	previewText: {
		marginTop: 10,
		fontSize: 25,
		fontFamily: 'Didact Gothic',
		color: '#8b8b8b'
	},
	plusIcon: {
		fontSize: 35
	},
	panelButtonContainer: {
		// marginTop: 40,
		height: 55,
		paddingBottom: 5
	},
	panelButtonText: {
		fontSize: 20
	},
	errorText: {
		fontSize: 18,
		marginTop: 10,
		color: 'red'
	},
	successMsg: {
		fontSize: 18,
		marginTop: 10,
		color: 'lightgreen'
	}
});

export interface INewChatroomCreateResponse {
	name?: string;
	message: string;
}

interface INewChatroomProps {
	onClickCancel: () => void;
	onCreate: (roomName: string) => Promise<INewChatroomCreateResponse>;
}

export const NewChatroom = ({ onClickCancel, onCreate }: INewChatroomProps) => {
	const classes = useStyles();

	const [inputValue, setInputValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState<
		INewChatroomCreateResponse | undefined
	>();

	const onClickCreate = async (inputValue: string) => {
		const { name, message } = await onCreate(inputValue);
		if (message === 'success') {
			setErrorMsg('');
			setSuccessMsg({ name, message });
		} else {
			setSuccessMsg(undefined);
			setErrorMsg(message);
		}
	};

	return (
		<div className={classes.container}>
			<IconButton onClick={onClickCancel} className={classes.cancelButton}>
				<Cancel />
			</IconButton>
			<div className={classes.title}>New Chatroom</div>

			<InputButton
				onClick={onClickCreate}
				buttonText="Create!"
				updateValue={setInputValue}
				placeholder="enter name"
			/>

			<div className={classes.previewText}>
				www.trychats.com/#/room/{inputValue}
			</div>

			{errorMsg && <div className={classes.errorText}> {errorMsg} </div>}
			{successMsg && (
				<div className={classes.successMsg}>
					Success! Created your room, check it out at{' '}
					<a href={`http://www.trychats.com/#/room/${successMsg.name}`}>
						www.trychats.com/#/room/{successMsg.name}
					</a>
				</div>
			)}
		</div>
	);
};

export const NewRoomPanelButton = () => {
	const classes = useStyles();
	return (
		<div className={classes.panelButtonContainer}>
			<ControlPoint className={classes.plusIcon} />
			<div className={classes.panelButtonText}>Room</div>
		</div>
	);
};
