import { InputButton } from './shared/InputButton';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../contexts/AuthProvider';
import axios from "axios";

const useStyles = makeStyles({
	container: {
		'& > *:not(:last-child)': {
			marginRight: 10
		},
		display: 'flex',
		alignItems: 'center',
		overflowX: 'auto',
		background: 'var(--background)',
		width: '100%',
		justifyContent: 'center',
		height: 100
	}
});

interface ISettingsPanelProps {
	onChangeName: (username: string) => void;
	onSubmitUrl: (url: string) => void;
}

interface IWalletItem {
	contract_name? : string,
	balance? : string,
	contract_decimals? : number
}

export const SettingsPanel = ({
	onChangeName,
	onSubmitUrl
}: ISettingsPanelProps) => {
	const classes = useStyles();
	let walletItems: IWalletItem[] = [];
	const [items, setItems] = useState(walletItems);

	const { isLoggedIn, accountId } = useContext(AuthContext);

	useEffect(() => {
		onClick();
		if(isLoggedIn) {
			axios.get(`https://api.covalenthq.com/v1/137/address/${accountId}/balances_v2/?nft=true&key=ckey_33c257415ca047ff9c04fdc29c3`)
			.then(res => setItems(res.data.data.items))
			/* console.log("accountId: ", accountId); */
		}
	}, []);

	const onClick = () => {
		console.log("is user logged in: ", isLoggedIn);
		if(isLoggedIn) {
			axios.get(`https://api.covalenthq.com/v1/137/address/${accountId}/balances_v2/?nft=true&key=ckey_33c257415ca047ff9c04fdc29c3`)
			.then(res => console.log(res.data))
			/* console.log("accountId: ", accountId); */
		}
	}

	return (
		<div className={classes.container}>
			<InputButton
				buttonText="go!"
				placeholder="enter name"
				onClick={onChangeName}
				inputWidth={300}
			/>
			<InputButton
				buttonText="go!"
				placeholder="enter music url"
				onClick={onSubmitUrl}
				inputWidth={300}
			/>
			<div style={{color: "white", fontSize: "12px"}}>
				<p>Wallet Balance:</p>
				{items.map((item, index) => <p key={index}>{item.contract_name}: {typeof item.contract_decimals === "number" && Number(item.balance)/(Math.pow(10, item.contract_decimals))}</p>)}
			</div>
			{/* <button onClick={onClick}>accountId</button> */}
		</div>
	);
};
