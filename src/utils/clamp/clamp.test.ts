import { clamp } from './clamp';

describe('clamp', () => {
  it(`should return min if value is lesser than min`, () => {
    expect(clamp(-5, 10, 100)).toEqual(10);
  });

  it(`should return min if value is equal min`, () => {
    expect(clamp(10, 10, 100)).toEqual(10);
  });

  it(`should return max if value is greater than max`, () => {
    expect(clamp(110, 10, 100)).toEqual(100);
  });

  it(`should return max if value is equal max`, () => {
    expect(clamp(100, 10, 100)).toEqual(100);
  });

  it(`should return value if value is in range between max and min`, () => {
    expect(clamp(50, 10, 100)).toEqual(50);
  });

  it(`should return value if value, min and max are equal`, () => {
    expect(clamp(50, 50, 50)).toEqual(50);
  });

  it(`should return NaN if value or min or max is NaN`, () => {
    expect(clamp(NaN, 50, 50)).toEqual(NaN);
    expect(clamp(50, NaN, 50)).toEqual(NaN);
    expect(clamp(50, 50, NaN)).toEqual(NaN);
  });

  it(`should return max if max is lesser than min`, () => {
    expect(clamp(50, 5, 10)).toEqual(10);
  });

  it(`should return max if min is greater than max`, () => {
    expect(clamp(50, 5, 10)).toEqual(10);
  });
});
