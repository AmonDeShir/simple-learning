/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { ProgressChart } from "./progress-chart";
import mediaQuery from 'css-mediaquery';
import * as useRect from '../../utils/use-rect/use-rect';
import * as fetchData from "../../api/fetchData";
import { TestingContainer } from "../../utils/test-utils/testing-container";

function createMatchMedia(width: number, height: number) {
  return (query: any) => ({
    matches: mediaQuery.match(query, {
      width,
      height
    }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('ProgressChart', () => {
  let useRectSpy: jest.SpyInstance;

  beforeAll(() => {
    useRectSpy = jest.spyOn(useRect, 'useRect');
  })

  beforeEach(() => {
    window.matchMedia = createMatchMedia(1000, 1000) as any;
  });

  afterAll(() => {
    useRectSpy.mockRestore();
  });

  it(`should render the title`, async () => {
    window.matchMedia = createMatchMedia(500, 1000) as any;
    useRectSpy.mockReturnValue({ width: 450 });
    const { wrapper } = TestingContainer();

    render(<ProgressChart />, { wrapper });
    await screen.findByText('relearning');

    expect(screen.getByText("Learning Progress")).toBeInTheDocument();
  });

  it(`should render smaller chart if it is rendered on the mobile device`, async () => {
    window.matchMedia = createMatchMedia(500, 1000) as any;
    useRectSpy.mockReturnValue({ width: 450 });
    const { wrapper } = TestingContainer();

    render(<ProgressChart />, { wrapper });
    await screen.findByText('relearning');
    
    const chart = document.querySelector('.recharts-wrapper');

    expect(chart).toHaveStyle('width: 450px');
    expect(chart).toHaveStyle('height: 250px');
  });

  it(`should render normal chart if it isn't rendered on the mobile device`, async () => {
    window.matchMedia = createMatchMedia(2048, 1500) as any;
    useRectSpy.mockReturnValue({ width: 500 });
    const { wrapper } = TestingContainer();

    render(<ProgressChart />, { wrapper });
    await screen.findByText('relearning');

    const chart = document.querySelector('.recharts-wrapper');

    expect(chart).toHaveStyle('width: 500px');
    expect(chart).toHaveStyle('height: 430px');
  });

  it(`should display an error message if the data fetching failed`, async () => {
    const fetchDataSpy = jest.spyOn(fetchData, 'fetchData').mockRejectedValue({ status: 500 });
    window.matchMedia = createMatchMedia(2048, 1500) as any;
    useRectSpy.mockReturnValue({ width: 500 });
    const { wrapper } = TestingContainer();

    render(<ProgressChart />, { wrapper });
    await screen.findByText('There was an error. Please try again');

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
    fetchDataSpy.mockRestore();
  });

  it(`should display an error message if the fetched response is an empty array`, async () => {
    const fetchDataSpy = jest.spyOn(fetchData, 'fetchData').mockResolvedValue({ status: 200, data: [] } as any);
    window.matchMedia = createMatchMedia(2048, 1500) as any;
    useRectSpy.mockReturnValue({ width: 500 });
    const { wrapper } = TestingContainer();

    render(<ProgressChart />, { wrapper });
    await screen.findByText('There was an error. Please try again');

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
    fetchDataSpy.mockRestore();
  });
});