import React, {
	MouseEvent,
	TouchEvent,
	useEffect,
	useRef,
	useState
} from 'react';

import { getRelativePos } from '../App';

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
		if (isDrawing) {
			const { x, y } = position.current;
			const { x: relPrevX, y: relPrevY } = getRelativePos(x, y, 0, 0);
			const { x: relCurrentX, y: relCurrentY } = getRelativePos(
				mouseX,
				mouseY,
				0,
				0
			);

			drawLine(false, canvasRef, x, y, mouseX, mouseY, brushColor, false);
			const lineData: ILineData = {
				prevX: relPrevX,
				prevY: relPrevY,
				currentX: relCurrentX,
				currentY: relCurrentY,
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

	function handleTouchMove(e: TouchEvent) {
		if (!onWhiteboardPanel) return;
		let mouseX = e.touches[0].clientX;
		let mouseY = e.touches[0].clientY;
		if (isDrawing) {
			const { x, y } = position.current;
			const { x: relPrevX, y: relPrevY } = getRelativePos(x, y, 0, 0);
			const { x: relCurrentX, y: relCurrentY } = getRelativePos(
				mouseX,
				mouseY,
				0,
				0
			);

			drawLine(false, canvasRef, x, y, mouseX, mouseY, brushColor, false);
			const lineData: ILineData = {
				prevX: relPrevX,
				prevY: relPrevY,
				currentX: relCurrentX,
				currentY: relCurrentY,
				color: brushColor
			};
			const strlineData = JSON.stringify(lineData);
			onAction('whiteboard', strlineData);
		}
		position.current = { x: mouseX, y: mouseY };
	}

	function handleMouseUp() {
		if (!onWhiteboardPanel) return;
		setIsDrawing(false);
	}

	function handleTouchStart(e: TouchEvent) {
		if (!onWhiteboardPanel) return;
		setIsDrawing(true);
		position.current = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		};
	}

	function handleTouchEnd() {
		if (!onWhiteboardPanel) return;
		setIsDrawing(false);
	}

	return (
		<canvas
			ref={canvasRef}
			style={onWhiteboardPanel ? canvasStyles : canvasStylesUnselected}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchStart={handleTouchStart}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
		/>
	);
}

const canvasStyles: React.CSSProperties = {
	cursor: 'crosshair',
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 'transparent',
	position: 'absolute',
	top: 0,
	right: 0
};

const canvasStylesUnselected: React.CSSProperties = {
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 'transparent',
	position: 'absolute',
	top: 0,
	right: 0,
	pointerEvents: 'none'
};

export function drawLine(
	relativePoints: boolean,
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
	if (relativePoints) {
		const relPrevX = prevX * window.innerWidth;
		const relPrevY = prevY * window.innerHeight;
		const relCurrentX = currentX * window.innerWidth;
		const relCurrentY = currentY * window.innerHeight;

		canvCtx.moveTo(relPrevX, relPrevY);
		canvCtx.lineTo(relCurrentX, relCurrentY);
	} else {
		canvCtx.moveTo(prevX, prevY);
		canvCtx.lineTo(currentX, currentY);
	}
	canvCtx.strokeStyle = color;
	canvCtx.stroke();
	canvCtx.closePath();

	if (!transparent) {
		setTimeout(() => {
			drawLine(
				relativePoints,
				canvasRef,
				prevX,
				prevY,
				currentX,
				currentY,
				color,
				true
			);
		}, 30000);
	}
}
