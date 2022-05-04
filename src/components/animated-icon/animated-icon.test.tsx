import { Box, SvgIcon } from "@mui/material";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { forwardRef } from "react";
import { AnimatedIcon } from './animated-icon';
import * as animations from './animated-icon.animations';

const Icon = (forwardRef<HTMLElement>((props, ref) => (
  <Box ref={ref} {...props}>icon</Box>
))) as unknown as typeof SvgIcon;

describe('AnimatedIcon', () => {
  let shakeAnimationSpy: jest.SpyInstance;
  let scaleAnimationSpy: jest.SpyInstance;

  beforeAll(() => {
    shakeAnimationSpy = jest.spyOn(animations, 'shakeAnimation');
    scaleAnimationSpy = jest.spyOn(animations, 'scaleAnimation');
    
    shakeAnimationSpy.mockImplementation((_, onDone: () => void) => {
      onDone();
      return () => {};
    });

    scaleAnimationSpy.mockImplementation((_, onDone: () => void) => {
      onDone();
      return () => {};
    });
  });

  beforeEach(() => {
    shakeAnimationSpy.mockClear();
    scaleAnimationSpy.mockClear();
  });

  afterAll(() => {
    shakeAnimationSpy.mockRestore();
    scaleAnimationSpy.mockRestore();
  })

  it('should render icon', () => {
    render(<AnimatedIcon Icon={Icon} />);
    expect(screen.getByText('icon')).toBeInTheDocument();
  });

  it(`should set the icon's font-size to the size property`, () => {
    render(<AnimatedIcon Icon={Icon} size={50} />);
    expect(screen.getByText('icon')).toHaveStyle(`font-size: 50px`);
  });

  it(`should play the scale animation when the icon is clicked`, () => {
    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.click(icon);

    expect(scaleAnimationSpy).toBeCalledTimes(1);
  });

  it(`should play the scale animation once when the icon is clicked a couple of times`, () => {
    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.click(icon);
    fireEvent.click(icon);
    fireEvent.click(icon);
    
    expect(scaleAnimationSpy).toBeCalledTimes(1);
  });

  it(`should play the shake animation when the icon is hovered`, () => {
    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.mouseEnter(icon);
    fireEvent.mouseLeave(icon);

    expect(shakeAnimationSpy).toBeCalledTimes(1);
  });

  it(`should play the shake animation once when the icon is hovered a couple of times`, () => {
    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.mouseEnter(icon);
    fireEvent.mouseLeave(icon);
    
    fireEvent.mouseEnter(icon);
    fireEvent.mouseLeave(icon);
    
    fireEvent.mouseEnter(icon);
    fireEvent.mouseLeave(icon);
    
    expect(shakeAnimationSpy).toBeCalledTimes(1);
  });

  it(`should call the onClick callback when the icon is clicked`, () => {
    const onClick = jest.fn();
    render(<AnimatedIcon Icon={Icon} onClick={onClick} />);
    const icon = screen.getByText('icon');
    
    fireEvent.click(icon);

    expect(onClick).toBeCalledTimes(1);
  });

  it(`should call the onMouseEnter callback when the icon is hovered`, () => {
    const onMouseEnter = jest.fn();
    render(<AnimatedIcon Icon={Icon} onMouseEnter={onMouseEnter} />);
    const icon = screen.getByText('icon');
    
    fireEvent.mouseEnter(icon);

    expect(onMouseEnter).toBeCalledTimes(1);
  });

  it(`should kill animations if the component is unmounted`, () => {
    const kill = jest.fn()

    shakeAnimationSpy.mockImplementation((_, onDone: () => void) => {
      const timeout = setTimeout(() => onDone(), 1000);
      return () => { kill(); clearTimeout(timeout) };
    });

    scaleAnimationSpy.mockImplementation((_, onDone: () => void) => {
      const timeout = setTimeout(() => onDone(), 1000);
      return () => { kill(); clearTimeout(timeout) };
    });

    const { unmount } = render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.mouseEnter(icon);
    fireEvent.click(icon);

    unmount();
    
    expect(kill).toBeCalledTimes(2);
  });

  it(`should play the animation twice if the icon is clicked second time and the first animation was finished`, async () => {
    const done = jest.fn();

    scaleAnimationSpy.mockImplementation((_, onDone: () => void) => {
      const timeout = setTimeout(() => {
        onDone(); 
        done();
      }, 1);

      return () => { clearTimeout(timeout) };
    });

    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.click(icon);
    await waitFor(() => expect(done).toBeCalledTimes(1));

    fireEvent.click(icon);

    expect(scaleAnimationSpy).toBeCalledTimes(2);
  });

  it(`should play the animation twice if the icon is hovered second time and the first animation was finished`, async () => {
    const done = jest.fn();

    shakeAnimationSpy.mockImplementation((_, onDone: () => void) => {
      const timeout = setTimeout(() => {
        onDone(); 
        done();
      }, 1);

      return () => { clearTimeout(timeout) };
    });

    render(<AnimatedIcon Icon={Icon} />);
    const icon = screen.getByText('icon');
    
    fireEvent.mouseEnter(icon);
    await waitFor(() => expect(done).toBeCalledTimes(1));

    fireEvent.mouseEnter(icon);

    expect(shakeAnimationSpy).toBeCalledTimes(2);
  });
});