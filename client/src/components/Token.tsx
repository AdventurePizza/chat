import React from 'react';
// planning to visualise tokens in future so it is separate component
interface ITokenProps {
	contractAddress: string;
}

export const Token = ({ contractAddress }: ITokenProps) => {

	return (
		<div>{ contractAddress}</div>
	);
};
