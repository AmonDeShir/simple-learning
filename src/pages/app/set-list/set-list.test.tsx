import * as editSetSlice from '../../../redux/slices/edit-set/edit-set';
import * as DeleteIcon from '@mui/icons-material/Delete';
import * as EditIcon from '@mui/icons-material/Edit';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import SetList from "./set-list";
import { mockIcon, MockIcon } from '../../../utils/mocks/icon-mock';
import axios from 'axios';

describe(`SetList`, () => {
  let deleteIcon: MockIcon;
  let editIcon: MockIcon;
  let editSetOrigin = editSetSlice.editSet;
  let editSetSpy: jest.SpyInstance;
  let axiosDeleteSpy: jest.SpyInstance;
  let axiosGetSpy: jest.SpyInstance;
  const axiosDeleteOrigin = axios.delete;
  const axiosGetOrigin = axios.get;

  beforeAll(() => {
    deleteIcon = mockIcon(DeleteIcon, 'delete icon');
    editIcon = mockIcon(EditIcon, 'edit icon');
    editSetSpy = jest.spyOn(editSetSlice, 'editSet');
    axiosDeleteSpy = jest.spyOn(axios, 'delete');
    axiosGetSpy = jest.spyOn(axios, 'get');
  });

  beforeEach(() => {
    editSetSpy.mockClear();
    editSetSpy.mockImplementation(editSetOrigin);

    axiosDeleteSpy.mockClear();
    axiosDeleteSpy.mockImplementation(axiosDeleteOrigin);

    axiosGetSpy.mockClear();
    axiosGetSpy.mockImplementation(axiosGetOrigin);
  });

  afterAll(() => {
    deleteIcon.mockRestore();
    editIcon.mockRestore();
    editSetSpy.mockRestore();
  });

  it(`should render page title`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });
    
    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Sets')).toBeInTheDocument();
  });

  it(`should render the search result`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });

    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Set 0')).toBeInTheDocument();
    expect(screen.getByText('Set 1')).toBeInTheDocument();
  });

  it(`should search and display the search result if the search button is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });

    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByTestId('search-text-field'), { target: { value: 'empty' } });
    fireEvent.click(screen.getByText('Search'));

    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('Wow such empty :(')).toBeInTheDocument();
  });

  it(`should display an error of the search result`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });

    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    fireEvent.change(screen.getByTestId('search-text-field'), { target: { value: 'error' } });
    fireEvent.click(screen.getByText('Search'));

    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

    expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
  });

  it(`should open the 'view-set' page if an search result is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });
    
    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Set 0'));

    expect(screen.getByText('Set page')).toBeInTheDocument();
    expect(screen.getByText('set_id_0')).toBeInTheDocument();
  });

  it(`should open the 'edit-set' page and call the editSet action if an 'Edit' icon is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });
    
    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getAllByText('edit icon')[0]);

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
    expect(editSetSpy).toBeCalledTimes(1);
    expect(editSetSpy).toBeCalledWith('set_id_0');
  });

  it(`should open the 'edit-set' page if the 'New set' button is clicked`, async () => {
    const { wrapper } = TestingContainer();
    render(<SetList />, { wrapper });
    
    await screen.findByText(`Loading please wait...`);
    await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getByText('New set'));

    expect(screen.getByText('Edit set page')).toBeInTheDocument();
  });

  describe('Delete dialog', () => {
    it(`should show the delete dialog if an delete icon is clicked`, async () => {
      const { wrapper } = TestingContainer();
      render(<SetList />, { wrapper });
      
      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      
      fireEvent.click(screen.getAllByText('delete icon')[0]);
  
      expect(screen.getByText('Are you sure you want to delete this set?')).toBeInTheDocument();
    })
  
    it(`should delete set and reload set list array if the 'Yes' button is clicked`, async () => {
      const { wrapper } = TestingContainer();
      render(<SetList />, { wrapper });

      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
  
      fireEvent.click(screen.getAllByText('delete icon')[0]);

      await screen.findByText(`Are you sure you want to delete this set?`);
      fireEvent.click(screen.getByText('Yes'));

      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

      expect(screen.queryByText('Set 0')).not.toBeInTheDocument();
      expect(screen.getByText('Set 1')).toBeInTheDocument();

      await axios.get('/api/v1/sets/restoreSearchData');
    })

    it(`should display an error if fetching data after delete failed`, async () => {
      const { wrapper } = TestingContainer();
      axiosDeleteSpy.mockImplementation(() => Promise.reject({}));
      axiosGetSpy.mockImplementationOnce(axiosGetOrigin);
      axiosGetSpy.mockImplementationOnce(() => Promise.reject({}));

      render(<SetList />, { wrapper });
      
      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getAllByText('delete icon')[0]);

      await screen.findByText(`Are you sure you want to delete this set?`);
      fireEvent.click(screen.getByText('Yes'));

      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());

      expect(screen.getByText('There was an error. Please try again')).toBeInTheDocument();
    })

    it(`shouldn't delete items if 'No' button is clicked`, async () => {
      const { wrapper } = TestingContainer();
      render(<SetList />, { wrapper });

      await screen.findByText(`Loading please wait...`);
      await waitFor(() => expect(screen.queryByText('Loading please wait...')).not.toBeInTheDocument());
      fireEvent.click(screen.getAllByText('delete icon')[0]);

      await screen.findByText(`Are you sure you want to delete this set?`);
      fireEvent.click(screen.getByText('No'));

      await waitFor(() => expect(screen.queryByText('Are you sure you want to delete this set?')).not.toBeInTheDocument());

      expect(screen.getByText('Set 0')).toBeInTheDocument();
      expect(screen.getByText('Set 1')).toBeInTheDocument();
    });
  })
})