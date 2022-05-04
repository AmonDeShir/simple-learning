import { useEffect } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CarouselItem, SetsCarousel } from "./sets-carousel"
import * as useResize from "../../utils/use-resize/use-resize";
import { act } from "react-dom/test-utils";

const items: CarouselItem[] = [
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

const mockUseResize = (width: number) => {
  const events: ((value: number) => void)[] = [];
  
  return [
    (callback: any) => {

      useEffect(() => {
        callback(width);
        events.push(callback);

        return () => { 
          events.splice(events.indexOf(callback), 1);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);
    },
    (width: number) => {
      events.forEach(event => event(width));
    }
  ] as const;
};

describe('SetCarousel', () => {
  let useResizeSpy: jest.SpyInstance;

  beforeAll(() => {
    useResizeSpy = jest.spyOn(useResize, "useResize");
  });

  beforeEach(() => {
    useResizeSpy.mockClear();
  });
  
  afterAll(() => {
    useResizeSpy.mockRestore();
  });

  it(`should display items in the one container`, async () => {
    useResizeSpy.mockImplementation(mockUseResize(1000)[0]);

    render(<SetsCarousel sets={items} />);

    expect(screen.getAllByTestId('sets-carousel-content').length).toEqual(1);
    const container = screen.getAllByTestId('sets-carousel-content')[0];

    expect(container).toContainElement(screen.getByText('item 1'));
    expect(container).toContainElement(screen.getByText('item 2'));
    expect(container).toContainElement(screen.getByText('item 3'));
  })

  it(`should split items into containers`, () => {
    const [mock, resize] = mockUseResize(700);
    useResizeSpy.mockImplementation(mock);

    const { rerender } = render(<SetsCarousel sets={items} />);

    expect(screen.getAllByTestId('sets-carousel-content').length).toEqual(2);
    let containers = screen.getAllByTestId('sets-carousel-content');

    expect(containers[0]).toContainElement(screen.getByText('item 1'));
    expect(containers[0]).toContainElement(screen.getByText('item 2'));
    expect(containers[1]).toContainElement(screen.getByText('item 3'));


    act(() => resize(400));
    rerender(<SetsCarousel sets={items} />);

    expect(screen.getAllByTestId('sets-carousel-content').length).toEqual(3);
    containers = screen.getAllByTestId('sets-carousel-content');

    expect(containers[0]).toContainElement(screen.getByText('item 1'));
    expect(containers[1]).toContainElement(screen.getByText('item 2'));
    expect(containers[2]).toContainElement(screen.getByText('item 3'));
  });

  it(`should call the component's onClick function if one of the items is clicked`, () => {
    const onClick = jest.fn();
    render(<SetsCarousel sets={items} onClick={onClick} />);

    fireEvent.click(screen.getByText('item 1'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(items[0]);
  });
})