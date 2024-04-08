import { MockTimeline, mockTimeline } from "../../utils/mocks/gsap-timeline-mock";
import { flipAnimation } from "./flipping-card.animations";

describe('Flip Animation', () => {
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

  it('should return a cleanup function', () => {
    const result = flipAnimation(null, false, () => {});
    expect(result).toBeInstanceOf(Function);
  });

  it('should return a function that calls onDone when animation is finished', () => {
    const onDone = jest.fn();
    const div = document.createElement('div');

    const result = flipAnimation(div, true, onDone);
    result();

    expect(onDone).toHaveBeenCalled();
  });
});