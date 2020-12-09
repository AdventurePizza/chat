import { IUserLocations, IUserProfiles } from '../types';

import React from 'react';
import ghost from '../assets/red_ghost.gif';
import kirby from '../assets/kirby.gif';
import link from '../assets/link-run.gif';
import mario from '../assets/mario.gif';
import nyancat from '../assets/nyancat_big.gif';
import yoshi from '../assets/yoshi.gif';

const avatarMap: { [key: string]: string } = {
	mario: mario,
	kirby: kirby,
	link: link,
	nyancat: nyancat,
	ghost: ghost,
	yoshi: yoshi
};

interface IUserCursorsProps {
	userLocations: IUserLocations;
	userProfiles: IUserProfiles;
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

				return (
					<div
						style={{ transform: `translate(${x}px, ${y}px)` }}
						className="user-connection-cursor"
						key={key}
					>
						<img src={avatarMap[avatar]} alt="avatar" />
						<div>{name}</div>
					</div>
				);
			})}
		</>
	);
};
