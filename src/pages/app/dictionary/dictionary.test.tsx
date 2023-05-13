import * as FileOpenIcon from '@mui/icons-material/FileOpenOutlined';
import * as AddRoundedIcon from '@mui/icons-material/AddRounded';
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAudio, MockAudio } from "../../../utils/mocks/audio-mock";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import { Dictionary } from "./dictionary";
import { mockIcon, MockIcon } from "../../../utils/mocks/icon-mock";
import axios from 'axios';
import { SearchFrom } from "../../../components/search-from/search-form"; 
import { LanguageOption } from "../../../components/search-menu/serach-menu"; 
import * as InfoIcon from '@mui/icons-material/Info';


jest.mock("../../../components/search-from/search-form");

describe('Dictionary', () => {
  let mockSearchForm = SearchFrom as jest.MockedFunction<typeof SearchFrom>;
  let audio: MockAudio;
  let fileOpenIcon: MockIcon;
  let infoIcon: MockIcon;
  let addIcon: MockIcon;
  let axiosPost: jest.SpyInstance;
  let axiosGet: jest.SpyInstance;
  const axiosPostOrigin = axios.post;
  const axiosGetOrigin = axios.get;
  let searchFormSubmit = (vale: string, from?: LanguageOption, to?: LanguageOption) => {};

  beforeAll(() => {
    audio = mockAudio();
    fileOpenIcon = mockIcon(FileOpenIcon, "Open File Icon");
    addIcon = mockIcon(AddRoundedIcon, "Add Icon");
    infoIcon = mockIcon(InfoIcon, 'Info Icon');

    axiosPost = jest.spyOn(axios, 'post');
    axiosGet = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    audio.mockClear();

    axiosPost.mockClear();
    axiosPost.mockImplementation(axiosPostOrigin);

    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);

    mockSearchForm.mockImplementation((props) => {
      searchFormSubmit = props.onSubmit ?? (() => {});
      return (<div>title={props.title ?? "undefined"} label={props.label ?? "undefined"} defaultValue={props.defaultValue ?? "undefined"}</div>);
    });
  });

  afterAll(() => {
    audio.mockRestore();
    fileOpenIcon.mockRestore();
    addIcon.mockRestore();
    infoIcon.mockRestore();
    axiosPost.mockRestore();
    axiosGet.mockRestore();
    jest.restoreAllMocks();
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

    act(() => { searchFormSubmit("empty")});

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('Wow such empty :(')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wow such empty :(')[1]).toBeInTheDocument();
  });

  it(`should display an error of the search result`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    act(() => { searchFormSubmit("error")});

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('There was an error. Please try again')[0]).toBeInTheDocument();
    expect(screen.getAllByText('There was an error. Please try again')[1]).toBeInTheDocument();
  });

  it(`should accept the 'to' search filters`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);
    act(() => { searchFormSubmit("word", undefined, "English")});
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(axiosGet).toHaveBeenCalledTimes(2);
    expect(axiosGet).toHaveBeenCalledWith('../api/v1/dictionary/search/word?to=English', expect.any(Object));
  });

  it(`should accept the 'from' search filters`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);
    act(() => { searchFormSubmit("word", "Polish")});
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(axiosGet).toHaveBeenCalledTimes(2);
    expect(axiosGet).toHaveBeenCalledWith('../api/v1/dictionary/search/word?from=Polish', expect.any(Object));
  });

  it(`should accept search filters`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    axiosGet.mockClear();
    axiosGet.mockImplementation(axiosGetOrigin);
    act(() => { searchFormSubmit("word", "Polish", "English")});
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(axiosGet).toHaveBeenCalledTimes(2);
    expect(axiosGet).toHaveBeenCalledWith('../api/v1/dictionary/search/word?from=Polish&to=English', expect.any(Object));
  });

  it(`shouldn'y display addctional translation info if it wasn't attached to server response`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'empty' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    act(() => { searchFormSubmit("word")});
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.queryByText("Info Icon")).not.toBeInTheDocument();
    expect(screen.getByText("Write these words down.")).toBeInTheDocument();
  });

  it(`should display addctional translation info if it was attached to server response`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'empty' }, { user: { name: 'User', sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    act(() => { searchFormSubmit("interslavic", "Interslavic", "Polish")});
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText("Info Icon").length).toEqual(2);
    expect(screen.getByText("testovati")).toBeInTheDocument();
  });
});