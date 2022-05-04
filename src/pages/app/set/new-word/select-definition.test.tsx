import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { dikiResult } from "../../../../api/mock-server/data/diki.data";
import { wordSearchResult } from "../../../../api/mock-server/data/words-search.data";
import { mockAudio, MockAudio } from "../../../../utils/mocks/audio-mock";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { SelectDefinition } from "./select-definition";

describe('SelectDefinition', () => {
  let audio: MockAudio;

  beforeAll(() => {
    audio = mockAudio();
  });

  beforeEach(() => {
    audio.mockClear();
  });

  afterAll(() => {
    audio.mockRestore();
  });

  it(`should render component description`, async () => {
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={() => {}} />, { wrapper });
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Import word definition from an online dictionary or from one of your sets, you can also add your own custom definition')).toBeInTheDocument();
  });

  it(`should render the search result`, async () => {
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={() => {}} />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());


    expect(screen.getByText('meaning diki 1')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 2')).toBeInTheDocument();
    expect(screen.getByText('meaning diki 3')).toBeInTheDocument();

    expect(screen.getByText('meaning words 1')).toBeInTheDocument();
    expect(screen.getByText('meaning words 2')).toBeInTheDocument();
  });

  it(`should call if the onSelect function if an set search result is clicked`, async () => {
    const onSelect = jest.fn();
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={onSelect} />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('meaning words 1'));

    expect(onSelect).toBeCalledWith({
      ...wordSearchResult[0],
      type: 'import',
      error: {}
    })
  })

  it(`should call if the onSelect function if a diki search result is clicked`, async () => {
    const onSelect = jest.fn();
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={onSelect} />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('meaning diki 1'));

    expect(onSelect).toBeCalledWith({
      ...dikiResult[0],
      type: 'create',
      error: {}
    })
  })

  it(`should search and display the search result if the search button is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={() => {}} />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'empty' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('Wow such empty :(')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wow such empty :(')[1]).toBeInTheDocument();
  });

  it(`should display an error of the search result`, async () => {
    const { wrapper } = TestingContainer();
    render(<SelectDefinition word="word" onSelect={() => {}} />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue('word'), { target: { value: 'error' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('There was an error. Please try again')[0]).toBeInTheDocument();
    expect(screen.getAllByText('There was an error. Please try again')[1]).toBeInTheDocument();
  });
});
