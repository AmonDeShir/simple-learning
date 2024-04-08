import { render, screen } from "@testing-library/react";
import { TextWithIcon } from "./text-with-icon";
import * as useRect from "../../utils/use-rect/use-rect";

describe('TextWithIcon', () => {
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

  it('should render children and an icon from the properties', () => {
    useRectSpy.mockReturnValue({ height: 12, width: 50 });
    render(<TextWithIcon icon={<>Icon</>}>Text</TextWithIcon>);
    
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
    
    expect(screen.getByText('Icon')).toHaveStyle(`bottom: 2px`);
    expect(screen.getByText('Icon')).toHaveStyle(`left: 40px`);
  });

  it(`should change icon position if text is multiline`, () => {
    useRectSpy.mockReturnValue({ height: 40, width: 50 });
    render(<TextWithIcon icon={<>Icon</>}>Text <br/> Text</TextWithIcon>);

    expect(screen.getByText('Icon')).toBeInTheDocument();

    expect(screen.getByText('Icon')).toHaveStyle(`bottom: 30px`);
    expect(screen.getByText('Icon')).toHaveStyle(`left: 32px`);
  });
});