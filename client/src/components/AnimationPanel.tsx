import React from 'react';
import schoolPrideIcon from '../assets/animations/school-pride.png';
import fireworksIcon from '../assets/animations/fireworks.png';
import confettiIcon from '../assets/animations/confetti.png';
import snowIcon from '../assets/animations/snow.png';

import { ITextAnimation } from '../types';

interface IAnimationPanelProps {
	sendAnimation: (animationText: string, animationType: string) => void;
}

const animationIcons: ITextAnimation = {
	schoolPride: schoolPrideIcon,
	fireworks: fireworksIcon,
	confetti: confettiIcon,
	snow: snowIcon
};

const AnimationPanel = ({ sendAnimation }: IAnimationPanelProps) => {
	const displayIcons = Object.keys(animationIcons).map((animationsKey) => {
		const animationIcon = animationIcons[animationsKey];
		return (
			<div key={animationsKey} className="animation-icon">
				<button onClick={() => sendAnimation('animation', animationsKey)}>
					<img src={animationIcon} alt="animation"/>
				</button>
			</div>
		);
	});

	return (
		<div>
			<div className="animation-icon-list">{displayIcons}</div>
		</div>
	);
};

export default AnimationPanel;
