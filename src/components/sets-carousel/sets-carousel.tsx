import { useResize } from '../../utils/use-resize/use-resize';
import { SuperMemoPhase } from "../../super-memo/super-memo.types";
import { SetCard } from '../set-card/set-card';
import { useState } from 'react';
import { splitArray } from '../../utils/split-array/split-array';
import { Content, Item } from './sets-carousel.styles';
import { Carousel } from '../carousel/carousel';

export type CarouselItem = {
  id: string;
  title: string;
  progress?: { [key in SuperMemoPhase]: number };
  words?: {
    id: string,
    word: string,
    meaning: string,
  }[];
}

type Props = {
  sets: CarouselItem[],
  onClick?: (item: CarouselItem) => void,
}

export const SetsCarousel = ({ sets, onClick }: Props) => {
  const itemsInContent = (container: number) => {
    const itemWidth = 250;
    return Math.max(1, Math.floor(0.9 * container / itemWidth))
  }

  const [items, setItems] = useState(1);
  useResize((screenWidth) => setItems(itemsInContent(screenWidth)), true);

  const handleClick = (set: CarouselItem) => {
    if (onClick) {
      return () => onClick(set);
    }
  }

  return (
    <Carousel height='180px' swipe>
      {splitArray(sets, items).map((chunk, index) => (
        <Content key={index} {...{ "data-testid": 'sets-carousel-content'}}>
          {chunk.map(({ title, words, progress, id }) => (
            <Item key={id}>
              <SetCard 
                title={title}
                small
                progress={progress} 
                data={words}
                onClick={handleClick({ title, words, progress, id })}
              />
            </Item>
          ))}
        </Content>
      ))}
    </Carousel>
  );
}