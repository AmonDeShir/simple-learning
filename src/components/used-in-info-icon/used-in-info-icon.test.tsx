import * as InfoIcon from '@mui/icons-material/Info';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockIcon, MockIcon } from '../../utils/mocks/icon-mock';
import { generateUsedInText, UsedInInfoIcon } from './used-in-info-icon';

describe(`UsedInInfoIcon`, () => {
  let infoIcon: MockIcon;

  beforeAll(() => {
    infoIcon = mockIcon(InfoIcon);
  });

  afterAll(() => {
    infoIcon.mockRestore();
  });
  
  it(`should display an infoIcon component with message if the usedIn parameter is defined`, () => {
    const usedIn = [
      {
        id: '1',
        title: 'Set 1'
      }
    ];

    render(<UsedInInfoIcon usedIn={usedIn} />);
    fireEvent.click(screen.getByText("Icon"));

    expect(screen.getByText('This definition is used in 1 other set: “Set 1”')).toBeInTheDocument();
  })

  it(`shouldn't display if the usedIn parameter is not defined`, () => {
    render(<UsedInInfoIcon />);

    expect(screen.queryByText("Icon")).not.toBeInTheDocument();
  });

  it(`shouldn't display if an infoIcon component if the usedIn parameter is an empty array`, () => {
    render(<UsedInInfoIcon usedIn={[]} />);

    expect(screen.queryByText("Icon")).not.toBeInTheDocument();
  });
});

describe('generateUsedInText', () => {
  it(`should return an empty string if the usedIn parameter is undefined`, () => {
    expect(generateUsedInText()).toEqual('');
  });

  it(`should return the singular version of the message if the usedIn parameter is an array with one element`, () => {
    const usedIn = [
      {
        id: '1',
        title: 'Set 1'
      }
    ];

    expect(generateUsedInText(usedIn)).toEqual('This definition is used in 1 other set: “Set 1”');
  });

  it(`should return the plural version of the message if the usedIn parameter is an array with more than one element`, () => {
    const usedIn = [
      {
        id: '1',
        title: 'Set 1'
      },
      {
        id: '2',
        title: 'Set 2'
      },
      {
        id: '3',
        title: 'Set 3'
      }
    ];

    expect(generateUsedInText(usedIn)).toEqual('This definition is used in 3 other sets: “Set 1”, “Set 2”, “Set 3”');
  });
});