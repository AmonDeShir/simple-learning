import { render, screen } from '@testing-library/react';
import { TestingContainer } from '../../utils/test-utils/testing-container';
import { Progress } from './progress';


const getPseudoElement = (type: 'before' | 'after') => {
  // eslint-disable-next-line testing-library/no-node-access
  const element = screen.queryByRole('progressbar')?.children[0];
  const classNames = element?.className.replace(/ /g, '|');

  if (!classNames) {
    return [];
  }

  const rules = Array
    .from(document.styleSheets)
    .flatMap(({ cssRules }) => Array.from(cssRules))
    .map(({ cssText }) => cssText);

  const predicate = (text: string) => Array.from(text.matchAll(new RegExp(`\\.(${classNames})::${type}`, 'g'))).length > 0;

  return rules
    .filter(predicate)
    .at(-1)
    ?.split(';')
    .map((s: string) => s.replace(' ', ''))
    .map((s: string) => s.replace(/.*content:/, 'content:'))
    .slice(0, -1) ?? [];
};

describe('Progress', () => {
  describe('max', () => {
    it(`should set the progress to 100% percent if max is equal to zero`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress max={0} value={150} />, { wrapper });

      expect(getPseudoElement('before').includes('width: 100%')).toBeTruthy();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it(`should set the progress to 100% percent if max is lesser than zero`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress max={-23} value={150} />, { wrapper });

      expect(getPseudoElement('before').includes('width: 100%')).toBeTruthy();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('value', () => {
    it(`should set the progress to 0% if the value property is lesser than max`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress max={100} value={-150.25} />, { wrapper });

      expect(getPseudoElement('before').includes('width: 0%')).toBeTruthy();
      expect(screen.getByText('-150.25%')).toBeInTheDocument();
    });

    it(`should set the progress to 20%`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress max={200} value={40} />, { wrapper });

      expect(getPseudoElement('before').includes('width: 20%')).toBeTruthy();
      expect(screen.getByText('20%')).toBeInTheDocument();
    });
  });

  describe('text', () => {
    it(`should display text`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress text="value:" />, { wrapper });

      expect(screen.getByText(`value: 0%`)).toBeInTheDocument();
    });

    it(`shouldn't display text if the text property is an empty string`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress text="" />, { wrapper });

      expect(screen.getByText(`0%`)).toBeInTheDocument();
    });

    it(`shouldn't display text if the text property is undefined`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress />, { wrapper });

      expect(screen.getByText(`0%`)).toBeInTheDocument();
    });
  });

  describe('textPosition', () => {
    it(`should move the text to left if the textPosition parameter is set to 'left'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="left" text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: relative;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: row-reverse;
        height: 40px;
      `);
    });

    it(`should move the text to right if the textPosition parameter is set to 'right'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="right" text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: relative;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: row;
        height: 40px;
      `);
    });

    it(`should move the text to up if the textPosition parameter is set to 'up'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="up" text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: relative;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: column-reverse;
        height: 80px;
      `);
    });

    it(`should move the text to down if the textPosition parameter is set to 'down'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="down" text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: relative;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: column;
        height: 80px;
      `);
    });

    it(`should move the text to center if the textPosition parameter is set to 'center'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="center" text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: absolute;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: row-reverse;
        height: 40px;
      `);
    });

    it(`should move the text to center, after the decorator if the textPosition parameter is set to 'center-after'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress textPosition="center-after" value={10} text="text" format="percent" />, { wrapper });

      expect(screen.getByText('10% text')).toBeInTheDocument();

      expect(screen.getByText('10% text')).toHaveStyle(`
        position: absolute;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: row-reverse;
        height: 40px;
      `);
    });

    it(`should move the text to center if the textPosition parameter is undefined`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress text="text" format="none" />, { wrapper });

      expect(screen.getByText('text')).toHaveStyle(`
        position: absolute;
      `);

      expect(screen.queryByRole('progressbar')).toHaveStyle(`
        flex-direction: row-reverse;
        height: 40px;
      `);
    });
  });

  describe('format', () => {
    it(`should display the progress as a percentage if the format parameter is set to 'percent'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} format="percent" />, { wrapper });

      expect(screen.getByText('99.5%')).toBeInTheDocument();
    });

    it(`should display the progress as a friction if the format parameter is set to 'fraction'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} format="fraction" />, { wrapper });

      expect(screen.getByText('99.5 / 100')).toBeInTheDocument();
    });

    it(`shouldn't display the progress if the format parameter is set to 'none'`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} format="none" />, { wrapper });

      expect(screen.queryByText('99.5%')).not.toBeInTheDocument();
      expect(screen.queryByText('99.5 / 100')).not.toBeInTheDocument();
    });
  });

  describe('reverse', () => {
    it(`should reverse the fill value of the component if the reverse property is defined`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} reverse />, { wrapper });

      expect(getPseudoElement('before').includes('width: 99.5%')).toBeFalsy();
      expect(getPseudoElement('before').includes('width: 0.5%')).toBeTruthy();
    });

    it(`shouldn't reverse the displayed value if the reverse property is defined`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} reverse />, { wrapper });

      expect(screen.queryByText('0.5%')).not.toBeInTheDocument();
      expect(screen.getByText('99.5%')).toBeInTheDocument();
    });

    it(`shouldn't reverse the fill value of the component if the reverse property is undefined`, () => {
      const { wrapper } = TestingContainer();
      render(<Progress value={99.5} />, { wrapper });

      expect(getPseudoElement('before').includes('width: 0.5%')).toBeFalsy();
      expect(getPseudoElement('before').includes('width: 99.5%')).toBeTruthy();
    });
  });
});
