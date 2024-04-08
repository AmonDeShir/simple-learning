import { MockTimeline, mockTimeline } from "../../utils/mocks/gsap-timeline-mock";
import { hideAnimation, showAnimation } from "./user-menu.animations";

describe('UserMenu animations', () => {
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

  describe('hideAnimation', () => {
    it('should return a cleanup function', () => {
      const result = hideAnimation({ left: null, right: null, avatar: null }, () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const left = document.createElement('div');
      const right = document.createElement('div');
      const avatar = document.createElement('div');

      const result = hideAnimation({ left, right, avatar }, onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });

  describe('showAnimation', () => {
    it('should return a cleanup function', () => {
      const result = showAnimation({ left: null, right: null, avatar: null }, () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const left = document.createElement('div');
      const right = document.createElement('div');
      const avatar = document.createElement('div');

      const result = hideAnimation({ left, right, avatar }, onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });
});