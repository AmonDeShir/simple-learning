import * as FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from 'axios';
import { mockAudio, MockAudio } from "../../../../utils/mocks/audio-mock";
import { mockIcon, MockIcon } from '../../../../utils/mocks/icon-mock';
import { TestingContainer } from "../../../../utils/test-utils/testing-container"
import { ShowDailyList } from "./show-daily-list";

describe('ShowDailyList', () => {
  let audio: MockAudio;
  let icon: MockIcon;
  let axiosGet: jest.SpyInstance;
  const axiosGetOrigin = axios.get;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-05-05T00:00:00.000Z").getTime());
    jest.useRealTimers();

    audio = mockAudio();
    icon = mockIcon(FileOpenOutlinedIcon, "File Icon");
    axiosGet = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    audio.mockClear();
    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);
  });

  afterAll(() => {
    audio.mockRestore();
    icon.mockRestore();
    axiosGet.mockRestore();
  });

  it(`should render the toady list`, async () => {
    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it(`should display error message`, async () => {
    axiosGet.mockRejectedValueOnce({
      status: 400,
      message: 'error'
    });

    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  });

  it(`should display empty message if there is no items for today`, async () => {
    axiosGet.mockResolvedValueOnce({
      status: 200,
      data: {
        days: [[]],
        date: 1651808437105,
        isLastPage: false
      }
    });

    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText('There is nothing to learn for today')).toBeInTheDocument();
  });


  it(`should render the next days`, async () => {
    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("6th May")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();

    expect(screen.getByText("7th May")).toBeInTheDocument();
    expect(screen.getByText("Item 5")).toBeInTheDocument();
    expect(screen.getByText("Item 6")).toBeInTheDocument();
  });

  it(`shouldn't render a day when it has no items`, async () => {
    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.queryByText("8th May")).not.toBeInTheDocument();
    expect(screen.queryByText("9th May")).not.toBeInTheDocument();
    expect(screen.queryByText("10th May")).not.toBeInTheDocument();
    expect(screen.queryByText("11th May")).not.toBeInTheDocument();
    expect(screen.queryByText("12th May")).not.toBeInTheDocument();
    expect(screen.queryByText("13th May")).not.toBeInTheDocument();
    expect(screen.queryByText("14th May")).not.toBeInTheDocument();
    expect(screen.queryByText("15th May")).not.toBeInTheDocument();
    expect(screen.queryByText("16th May")).not.toBeInTheDocument();
    expect(screen.queryByText("17th May")).not.toBeInTheDocument();
    expect(screen.queryByText("18th May")).not.toBeInTheDocument();
    expect(screen.queryByText("19th May")).not.toBeInTheDocument();
    expect(screen.queryByText("20th May")).not.toBeInTheDocument();
    expect(screen.queryByText("21th May")).not.toBeInTheDocument();
    expect(screen.queryByText("22th May")).not.toBeInTheDocument();
    expect(screen.queryByText("23th May")).not.toBeInTheDocument();
    expect(screen.queryByText("24th May")).not.toBeInTheDocument();
    expect(screen.queryByText("25th May")).not.toBeInTheDocument();
    expect(screen.queryByText("26th May")).not.toBeInTheDocument();
    expect(screen.queryByText("27th May")).not.toBeInTheDocument();
    expect(screen.queryByText("28th May")).not.toBeInTheDocument();
    expect(screen.queryByText("29th May")).not.toBeInTheDocument();
    expect(screen.queryByText("30th May")).not.toBeInTheDocument();
    expect(screen.queryByText("31th May")).not.toBeInTheDocument();
  });

  it(`should open the set page if the user clicks on the "File Icon" button of the Today's item`, async () => {
    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    const button = screen.getAllByText("File Icon")[0];
    fireEvent.click(button);

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Set page")).toBeInTheDocument();
  });

  it(`should open the set page if the user clicks on the "File Icon" button of the month's item`, async () => {
    const { wrapper } = TestingContainer();
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    const button = screen.getAllByText("File Icon")[5];
    fireEvent.click(button);

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Set page")).toBeInTheDocument();
  });

  it(`should open the /daily-list page if the page param is less than zero`, async () => {
    const { wrapper } = TestingContainer({ page: "-1" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Daily list page")).toBeInTheDocument();
  })

  it(`shouldn't render the toady list if the page param is greater than zero`, async () => {
    const { wrapper } = TestingContainer({ page: "1" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.queryByText("Daily list page")).not.toBeInTheDocument();
    expect(screen.getByText("7th May")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    expect(screen.getByText("8th May")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();

    expect(screen.getByText("9th May")).toBeInTheDocument();
    expect(screen.getByText("Item 5")).toBeInTheDocument();
    expect(screen.getByText("Item 6")).toBeInTheDocument();
  })

  it(`should open the "learn" page if the learn button is clicked`, async () => {
    const { wrapper } = TestingContainer({ page: "0" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText("Learn"));

    expect(screen.getByText("Learn page")).toBeInTheDocument();
  })

  it(`should open the previous daily list page if the previous button is clicked`, async () => {
    const { wrapper } = TestingContainer({ page: "1" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText("Previous"));

    expect(screen.getByText("Daily list page")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  })

  it(`should open the next daily list page if the next button is clicked`, async () => {
    const { wrapper } = TestingContainer({ page: "0" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText("Next"));

    expect(screen.getByText("Daily list page")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  })

  it(`should disable the previous button if the page param is equal to zero`, async () => {
    const { wrapper } = TestingContainer({ page: "0" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it(`should disable the next button if the current page is the last page`, async () => {
    const { wrapper } = TestingContainer({ page: "1" });
    render(<ShowDailyList />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText("Next")).toBeDisabled();
  });
})