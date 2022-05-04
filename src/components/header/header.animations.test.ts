import { mockTimeline, MockTimeline } from "../../utils/mocks/gsap-timeline-mock";
import { enterFullscreenMode, exitFullscreenMode } from "./header.animations";

describe('Header animations', () => {
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

  describe('enterFullscreenMode', () => {
    it('should return a cleanup function', () => {
      const result = enterFullscreenMode({ bar: null, icons: null }, () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const bar = document.createElement('div');
      const icons = document.createElement('div');

      const result = enterFullscreenMode({ bar, icons }, onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });

  describe('exitFullscreenMode', () => {
    it('should return a cleanup function', () => {
      const result = exitFullscreenMode({ bar: null, icons: null }, "0 0 0 0", () => {});
      expect(result).toBeInstanceOf(Function);
    });

    it('should return a function that calls onDone when animation is finished', () => {
      const onDone = jest.fn();
      const bar = document.createElement('div');
      const icons = document.createElement('div');

      const result = exitFullscreenMode({ bar, icons }, "0 0 0 0", onDone);
      result();

      expect(onDone).toHaveBeenCalled();
    });
  });
});