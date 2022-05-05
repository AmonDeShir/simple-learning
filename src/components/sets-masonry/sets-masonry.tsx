import { SuperMemoPhase } from '../../super-memo/super-memo.types';
import { Masonry } from '../masonry/masonry';
import { SetCard } from "../set-card/set-card"

export type MasonryItem = {
  id: string,
  title: string;
  progress?: { [key in SuperMemoPhase]: number };
  words?: {
    id: string,
    word: string,
    meaning: string,
  }[];
}

type Props<Item extends MasonryItem> = {
  sets: Item[],
  icons?: (item: Item) => JSX.Element[],
  onClick?: (item: Item) => void,
}

export function SetsMasonry<Item extends MasonryItem>({ sets, icons, onClick }: Props<Item>) {
  const handleClick = (set: Item) => {
    if(onClick) {
      return () => onClick(set);
    }
  }

  return (
    <Masonry itemWidth={450}>
      {
        sets.map((set) => (
          <SetCard 
            key={set.id}
            title={set.title}
            progress={set.progress} 
            data={set.words}
            icons={icons ? icons(set) : []}
            onClick={handleClick(set)}
          />
        ))
      }
    </Masonry>
  )
}