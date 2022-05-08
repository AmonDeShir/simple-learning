import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import Main from "./main";
import mediaQuery from 'css-mediaquery';
import * as fetchData from "../../../api/fetchData";

function createMatchMedia(width: number) {
  return (query: any) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('Main', () => {
  it(`should render the user's name`, async () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: true }});
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Hi User')).toBeInTheDocument();
  });

  it(`should open the daily list page if the 'Show' button is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: true }});
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText('Daily list page')).toBeInTheDocument();
  })

  it(`should open the learnZ page if the 'Learn' button is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: true }});
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('Learn'));

    expect(screen.getByText('Learn page')).toBeInTheDocument();
  })

  it(`should open the dictionary page if the dictionary's search button is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
  
    const input = screen.getByTestId('search-text-field');
    fireEvent.change(input, { target: { value: 'word' } });
    fireEvent.click(screen.getByText('Search'));

    expect(screen.getByText('Dictionary page')).toBeInTheDocument();
    expect(screen.getByText('word')).toBeInTheDocument();
  });

  it(`should open the set list page if the 'Open set list' button is clicked`, async () => {
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('Open set list'));

    expect(screen.getByText('Set list page')).toBeInTheDocument();
  });


  it(`should display the sets carousel component if application is opened on the mobile device`, async () => {
    window.matchMedia = createMatchMedia(500) as any;

    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    // eslint-disable-next-line testing-library/no-node-access
    const masonry = document.querySelector('.Masonry__Main');
    const carousel = screen.getByTestId('carousel');
    
    expect(carousel).toBeInTheDocument();
    expect(masonry).not.toBeInTheDocument();
  });

  it(`should display the sets masonry component if application isn't opened on the mobile device`, async () => {
    window.matchMedia = createMatchMedia(1200) as any;    
    
    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });
    
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    // eslint-disable-next-line testing-library/no-node-access
    const masonry = document.querySelector('.Masonry__Main');
    const carousel = screen.queryByTestId('carousel');
    
    expect(carousel).not.toBeInTheDocument();
    expect(masonry).toBeInTheDocument();
  });

  it(`should open the set page if the set's card of the sets masonry is clicked`, async () => {
    window.matchMedia = createMatchMedia(1200) as any;    

    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Test set 0'));

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('id_0')).toBeInTheDocument();
  });

  it(`should open the set page if the set's card of the sets carousel is clicked`, async () => {
    window.matchMedia = createMatchMedia(500) as any;    

    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: false } });
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Test set 0'));

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('id_0')).toBeInTheDocument();
  });

  it(`should display an error message if the fetch is unsuccessful`, async () => {
    let fetchDataSpy = jest.spyOn(fetchData, 'fetchData');
    fetchDataSpy.mockResolvedValue({
      message: 'Not found',
      status: 404,
      data: undefined
    })

    const { wrapper } = TestingContainer(undefined, { user: { name: 'User', loginPage: false, sync: true } });
    render(<Main />, { wrapper });

    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getAllByText('There was an error. Please try again')[1]).toBeInTheDocument();
    fetchDataSpy.mockRestore();
  });
})