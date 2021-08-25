import {
	Button,
	Checkbox,
	TextField,
	Tooltip,
	makeStyles
} from '@material-ui/core';

import React, { useEffect, useState } from 'react';

export interface IPipe {
	toAddress: string;
	sharePerc: number;
}

const useStyles = makeStyles((theme) => ({
	appRoot: {
		display: 'flex',
		flexDirection: 'column'
	},
	orderRoot: {
		border: '1px solid #ccc',
		display: 'flex',
		flexDirection: 'column',
		width: '100%'
	},
	titleListings: {
		textDecoration: 'underline',
		fontSize: '1.2rem',
		width: '100%',
		textAlign: 'center'
	},
	inputOrderRoot: {
		display: 'flex',
		flexDirection: 'column',
		
	},
	button: {
		width: 150
	},
	buttonConnect: {
		width: 'fit-content'
	},
	buttonContainer: {
		width: 'fit-content'
	},
	owner: {
		border: '1px solid lightblue',
		background: 'lightgreen',
		padding: 5,
		width: 'fit-content',
		height: 'fit-content'
	},
	sameLine: {
		display: 'flex',
		alignItems: 'center',
		'& > *': {
			marginRight: 10
		}
	},
	spaceVert: {
		marginTop: 20,
		marginBottom: 20
	},
	profile: {
		padding: 20,
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end'
	},
	profileInner: {
		width: 200,
		padding: 20
	},
	title: {
		fontSize: '2rem',
		paddingLeft: 20
	},
	partneredContainer: {
		display: 'flex',
		flexDirection: 'column'
		// "& > *:first-child": {
		//   marginRight: 10,
		// },
	},
	partneredSharePerc: {
		width: 200
	},
	textfieldPartnerAddress: {
		width: 400
	},
	pipeContainer: {
		display: 'flex',
		flexDirection: 'column',
		'& > *': {
			marginBottom: 10
		},
		border: '1px solid #ccc',
		width: 'fit-content',
		padding: 20,
		marginBottom: 10
	},
	titlePipes: {
		margin: '20px 0',
		fontSize: '1.5rem'
	},
	error: {
		color: 'red'
	},
	modalContainer: {
		width: 400,
		height: 400,
		// padding: 50,
		background: 'white',
		display: 'flex',
		// justifyContent: "center",
		alignItems: 'center',
		flexDirection: 'column'
	},
	modalBody: {
		height: '100%',
		display: 'flex',
		// justifyContent: "center",
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		marginBottom: 50
	},
	modalRoot: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		height: 50
	}
}));

export interface ISubmit {
	nftAddress: string;
	tokenId: number;
	priceEth: string;
	isPartnered: boolean;
	isPiped: boolean;
	partnerSharePerc: number;
	pipes: IPipe[];
}

interface IInputOrderProps {
	onSubmit: (values: ISubmit) => void;
	disabledMessage?: string;
}

export const OrderInput = ({ onSubmit, disabledMessage }: IInputOrderProps) => {
	const [valueAddress, setValueAddress] = useState('');
	const [valueTokenId, setValueTokenId] = useState('');
	const [valuePriceEth, setValuePriceEth] = useState('');
	const [isCheckedPartnered, setIsCheckedPartnered] = useState(false);

	const [isCheckedPiped, setIsCheckedPiped] = useState(false);

	const [valuePartnerPerc, setValuePartnerPerc] = useState(0);
	const [valuePipes, setValuePipes] = useState<IPipe[]>([]);

	const classes = useStyles();

	return (
		<div className={classes.inputOrderRoot}>
			<TextField
				label="enter NFT address"
				placeholder="0x..."
				value={valueAddress}
				onChange={(e) => setValueAddress(e.target.value)}
			/>

			<TextField
				label="enter token id"
				value={valueTokenId}
				onChange={(e) => setValueTokenId(e.target.value)}
			/>

			<TextField
				label="enter price to list in eth"
				value={valuePriceEth}
				onChange={(e) => setValuePriceEth(e.target.value)}
			/>

			<span>
				<Tooltip title="split profit with one of the partners">
					<span>
						<span>partnered</span>
						<Checkbox
							checked={isCheckedPartnered}
							onChange={() => setIsCheckedPartnered(!isCheckedPartnered)}
						/>
					</span>
				</Tooltip>
				<Tooltip title="split profits with others">
					<span>
						<span>piped</span>
						<Checkbox
							checked={isCheckedPiped}
							onChange={() => setIsCheckedPiped(!isCheckedPiped)}
						/>
					</span>
				</Tooltip>
			</span>

			{isCheckedPartnered && (
				<Partnered
					onChangeSharePerc={(sharePerc) => setValuePartnerPerc(sharePerc)}
				/>
			)}

			{isCheckedPiped && <Pipes onChangePipes={setValuePipes} />}

			<Tooltip title={disabledMessage ?? ''} placement="top">
				<span style={{ width: 'fit-content' }}>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						disabled={!!disabledMessage}
						onClick={() =>
							onSubmit({
								nftAddress: valueAddress,
								tokenId: parseInt(valueTokenId),
								priceEth: valuePriceEth,
								isPartnered: isCheckedPartnered,
								isPiped: isCheckedPiped,
								partnerSharePerc: valuePartnerPerc,
								pipes: valuePipes
							})
						}
					>
						add order
					</Button>
				</span>
			</Tooltip>
		</div>
	);
};

interface IPartneredProps {
	onChangeSharePerc: (sharePerc: number) => void;
}

export const Partnered = ({ onChangeSharePerc }: IPartneredProps) => {
	//   const [valueAddress, setValueAddress] = useState("");
	const [valueSharePerc, setValueSharePerc] = useState('');

	const classes = useStyles();

	return (
		<div className={classes.partneredContainer}>
			{/* <TextField
        label="partner address"
        placeholder="0x..."
        className={classes.textfieldPartnerAddress}
        value={valueAddress}
        onChange={(e) => {
          setValueAddress(e.target.value);
          onChangeAddress(e.target.value);
        }}
      /> */}
			<TextField
				type="number"
				label="partner share percent"
				placeholder="1-99"
				InputProps={{ inputProps: { min: 1, max: 99 } }}
				className={classes.partneredSharePerc}
				value={valueSharePerc}
				onChange={(e) => {
					setValueSharePerc(e.target.value);
					onChangeSharePerc(parseInt(e.target.value));
				}}
			/>
		</div>
	);
};

interface IPipesProps {
	onChangePipes: (pipes: IPipe[]) => void;
}

export const Pipes = ({ onChangePipes }: IPipesProps) => {
	const [pipes, setPipes] = useState<IPipe[]>([]);

	useEffect(() => {
		onChangePipes(pipes);
	}, [pipes, onChangePipes]);

	const classes = useStyles();

	const onDeletePipe = (index: number) => {
		setPipes([...pipes.slice(0, index), ...pipes.slice(index + 1)]);
	};

	const onChangeAddress = (address: string, index: number) => {
		setPipes([
			...pipes.slice(0, index),
			{ ...pipes[index], toAddress: address },
			...pipes.slice(index + 1)
		]);
	};

	const onChangeSharePerc = (sharePerc: number, index: number) => {
		setPipes([
			...pipes.slice(0, index),
			{ ...pipes[index], sharePerc },
			...pipes.slice(index + 1)
		]);
	};

	const addPipe = () => {
		setPipes((pipes) => pipes.concat({ toAddress: '', sharePerc: 0 }));
	};

	return (
		<div>
			<Button
				className={`${classes.spaceVert} ${classes.button}`}
				disabled={pipes.length >= 10}
				onClick={addPipe}
			>
				add pipe
			</Button>
			{pipes.length > 0 && <div className={classes.titlePipes}>Pipes</div>}
			{pipes.map((pipe, idx) => (
				<Pipe
					key={idx}
					{...pipe}
					onDelete={() => onDeletePipe(idx)}
					onChangeAddress={(address) => onChangeAddress(address, idx)}
					onChangeSharePerc={(sharePerc) => onChangeSharePerc(sharePerc, idx)}
				/>
			))}
		</div>
	);
};

interface IPipeProps extends IPipe {
	onDelete: () => void;
	onChangeAddress: (address: string) => void;
	onChangeSharePerc: (sharePerc: number) => void;
}

export const Pipe = ({
	toAddress,
	sharePerc,
	onDelete,
	onChangeAddress,
	onChangeSharePerc
}: IPipeProps) => {
	const classes = useStyles();

	return (
		<div className={classes.pipeContainer}>
			<TextField
				label="pipe to address"
				placeholder="0x..."
				className={classes.textfieldPartnerAddress}
				value={toAddress}
				onChange={(e) => onChangeAddress(e.target.value)}
			/>
			<TextField
				type="number"
				label="pipe share percent"
				placeholder="1-99"
				InputProps={{ inputProps: { min: 1, max: 99 } }}
				className={classes.partneredSharePerc}
				value={sharePerc}
				onChange={(e) => onChangeSharePerc(parseInt(e.target.value))}
			/>

			<Button
				className={`${classes.spaceVert} ${classes.button}`}
				onClick={onDelete}
			>
				delete pipe
			</Button>
		</div>
	);
};
