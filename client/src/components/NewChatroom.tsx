import { Cancel, ControlPoint } from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import { InputButton } from './shared/InputButton';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Tooltip } from '@material-ui/core';
import { AuthContext } from '../contexts/AuthProvider';
import { MetamaskButton } from './MetamaskButton';
import { IFetchResponseBase } from '../types';
import { Token } from './Token';

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
		position: 'relative',
		'&:focus': {
			outline: 'none',
			boxShadow: 'none'
		}
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
	},
	loginContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& > button': {
			marginTop: 10
		}
	}
});

export interface INewChatroomCreateResponse {
	name?: string;
	message: string;
}

interface INewChatroomProps {
	onClickCancel: () => void;
	onCreate: (
		roomName: string,
		isLocked: boolean,
		contractAddress?: string
	) => Promise<IFetchResponseBase>;
}

export const NewChatroom = ({ onClickCancel, onCreate }: INewChatroomProps) => {
	const classes = useStyles();
	const { isLoggedIn } = useContext(AuthContext);
	// const isLoggedIn = false;

	const [isAccessLocked, setIsAccessLocked] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [hasAttemptedLock, setHasAttemptedLock] = useState(false);
	const [successMsg, setSuccessMsg] = useState<
		INewChatroomCreateResponse | undefined
	>();
	const [visitorAllowed, setVisitorAllowed] = useState(false);
	const [contractAddress, setContractAddress] = useState('');
	const [contractAddressInput, setContractAddressInput] = useState('');

	useEffect(() => {
		if (isAccessLocked && !isLoggedIn) {
			setHasAttemptedLock(true);
			setTimeout(() => {
				setIsAccessLocked(false);
			}, 1000);
		} else if (isLoggedIn) {
			setHasAttemptedLock(false);
		}
	}, [isLoggedIn, isAccessLocked]);

	const onClickCreate = async (inputValue: string) => {
		if (isAccessLocked && !isLoggedIn)
			return alert('Cannot create locked room without connecting to metamask');

		const { message } = await onCreate(inputValue, isAccessLocked, contractAddress);

		if (message === 'success') {
			setErrorMsg('');
			setSuccessMsg({ name: inputValue, message });

		} else {
			setSuccessMsg(undefined);
			if (message) {
				setErrorMsg(message);
			}
		}
	};

	const onClickRestrict = async (contractAddress: string) => {
		if (!contractAddress){
			setErrorMsg('Please enter the contract address of the token/NFT');
		}
		else{
			setContractAddress(contractAddressInput);
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

			<div>
				<span>edit access: </span>
				<span>open</span>
				<Tooltip title="Prevent others from editing your room">
					<span>
						<Switch
							// disabled={!isLoggedIn}
							checked={isAccessLocked}
							onClick={() => setIsAccessLocked(!isAccessLocked)}
						/>
					</span>
				</Tooltip>
				<span>locked</span>
			</div>

			<div>
				<span>Restrict visitors: </span>
				<span>allow</span>
				<Tooltip title="Restrict visitors">
					<span>
						<Switch
							checked={visitorAllowed}
							onClick={() => setVisitorAllowed(!visitorAllowed)}
						/>
					</span>
				</Tooltip>
				<span>restrict</span>
			</div>

			{hasAttemptedLock && (
				<div
					className={classes.loginContainer}
					// style={
					// 	hasAttemptedLock
					// 		? { visibility: 'visible' }
					// 		: { visibility: 'hidden' }
					// }
				>
					<div>connect with metamask to restrict edit access</div>
					<MetamaskButton />
				</div>
			)}

			{visitorAllowed &&
				<div>
					<InputButton
						onClick={onClickRestrict}
						buttonText="Allow Owners"
						updateValue={setContractAddressInput}
						placeholder="contract address"
					/>

					<Token
						contractAddress={contractAddress}
					/>

				</div>
			}

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

interface INewRoomPanelButton {
	isRow?: boolean;
}

export const NewRoomPanelButton = ({ isRow }: INewRoomPanelButton) => {
	const classes = useStyles();
	return (
		<div
			className={classes.panelButtonContainer}
			style={
				isRow
					? {
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 5
					  }
					: undefined
			}
		>
			<ControlPoint
				className={classes.plusIcon}
				style={
					isRow
						? {
								fontSize: 25
						  }
						: undefined
				}
			/>
			<div
				style={
					isRow
						? {
								fontSize: 15
						  }
						: undefined
				}
				className={classes.panelButtonText}
			>
				room
			</div>
		</div>
	);
};
