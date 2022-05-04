import * as InfoIcon from '@mui/icons-material/Info';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockIcon, MockIcon } from '../../utils/mocks/icon-mock';
import { IconInfo } from './info-icon';

describe(`InfoIcon`, () => {
  let infoIcon: MockIcon;

  beforeAll(() => {
    infoIcon = mockIcon(InfoIcon);
  });

  afterAll(() => {
    infoIcon.mockRestore();
  });

  it(`should render the icon`, () => {
    render(<IconInfo text="Hello World" />);
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });

  it(`should show the text when clicked`, () => {
    render(<IconInfo text="Hello World" />);
    
    fireEvent.click(screen.getByText("Icon"));
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it(`should hide the text when clicked again`, async () => {
    render(<IconInfo text="Hello World" />);
    
    fireEvent.click(screen.getByText("Icon"));
    expect(screen.getByText("Hello World")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Icon"));
    await waitFor(() => expect(screen.queryByText("Hello World")).not.toBeInTheDocument());

    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });

  it(`should hide the text when the message was clicked`, async () => {
    render(<IconInfo text="Hello World" />);
    
    fireEvent.click(screen.getByText("Icon"));
    expect(screen.getByText("Hello World")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hello World"));
    await waitFor(() => expect(screen.queryByText("Hello World")).not.toBeInTheDocument());

    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });
})