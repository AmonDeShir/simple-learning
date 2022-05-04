import * as FileOpenIcon from '@mui/icons-material/FileOpenOutlined';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAudio, MockAudio } from "../../../utils/mocks/audio-mock";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import { Dictionary } from "./dictionary";
import { mockIcon, MockIcon } from "../../../utils/mocks/icon-mock";

describe('Dictionary', () => {
  let audio: MockAudio;
  let fileOpenIcon: MockIcon;

  beforeAll(() => {
    audio = mockAudio();
    fileOpenIcon = mockIcon(FileOpenIcon, "Open File Icon");
  });

  beforeEach(() => {
    audio.mockClear();
  });

  afterAll(() => {
    audio.mockRestore();
    fileOpenIcon.mockRestore();
  });
  

  it(`should render page title`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Dictionary />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Dictionary')).toBeInTheDocument();
  });

  it(`should render the search result`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());


    expect(screen.getByText('meaning diki 1')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 2')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 3')).toBeInTheDocument();

    expect(screen.getByText('meaning words 1')).toBeInTheDocument();
    expect(screen.getByText('meaning words 2')).toBeInTheDocument();
  });

  it(`should open the set page if the FileOpen icon of a WordCard component is clicked`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Open File Icon')[0]);

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('62654ed22b1dda1589570b7c')).toBeInTheDocument();
  })

  it(`should search and display the search result if the search button is clicked`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'empty' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('Wow such empty :(')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wow such empty :(')[1]).toBeInTheDocument();
  });

  it(`should display an error of the search result`, async () => {
    const { wrapper } = TestingContainer({ 'word': 'word' }, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Dictionary />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'error' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('There was an error. Please try again')[0]).toBeInTheDocument();
    expect(screen.getAllByText('There was an error. Please try again')[1]).toBeInTheDocument();
  });
});