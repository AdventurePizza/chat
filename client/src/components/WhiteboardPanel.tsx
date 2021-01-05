import { IconButton } from '@material-ui/core';
import React from 'react';

const colors = [
	'yellow',
	'orange',
	'red',
	'pink',
	'violet',
	'blue',
	'green',
	'gray'
];

interface IWhiteboardPanelProps {
	setBrushColor: (color: string) => void;
}

function WhiteboardPanel({ setBrushColor }: IWhiteboardPanelProps) {
	const displayColorIcons = colors.map((color) => {
		return (
			<IconButton
				style={{
					backgroundColor: color,
					width: '51px',
					height: '51px',
					marginRight: '27px',
					borderRadius: 4
				}}
				key={color}
				onClick={() => setBrushColor(color)}
			></IconButton>
		);
	});

	return <div style={{ padding: 10 }}>{displayColorIcons}</div>;
}

export default WhiteboardPanel;
