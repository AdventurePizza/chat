import React, { useState } from 'react';
import { ISoundCategories, ICategory, ISoundPairs } from './BottomPanel';
import { v4 as uuidv4 } from 'uuid';

// Instruments
import cymballIcon from '../assets/instruments/cymbalIcon.svg';
import drumIcon from '../assets/instruments/drum.svg';
import trumpet from '../assets/instruments/trumpet.png';
import guitarIcon from '../assets/instruments/guitarIcon.svg';
import gongIcon from '../assets/instruments/gong.png';
import harpIcon from '../assets/instruments/harp.png';
// Funny
import gotemIcon from '../assets/funny/gottem.png';
import noiceIcon from '../assets/funny/noice.png';
import stop_itIcon from '../assets/funny/stop_it.png';
import ahhhIcon from '../assets/funny/ahhh.png';
import airIcon from '../assets/funny/air.png';
import applauseIcon from '../assets/funny/applause.png';
import clangIcon from '../assets/funny/clang.png';
import groanIcon from '../assets/funny/groan.png';
import hornIcon from '../assets/funny/horn.png';
import laughIcon from '../assets/funny/laugh.png';
// Nature
import beeIcon from '../assets/nature/bee.png';
import dogIcon from '../assets/nature/dog.png';
import flying_foxIcon from '../assets/nature/flying_fox.png';
import lightningIcon from '../assets/nature/lightning.png';
import natureIcon from '../assets/nature/nature.png';
import sealionIcon from '../assets/nature/sealion.png';
import waterIcon from '../assets/nature/water.png';

const soundCategories: ISoundCategories[] = [
	{ category: 'Instruments', isActive: true, id: uuidv4() },
	{ category: 'Funny', isActive: false, id: uuidv4() },
	{ category: 'Nature', isActive: false, id: uuidv4() }
];

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
	{ icon: ahhhIcon, type: 'ahhh', category: 'Funny' },
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

interface ISoundPanelProps {
	sendSound: (soundText: string, soundType: string) => void;
}

function SoundPanel({ sendSound }: ISoundPanelProps) {
	const [activeCategories, setActiveCategories] = useState(soundCategories);

	const toggleCategory = (id: string) => {
		const newActiveCategories = activeCategories.map(
			(category: ISoundCategories) => {
				if (category.id === id) return { ...category, isActive: true };
				else return { ...category, isActive: false };
			}
		);
		setActiveCategories(newActiveCategories);
	};

	const Category = ({ category, isActive, id }: ICategory) => {
		const classToUse = isActive
			? 'sound-active-category'
			: 'sound-unactive-category';

		return (
			<div className={classToUse}>
				<button onClick={() => toggleCategory(id)}>{category}</button>
			</div>
		);
	};

	const DisplayCategories = activeCategories.map(
		({ category, isActive, id }) => {
			return (
				<div key={id} className="sound-category">
					<Category category={category} isActive={isActive} id={id} />
				</div>
			);
		}
	);

	const DisplayIcons = soundList.map(({ icon, type, category }) => {
		const activeCategory = activeCategories.find(
			({ isActive }) => isActive === true
		)?.category;
		const iconsCategoryIsActive = category === activeCategory;

		return (
			iconsCategoryIsActive && (
				<div key={icon} className="sound-icon">
					<button onClick={() => sendSound('sound', type)}>
						<img src={icon} alt="sound" />
					</button>
				</div>
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

export default SoundPanel;
