import { render, screen } from "@testing-library/react"
import { Masonry } from "./masonry"

describe(`Masonry`, () => {
  it(`should display items`, () => {
    render(<Masonry>
      <div key="1">Item 1</div>
      <div key="2">Item 2</div>
      <div key="3">Item 3</div>
    </Masonry>);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it(`should set all .Masonry__Column elements width to the itemWidth parameter`, () => {
    render(
      <Masonry itemWidth={500}>
        <div key="1">Item 1</div>
        <div key="2">Item 2</div>
        <div key="3">Item 3</div>
      </Masonry>
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.Masonry__Column')).toHaveStyle(`max-width: 500px`);
  });
});