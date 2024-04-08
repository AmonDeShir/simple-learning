import * as CloseIcon from '@mui/icons-material/Close';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockIcon, MockIcon } from '../../utils/mocks/icon-mock';
import { YesNoDialog } from "./yes-no-dialog";

describe('YesNoDialog', () => {
  let closeIcon: MockIcon;

  beforeAll(() => {
    closeIcon = mockIcon(CloseIcon, 'Close icon');
  })

  afterAll(() => {
    closeIcon.mockRestore();
  })

  it(`should show a dialog if the open property is true`, async () => {
    const { rerender } = render(<YesNoDialog open={true} message="Are you sure?" onAnswer={()=>{}} />);
    
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();

    rerender(<YesNoDialog open={false} message="Are you sure?" onAnswer={()=>{}} />);
    await waitFor(() => expect(screen.queryByText('Yes')).not.toBeInTheDocument());

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it(`should call the onAnswer function if one of the dialog buttons is clicked`, async () => {
    const onAnswer = jest.fn();
    render(<YesNoDialog open={true} message="Are you sure?" onAnswer={onAnswer} />);
    
    await screen.findByText('Are you sure?');

    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('No'));
    fireEvent.click(screen.getByText('Close icon'));

    expect(onAnswer).toBeCalledTimes(3);
    expect(onAnswer).toHaveBeenNthCalledWith(1, 'yes');
    expect(onAnswer).toHaveBeenNthCalledWith(2, 'no');
    expect(onAnswer).toHaveBeenNthCalledWith(3, 'close');
  });
})