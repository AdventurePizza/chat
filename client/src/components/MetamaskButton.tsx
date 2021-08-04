import { Button, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import imgMetamask from '../assets/metamask-fox.svg';
import { AuthContext } from '../contexts/AuthProvider';

const useStyles = makeStyles((theme) => ({
	img: {
		width: 50
	},
	metamaskButtonRoot: {
		display: 'flex',
		// '&:first-child': {
		// 	marginRight: 10
		// },
		width: 200
	}
}));

interface IMetamaskButtonProps {
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactChild
}

export const MetamaskButton = ({ style, className, children }: IMetamaskButtonProps) => {
	const classes = useStyles();
	const { signIn } = useContext(AuthContext);

	return (
		<Button
			style={style}
			variant="contained"
			color="primary"
			onClick={signIn}
			className={`${classes.metamaskButtonRoot} ${className || ''}`}
		>
			{children ? children : (
				<>
					<div>connect</div>
					<img className={classes.img} src={imgMetamask} alt="metamask fox" />
				</>
			)}
		</Button>
	);
};
