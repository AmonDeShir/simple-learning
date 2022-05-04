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

type Props = {
  sets: MasonryItem[],
  icons?: (item: MasonryItem) => JSX.Element[],
  onClick?: (item: MasonryItem) => void,
}

export const SetsMasonry = ({ sets, icons, onClick }: Props) => {
  const handleClick = (set: MasonryItem) => {
    if(onClick) {
      return () => onClick(set);
    }
  }

  return (
    <Masonry itemWidth={450}>
      {
        sets.map(({ title, words, progress, id }) => (
          <SetCard 
            key={id}
            title={title}
            progress={progress} 
            data={words}
            icons={icons ? icons({ title, words, progress, id }) : []}
            onClick={handleClick({ title, words, progress, id })}
          />
        ))
      }
    </Masonry>
  )
}