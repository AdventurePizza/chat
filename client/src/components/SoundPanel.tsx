import { PlayArrowRounded, PublishRounded } from '@material-ui/icons';
import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import ahhhIcon from '../assets/funny/ahhh.png';
import airIcon from '../assets/funny/air.png';
import applauseIcon from '../assets/funny/applause.png';
// Nature
import beeIcon from '../assets/nature/bee.png';
import clangIcon from '../assets/funny/clang.png';
// Instruments
import cymballIcon from '../assets/instruments/cymbalIcon.svg';
import dogIcon from '../assets/nature/dog.png';
import drumIcon from '../assets/instruments/drum.svg';
import flying_foxIcon from '../assets/nature/flying_fox.png';
import gongIcon from '../assets/instruments/gong.png';
// Funny
import gotemIcon from '../assets/funny/gottem.png';
import groanIcon from '../assets/funny/groan.png';
import guitarIcon from '../assets/instruments/guitarIcon.svg';
import harpIcon from '../assets/instruments/harp.png';
import hornIcon from '../assets/funny/horn.png';
import laughIcon from '../assets/funny/laugh.png';
import lightningIcon from '../assets/nature/lightning.png';
import natureIcon from '../assets/nature/nature.png';
import noiceIcon from '../assets/funny/noice.png';
import sealionIcon from '../assets/nature/sealion.png';
import stop_itIcon from '../assets/funny/stop_it.png';
import trumpet from '../assets/instruments/trumpet.png';
import waterIcon from '../assets/nature/water.png';

export interface ISoundPairs {
	icon: string;
	type: string;
	category: string;
}

const soundList: ISoundPairs[] = [
	// Instruments
	{ icon: drumIcon, type: 'drum', category: 'Instruments' },
	{ icon: cymballIcon, type: 'cymbal', category: 'Instruments' },
	{ icon: guitarIcon, type: 'guitar', category: 'Instruments' },
	{ icon: trumpet, type: 'trumpet', category: 'Instruments' },
	{ icon: gongIcon, type: 'gong', category: 'Instruments' },
	{ icon: harpIcon, type: 'harp', category: 'Instruments' },
	// Funny
	{ icon: gotemIcon, type: 'meme', category: 'Funny' },
	{ icon: stop_itIcon, type: 'stop_it', category: 'Funny' },
	{ icon: noiceIcon, type: 'noice', category: 'Funny' },
	{ icon: ahhhIcon, type: 'ahh', category: 'Funny' },
	{ icon: airIcon, type: 'air', category: 'Funny' },
	{ icon: applauseIcon, type: 'applause', category: 'Funny' },
	{ icon: clangIcon, type: 'clang', category: 'Funny' },
	{ icon: groanIcon, type: 'groan', category: 'Funny' },
	{ icon: hornIcon, type: 'horn', category: 'Funny' },
	{ icon: laughIcon, type: 'laugh', category: 'Funny' },
	// Nature
	{ icon: beeIcon, type: 'bee', category: 'Nature' },
	{ icon: dogIcon, type: 'dog', category: 'Nature' },
	{ icon: flying_foxIcon, type: 'flying_fox', category: 'Nature' },
	{ icon: lightningIcon, type: 'lightning', category: 'Nature' },
	{ icon: natureIcon, type: 'nature', category: 'Nature' },
	{ icon: sealionIcon, type: 'sealion', category: 'Nature' },
	{ icon: waterIcon, type: 'water', category: 'Nature' }
];

interface ISoundIconProps {
	type: string;
	sendSound: (soundText: string, soundType: string) => void;
}

enum SoundCategories {
	'Instruments' = 'Instruments',
	'Funny' = 'Funny',
	'Nature' = 'Nature'
}

interface ISoundPanelProps {
	sendSound: (soundText: string, soundType: string) => void;
}

interface ICategoryProps {
	category: SoundCategories;
	activeCategory: SoundCategories;
	toggleCategory: (category: SoundCategories) => void;
}

function SoundPanel({ sendSound }: ISoundPanelProps) {
	// we only need to track activeCategory
	const [activeCategory, setActiveCategory] = useState<SoundCategories>(
		SoundCategories.Instruments
	);

	const toggleCategory = (category: SoundCategories) => {
		setActiveCategory(category);
	};

	const DisplayCategories = Object.values(SoundCategories).map((category) => {
		return (
			<div key={category} className="sound-category">
				<Category
					category={category}
					toggleCategory={toggleCategory}
					activeCategory={activeCategory}
				/>
			</div>
		);
	});

	const DisplayIcons = soundList.map(({ icon, type, category }) => {
		const iconsCategoryIsActive = category === activeCategory;
		return (
			iconsCategoryIsActive && (
				<SoundIcon sendSound={sendSound} key={icon} type={type} />
			)
		);
	});

	return (
		<div className="sound-container">
			<div className="sound-category-list">{DisplayCategories}</div>
			<div className="sound-icon-list">{DisplayIcons}</div>
		</div>
	);
}

const SoundIcon = ({ type, sendSound }: ISoundIconProps) => {
	const [isHovering, setIsHovering] = useState(false);

	const displayHoverIcon = () => (
		<div className="display-hover-icon">
			<span>{type}</span>
			<div className="hover-icon-container">
				<IconButton
					onClick={() => sendSound('previewSound', type)}
					style={{
						backgroundColor: 'transparent',
						padding: 0,
						margin: 0,
						color: 'black'
					}}
					size="small"
				>
					<PlayArrowRounded />
				</IconButton>
				<IconButton
					onClick={() => sendSound('sound', type)}
					style={{
						backgroundColor: 'transparent',
						padding: 0,
						margin: 0,
						color: 'black'
					}}
					size="small"
				>
					<PublishRounded />
				</IconButton>
			</div>
		</div>
	);
	const displayIcon = () => <p>{type}</p>;
	const iconToDisplay = isHovering ? displayHoverIcon : displayIcon;
	return (
		<div
			className="sound-icon"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onTouchStart={() => setIsHovering(true)}
		>
			{iconToDisplay()}
		</div>
	);
};

const Category = ({
	category,
	activeCategory,
	toggleCategory
}: ICategoryProps) => {
	const idSelectorToUse =
		category === activeCategory
			? 'sound-active-category'
			: 'sound-unactive-category';

	return (
		<div className="category">
			<button id={idSelectorToUse} onClick={() => toggleCategory(category)}>
				{category}
			</button>
		</div>
	);
};

export default SoundPanel;
