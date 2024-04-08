import { MockTimeline, mockTimeline } from "../mocks/gsap-timeline-mock";
import { animation } from "./animation";

describe('Animation', () => {
  let tl: MockTimeline

  beforeAll(() => {
    tl = mockTimeline();
  });

  beforeEach(() => {
    tl.mockClear();
  });

  afterAll(() => {
    tl.mockRestore();
  });

  it('should return an animation function', () => {
    const result = animation(() => {});
    expect(result).toBeInstanceOf(Function);
  });

  it(`should generate an animation with argument`, () => {
    const result = animation<boolean, HTMLElement | null>((tl, item, args) => {
      tl
        .set(item, { rotationX: args ? 100 : 200 })
    });

    const div = document.createElement('div');

    result(div, true, () => {});
    expect(div).toHaveStyle(`transform: rotateX(100deg)`);

    result(div, false, () => {});
    expect(div).toHaveStyle(`transform: rotateX(200deg)`);
  });

  it(`should generate an animation without argument`, () => {
    const result = animation((tl, item) => {
      tl
        .set(item, { rotationX: 200 })
    });

    const div = document.createElement('div');

    result(div, () => {});
    expect(div).toHaveStyle(`transform: rotateX(200deg)`);
  });

  describe(`animation function`, () => {
    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const result = animation(() => {})(null, onDone);
  
      result();
  
      expect(onDone).toHaveBeenCalled();
    });
  
    it(`should generate an correct animation`, () => {
      const onDone = jest.fn();
      const div = document.createElement('div');
  
      const runAnimation = animation((tl, item: HTMLDivElement | null) => {
        tl.to(item, { scale: 0.75, duration: 0.125 });
        tl.to(item, { scale: 1.25, duration: 0.25 });
        tl.to(item, { scale: 1.5, duration: 0.25 });
      });
  
      runAnimation(div, onDone);
  
      expect(div).toHaveStyle("transform: scale(1.5)");
      expect(onDone).toBeCalled();
    });

    it(`should return an cleanup function`, () => {
      const result = animation(() => {})(null, () => {});
    
      expect(result).toBeInstanceOf(Function);
    });
  });
});