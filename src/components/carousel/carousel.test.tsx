import { render, screen } from "@testing-library/react"
import { Carousel } from "./carousel"

describe(`Carousel`, () => {
  it(`should render carousel's children`, () => {
    render(<Carousel>{[
      <div key="0">Item 1</div>, 
      <div key="1">Item 2</div>
    ]}</Carousel>);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it(`should set the carousel's height to the height parameter`, () => {
    render(<Carousel height="100px">{[<div key="0">Item 1</div>]}</Carousel>);

    expect(screen.getByTestId('carousel')).toHaveStyle({ height: '100px' });
  });
})