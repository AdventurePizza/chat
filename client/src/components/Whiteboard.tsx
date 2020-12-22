import React, { useRef, useEffect, useState, MouseEvent } from 'react';

export interface ILineData {
	prevX: number;
	prevY: number;
	currentX: number;
	currentY: number;
	color: string;
}

export interface IWhiteboardProps {
	onWhiteboardPanel: boolean;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	brushColor: string;
	onAction: (key: string, ...args: any[]) => void;
}

export function Whiteboard({
	onWhiteboardPanel,
	canvasRef,
	brushColor,
	onAction
}: IWhiteboardProps) {
	const [isDrawing, setIsDrawing] = useState(false);
	const position = useRef({ x: 0, y: 0 });

	useEffect(() => {
		let canv = canvasRef.current!;
		canv.width = window.innerWidth;
		canv.height = window.innerHeight;

		let canvCtx = canv.getContext('2d');
		canvCtx!.lineCap = 'round';
	}, [canvasRef]);

	function handleMouseMove(e: MouseEvent) {
		if (!onWhiteboardPanel) return;
		let mouseX = e.clientX;
		let mouseY = e.clientY;
		const { x, y } = position.current;
		if (isDrawing) {
			drawLine(canvasRef, x, y, mouseX, mouseY, brushColor, false);
			const lineData: ILineData = {
				prevX: x,
				prevY: y,
				currentX: mouseX,
				currentY: mouseY,
				color: brushColor
			};
			const strlineData = JSON.stringify(lineData);
			onAction('whiteboard', strlineData);
		}

		position.current = { x: mouseX, y: mouseY };
	}

	function handleMouseDown(e: MouseEvent) {
		if (!onWhiteboardPanel) return;
		setIsDrawing(true);
		position.current = {
			x: e.clientX,
			y: e.clientY
		};
	}

	function handleMouseUp() {
		if (!onWhiteboardPanel) return;
		setIsDrawing(false);
	}

	return (
		<canvas
			ref={canvasRef}
			style={onWhiteboardPanel ? canvasStyles : {}}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
		/>
	);
}

const canvasStyles = {
	cursor: 'crosshair',
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 'transparent'
};

export function drawLine(
	canvasRef: React.RefObject<HTMLCanvasElement>,
	prevX: number,
	prevY: number,
	currentX: number,
	currentY: number,
	color: string,
	transparent: boolean = false
) {
	let canv = canvasRef.current!;
	let canvCtx = canv.getContext('2d')!;

	if (transparent) {
		canvCtx!.globalCompositeOperation = 'destination-out';
		canvCtx!.lineWidth = 5;
	} else {
		canvCtx!.globalCompositeOperation = 'source-over';
		canvCtx!.lineWidth = 3;
	}
	canvCtx.beginPath();
	canvCtx.moveTo(prevX, prevY);
	canvCtx.lineTo(currentX, currentY);
	canvCtx.strokeStyle = color;
	canvCtx.stroke();
	canvCtx.closePath();

	if (!transparent) {
		setTimeout(() => {
			drawLine(canvasRef, prevX, prevY, currentX, currentY, color, true);
		}, 9000);
	}
}
