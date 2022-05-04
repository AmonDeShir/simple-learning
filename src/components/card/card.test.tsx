import { render, screen } from "@testing-library/react";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { theme } from "../../theme";
import { Card } from "./card";

describe('Card', () => {
  it(`should render the card's title`, () => {
    render(<Card title="Test title" />);

    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it(`should render the card's content`, () => {
    render(<Card title="">Content</Card>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it(`should set the card's margin to the margin property`, () => {
    render(<Card title="Test" margin="5rem" />);

    expect(screen.getByTestId("card")).toHaveStyle(`margin: 5rem;`);
  });  

  it(`should set the card's width to the width property`, () => {
    render(<Card title="Test" width="50%" />);

    expect(screen.getByTestId("card")).toHaveStyle(`width: 50%;`);
  });

  it(`should set the card's max-width value based on the size property value`, () => {
    render(
      <>
        <Card title="xs" size="xs" />
        <Card title="md" size="md" />
        <Card title="xl" size="xl" />
      </>
    );
    expect(screen.getAllByTestId("card")[0]).toHaveStyle(`max-width: 150px;`);
    expect(screen.getAllByTestId("card")[1]).toHaveStyle(`max-width: 500px;`);
    expect(screen.getAllByTestId("card")[2]).toHaveStyle(`max-width: 1500px;`);
  });

  it(`should render the card's icons`, () => {
    render(
      <Card title="Test" icons={[<div key="0">Icon 1</div>, <div key="1">Icon 2</div>]} />
    );

    expect(screen.getByText('Icon 1')).toBeInTheDocument();
    expect(screen.getByText('Icon 2')).toBeInTheDocument();
  });

  it(`should render the card's content with a inverted colors`, () => {
    const { wrapper } = TestingContainer();
    render(<Card title="Title" invert>Content</Card>, { wrapper });

    expect(screen.getByTestId("card-header")).toHaveStyle(`background-color: ${theme.palette.background.paper}`);
    expect(screen.getByText("Content")).toHaveStyle(`background-color: ${theme.palette.primary.main}`);
  });

  it(`should render the card's content with a border`, () => {
    const { wrapper } = TestingContainer();
    render(<Card title="Title" fullBorder>Content</Card>, { wrapper });

    expect(screen.getByText("Content")).toHaveStyle(`border: 3px solid ${theme.palette.primary.main}`);
  });
})