import MockDate from 'mockdate';
import { getDaysInCurrentMonth } from "./get-days-in-current-month";

describe('getDaysInCurrentMonth', () => {
  beforeEach(() => MockDate.set('2022-04-01'));
  afterEach(() => MockDate.reset());

  it('should return the number of days in the current month', () => {
    expect(getDaysInCurrentMonth()).toEqual(30);
  });
})