import { render, screen } from "@testing-library/react";
import { TextWithBrackets } from "./text-with-brackets";
import * as useRect from "../../utils/use-rect/use-rect";


describe(`TextWithBrackets`, () => {
  let useRectSpy: jest.SpyInstance;

  beforeAll(() => {
    useRectSpy = jest.spyOn(useRect, `useRect`);
  });

  beforeEach(() => {
    useRectSpy.mockClear();
  });
  
  afterAll(() => {
    useRectSpy.mockRestore();
  });

  it(`should render children contained in the brackets`,() => {
    useRectSpy.mockReturnValue({ height: 10 });
    render(<TextWithBrackets>Text</TextWithBrackets>)

    expect(screen.getAllByTitle('bracket')[0]).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getAllByTitle('bracket')[1]).toBeInTheDocument();
  })

  it(`should set the brackets' size to the scaled text's size`,() => {
    useRectSpy.mockReturnValue({ height: 10 });
    render(<TextWithBrackets bracketsScale={1.2}>Text</TextWithBrackets>)

    expect(screen.getAllByRole('img')[0]).toHaveStyle('height: 12px');
    expect(screen.getAllByRole('img')[1]).toHaveStyle('height: 12px');
  });
});