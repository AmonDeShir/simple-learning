import * as FileOpenIcon from '@mui/icons-material/FileOpenOutlined';
import * as AddRoundedIcon from '@mui/icons-material/AddRounded';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAudio, MockAudio } from "../../../utils/mocks/audio-mock";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import { Dictionary } from "./dictionary";
import { mockIcon, MockIcon } from "../../../utils/mocks/icon-mock";
import axios from 'axios';

describe('Dictionary', () => {
  let audio: MockAudio;
  let fileOpenIcon: MockIcon;
  let addIcon: MockIcon;
  let axiosPost: jest.SpyInstance;
  let axiosGet: jest.SpyInstance;
  const axiosPostOrigin = axios.post;
  const axiosGetOrigin = axios.get;

  beforeAll(() => {
    audio = mockAudio();
    fileOpenIcon = mockIcon(FileOpenIcon, "Open File Icon");
    addIcon = mockIcon(AddRoundedIcon, "Add Icon");
    axiosPost = jest.spyOn(axios, 'post');
    axiosGet = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    audio.mockClear();

    axiosPost.mockClear();
    axiosPost.mockImplementation(axiosPostOrigin);

    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);
  });

  afterAll(() => {
    audio.mockRestore();
    fileOpenIcon.mockRestore();
    addIcon.mockRestore();
    axiosPost.mockRestore();
    axiosGet.mockRestore();
  });
  

  it(`should render page title`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Dictionary')).toBeInTheDocument();
  });

  it(`should render the search result`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());


    expect(screen.getByText('meaning diki 1')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 2')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 3')).toBeInTheDocument();

    expect(screen.getByText('meaning words 1')).toBeInTheDocument();
    expect(screen.getByText('meaning words 2')).toBeInTheDocument();
  });

  it(`should open the set page if the FileOpen icon of a WordCard component is clicked`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Open File Icon')[0]);

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('62654ed22b1dda1589570b7c')).toBeInTheDocument();
  })

  it(`should post the save word request to the server if the add icon is clicked`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Add Icon')[0]);

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('../api/v1/user/save-word', expect.any(Object), expect.any(Object));

    expect(axiosGet).toHaveBeenCalledTimes(3);
    expect(axiosGet).toHaveBeenNthCalledWith(3, '../api/v1/words/search/word', expect.any(Object));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    expect(screen.getByText('meaning words 1')).toBeInTheDocument();
    expect(screen.getByText('meaning words 2')).toBeInTheDocument();
  });

  it(`should display an error if there is an error after clicking the add icon`, async () => {
    axiosGet.mockImplementationOnce(axiosGetOrigin);
    axiosGet.mockImplementationOnce(axiosGetOrigin);
    axiosGet.mockResolvedValueOnce({
      status: 400,
      error: 'error'
    });

    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Add Icon')[0]);

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('../api/v1/user/save-word', expect.any(Object), expect.any(Object));

    expect(axiosGet).toHaveBeenCalledTimes(3);

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  });

  it(`should search and display the search result if the search button is clicked`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'empty' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('Wow such empty :(')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wow such empty :(')[1]).toBeInTheDocument();
  });

  it(`should display an error of the search result`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'error' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('There was an error. Please try again')[0]).toBeInTheDocument();
    expect(screen.getAllByText('There was an error. Please try again')[1]).toBeInTheDocument();
  });
});