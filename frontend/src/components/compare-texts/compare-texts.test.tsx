import { render, screen } from "@testing-library/react";
import { CompareTexts } from "./compare-texts";

describe(`Compare Texts`, () => {
  it(`should color correct parts of text to the white color`, () => {
    const text = `Test abc`;
    const goal = `Test abc`;
    
    render(<CompareTexts text={text} goal={goal} />);

    expect(screen.queryByText(`T`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`e`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`s`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`t`)).toHaveStyle(`color: white`);

    expect(screen.queryByText(`a`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`b`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`c`)).toHaveStyle(`color: white`);
  })

  it(`should replace the incorrect parts of the text with correct ones using the black color`, () => {
    const text = `Test cba`;
    const goal = `Test abc`;
    
    render(<CompareTexts text={text} goal={goal} />);

    expect(screen.queryByText(`T`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`e`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`s`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`t`)).toHaveStyle(`color: white`);

    expect(screen.queryByText(`a`)).toHaveStyle(`color: black`);
    expect(screen.queryByText(`b`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`c`)).toHaveStyle(`color: black`);

  });

  it(`should mark the missing parts of the text using the black color and underline`, () => {
    const text = `Test`;
    const goal = `Test abc`;
    
    render(<CompareTexts text={text} goal={goal} />);

    expect(screen.queryByText(`T`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`e`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`s`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`t`)).toHaveStyle(`color: white`);

    expect(screen.queryByText(`a`)).toHaveStyle(`color: black; text-decoration: underline;`);
    expect(screen.queryByText(`b`)).toHaveStyle(`color: black; text-decoration: underline;`);
    expect(screen.queryByText(`c`)).toHaveStyle(`color: black; text-decoration: underline;`);
  });

  it(`should mark the unnecessary parts of the text using the black color and strike`, () => {
    const text = `Test abc`;
    const goal = `Test`;
    
    render(<CompareTexts text={text} goal={goal} />);

    expect(screen.queryByText(`T`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`e`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`s`)).toHaveStyle(`color: white`);
    expect(screen.queryByText(`t`)).toHaveStyle(`color: white`);

    expect(screen.queryByText(`a`)).toHaveStyle(`color: black; text-decoration: line-through;`);
    expect(screen.queryByText(`b`)).toHaveStyle(`color: black; text-decoration: line-through;`);
    expect(screen.queryByText(`c`)).toHaveStyle(`color: black; text-decoration: line-through;`);
  });
});