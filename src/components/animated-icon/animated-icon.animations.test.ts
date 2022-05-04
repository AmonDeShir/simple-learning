import { scaleAnimation, shakeAnimation } from "./animated-icon.animations";
import { MockTimeline, mockTimeline } from "../../utils/mocks/gsap-timeline-mock";

describe('AnimatedIcon animations', () => {
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

  describe('shakeAnimation', () => {
    it('should return a cleanup function', () => {
      const result = shakeAnimation(null, () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const div = document.createElement('div');

      const result = shakeAnimation(div, onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });

  describe('scaleAnimation', () => {
    it('should return a cleanup function', () => {
      const result = scaleAnimation(null, () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const div = document.createElement('div');

      const result = scaleAnimation(div, onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });
});