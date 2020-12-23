import {
	IAvatarChatMessages,
	ITowerBuilding,
	IUserLocations,
	IUserProfiles
} from '../types';
import React, { useEffect, useRef, useState } from 'react';

import { CSSTransition } from 'react-transition-group';
import { Tower } from './TowerDefense';
import character1 from '../assets/character1.png';
import character2 from '../assets/character2.png';
import character3 from '../assets/character3.png';
import character4 from '../assets/character4.png';
import character5 from '../assets/character5.png';
import character6 from '../assets/character6.png';
import character7 from '../assets/character7.png';
import ghost from '../assets/red_ghost.gif';
import kirby from '../assets/kirby.gif';
import link from '../assets/link-run.gif';
import mario from '../assets/mario.gif';
import nyancat from '../assets/nyancat_big.gif';
import yoshi from '../assets/yoshi.gif';

export const avatarMap: { [key: string]: string } = {
	mario: mario,
	kirby: kirby,
	link: link,
	nyancat: nyancat,
	ghost: ghost,
	yoshi: yoshi,
	character1,
	character2,
	character3,
	character4,
	character5,
	character6,
	character7
};

interface IUserCursorsProps {
	userLocations: IUserLocations;
	userProfiles: IUserProfiles;
	isSelectingTower?: ITowerBuilding;
	avatarChatMessages: IAvatarChatMessages;
}

export const UserCursors = (props: IUserCursorsProps) => {
	return (
		<>
			{Object.entries(props.userLocations).map(([key, value]) => {
				const { x, y } = value;

				if (!props.userProfiles[key]) {
					return null;
				}
				const { avatar, name } = props.userProfiles[key];
				const messages = props.avatarChatMessages[key];
				let chatMessage;
				if (Array.isArray(messages)) {
					chatMessage = messages[messages.length - 1];
				}

				return (
					<UserCursor
						avatar={avatar}
						name={name}
						x={x}
						y={y}
						message={chatMessage}
					/>
				);
			})}
		</>
	);
};

interface IUserCursorProps {
	avatar: string;
	name: string;
	x?: number;
	y?: number;
	isSelectingTower?: ITowerBuilding;
	message?: string;
}

export const UserCursor = React.forwardRef(
	(
		{ avatar, name, x, y, isSelectingTower, message }: IUserCursorProps,
		ref: React.Ref<HTMLDivElement>
	) => {
		const [inProp, setInProp] = useState(false);
		const timerRef = useRef<NodeJS.Timeout>();

		useEffect(() => {
			if (message) {
				setInProp((prop) => !prop);

				if (timerRef.current) {
					clearTimeout(timerRef.current);
				}

				timerRef.current = setTimeout(() => {
					setInProp(true);
				}, 200);
			}
		}, [message]);

		return (
			<div
				style={{ transform: `translate(${x}px, ${y}px)` }}
				className="user-connection-cursor"
				ref={ref}
			>
				{isSelectingTower ? (
					<Tower
						top={y || 0}
						left={x || 0}
						key={isSelectingTower.key}
						type="basic"
						cost={5}
					/>
				) : (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column'
						}}
					>
						<img src={avatarMap[avatar]} alt="avatar" />
						<div style={{ textDecoration: 'bold', fontSize: '1.2em' }}>
							{name}
						</div>
						<CSSTransition
							timeout={1000}
							classNames="avatar-message-transition"
							key={message}
							in={inProp}
						>
							<div className="avatar-message">{message}</div>
						</CSSTransition>
					</div>
				)}
			</div>
		);
	}
);
