import { Drawer, IconButton } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from './Chat';
import { Gifs } from './Gifs';
import { IGif } from '@giphy/js-types';
import { PanelItemEnum } from '../types';
import React, { useState } from 'react';
import cymballIcon from '../assets/cymbalIcon.svg';
import drumIcon from '../assets/drum.svg';
import gotemIcon from '../assets/gottem.png';
import noiceIcon from '../assets/noice.png';
import stop_itIcon from '../assets/stop_it.png';
import trumpet from '../assets/trumpet.png';
import guitarIcon from '../assets/guitarIcon.svg';

interface IPanelProps {
	isOpen: boolean;
	type?: PanelItemEnum;
	onAction: (key: string, ...args: any[]) => void;
}

interface ISoundPairs {
	icon: string;
  type: string;
  category: string;
}

interface ISoundCategories {
  category: string;
  isActive: boolean;
  id: string
}
const emojiList: string[] = ['😍', '😎', '👏', '👀', '✨', '🎅'];

const soundList: ISoundPairs[] = [
	{ icon: drumIcon, type: 'drum', category: "Instruments" },
	{ icon: cymballIcon, type: 'cymbal', category: "Instruments" },
  { icon: guitarIcon, type: 'guitar', category: "Instruments" },
  { icon: trumpet, type: 'trumpet', category: "Instruments" },
  { icon: gotemIcon, type: 'meme', category: "Jokes" },
  { icon: noiceIcon, type: 'noice', category: "Jokes" },
  { icon: stop_itIcon, type: 'stopit', category: "Jokes" },
];

const soundCategories: ISoundCategories[] = [
  { category: "Instruments", isActive: true, id: uuidv4() },
  { category: "Jokes", isActive: false, id: uuidv4() }
];


export const BottomPanel = ({ isOpen, type, onAction }: IPanelProps) => {
	const RenderPanelContent = () => {

    const [activeCategories, setActiveCategories] = useState(soundCategories);

		switch (type) {
			case 'emoji':
				return (
					<>
						{emojiList.map((emoji) => (
							<div key={emoji} className="bottom-panel-emoji">
								<IconButton onClick={() => onAction('emoji', emoji)}>
									{emoji}
								</IconButton>
							</div>
						))}
					</>
				);

			case 'chat':
				return (
					<Chat
						sendMessage={(message) => {
							onAction('chat', message);
						}}
					/>
				);
			case 'sound':
				return (
					<>
						{soundList.map(({ icon, type }) => (
							<div key={icon} className="bottom-panel-sound">
								<IconButton onClick={() => onAction('sound', type)}>
									<img src={icon} alt="sound" />
								</IconButton>
							</div>
						))}
					</>
        );
      case 'sound-variant':

        interface ICategory { category: string; isActive: boolean; id: string; }

        const Category = ({ category, isActive, id }: ICategory) => {
          return <div className={isActive ? "sound-variant-active-category" : "sound-variant-unactive-category"}>
            <button onClick={() => toggleCategory(id)}>{category}</button>
          </div>
        }

        const toggleCategory = (id: string) => {
          let activeCategoriesCopy = JSON.parse(JSON.stringify(activeCategories));
          const newActiveCategories = activeCategoriesCopy.map((category: ISoundCategories) => {
            if (category.id === id)
              return { ...category, isActive: true }
            else
              return { ...category, isActive: false }
          })
          setActiveCategories(newActiveCategories);
        }

        const DisplayCategories = activeCategories.map(({ category, isActive, id }) => {
          return <div key={id} className="sound-variant-category">
            <Category category={category} isActive={isActive} id={id} />
          </div>
        })

        const DisplayIcons = soundList.map(({ icon, type, category }) => {
          const activeCategory = activeCategories.find(({ isActive }) => isActive === true)?.category;
          const iconsCategoryIsActive = category === activeCategory;

          return (iconsCategoryIsActive) && <div key={icon} className="sound-variant-icon">
            <button onClick={() => onAction('sound', type)}>
              <img src={icon} alt="sound" />
            </button>
          </div>
        })
        
				return <div className="sound-variant-container">
          <div className="sound-variant-icon-list">{DisplayCategories}</div>
          <div className="sound-variant-category-list">{DisplayIcons}</div>
         </div>
        
			case 'gifs':
				return (
					<Gifs
						sendGif={(gif: IGif) => {
							onAction('gif', gif.id);
						}}
					/>
				);
		}
	};

	return (
		<Drawer variant="persistent" anchor="bottom" open={isOpen}>
			<div className="bottom-panel-container">{RenderPanelContent()}</div>
		</Drawer>
	);
};
