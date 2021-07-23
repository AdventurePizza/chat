import React from 'react';
// planning to visualise tokens in future so it is separate component
interface IRenderTokenProps {
	contractAddress: string;
}

export const RenderToken = ({ contractAddress }: IRenderTokenProps) => {

	return (
		<div>{ contractAddress}</div>
	);
};
