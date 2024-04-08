import { fireEvent, render, screen } from "@testing-library/react";
import { MasonryItem, SetsMasonry } from "./sets-masonry";

const items: MasonryItem[] = [
  {
    id: "1",
    title: "item 1",
  },
  {
    id: "2",
    title: "item 2",
  },
  {
    id: "3",
    title: "item 3",
  }
]

describe('SetsMasonry', () => {
  it(`should render items`, () => {
    render(<SetsMasonry sets={items} />);

    expect(screen.getByText('item 1')).toBeInTheDocument();
    expect(screen.getByText('item 2')).toBeInTheDocument();
    expect(screen.getByText('item 3')).toBeInTheDocument();
  });

  it(`should call IconGenerator for all items`, () => {
    const icons = jest.fn();
    render(<SetsMasonry sets={items} icons={icons} />);

    expect(icons).toHaveBeenCalledTimes(3);
    expect(icons).toHaveBeenNthCalledWith(1, items[0]);
    expect(icons).toHaveBeenNthCalledWith(2, items[1]);
    expect(icons).toHaveBeenNthCalledWith(3, items[2]);
  })

  it(`should call the component's onClick function if one of the items is clicked`, () => {
    const onClick = jest.fn();
    render(<SetsMasonry sets={items} onClick={onClick} />);

    fireEvent.click(screen.getByText('item 1'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(items[0]);
  });
});