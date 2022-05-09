import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { SendEmail } from "./send-email";

describe('SendEmail', () => {
  it(`should open the registration page if the user clicks the 'Click here to register' link`, async () => {
    const { wrapper } = TestingContainer();
    render(<SendEmail />, { wrapper });

    fireEvent.click(screen.getAllByText('Click here')[0]);

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(await screen.findByText('register')).toBeInTheDocument();
  });

  it(`should display an error if the email textfield is empty`, async () => {
    const { wrapper } = TestingContainer();
    render(<SendEmail />, { wrapper });

    const email = screen.getByTestId("email-text-field");
    fireEvent.focus(email);
    fireEvent.change(email, { target: { value: '' }});
    
    fireEvent.click(screen.getByText('Done'));
    
    expect(await screen.findByText('Please enter your email address')).toBeInTheDocument();
  });

  it(`should display an error if the email sending operation was unsuccessful`, async () => {
    const { wrapper } = TestingContainer();
    render(<SendEmail />, { wrapper });

    const email = screen.getByTestId("email-text-field");
    fireEvent.focus(email);
    fireEvent.change(email, { target: { value: 'email' }});
    
    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('User with that email not exist')).toBeInTheDocument();
  });

  it(`should display the 'Operation failed' text as any error text if the result of the login operation is invalid`, async () => {
    const { wrapper } = TestingContainer();
    render(<SendEmail />, { wrapper });

    const email = screen.getByTestId("email-text-field");
    fireEvent.focus(email);
    fireEvent.change(email, { target: { value: 'invalidWithoutJson@example.com' }});
    
    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('Operation failed')).toBeInTheDocument();
  });

  it(`should open the 'authenticate-your-email' page after successful registration`, async () => {
    const { wrapper } = TestingContainer();
    render(<SendEmail />, { wrapper });

    const email = screen.getByTestId("email-text-field");
    fireEvent.focus(email);
    fireEvent.change(email, { target: { value: 'success@example.com' }});
    
    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(await screen.findByText('receive-email')).toBeInTheDocument();
  })
})