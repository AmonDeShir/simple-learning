import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../testing-container";
import { ResetPassword } from "./reset-password";

describe('ResetPassword', () => {
  it(`should display an error if the password textfield is empty`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: '' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: '' }});

    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('Please enter your new password')).toBeInTheDocument();
  });

  it(`should display an error if the repeat-password and the password are not equal`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'other password' }});

    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it(`should open the 'reset-password-message' page if the password was changed successfully`, async () => {
    const { wrapper, navigationActions } = TestingContainer('VALID-RESET-PASSWORD-TOKEN');
    render(<ResetPassword />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/reset-password-message/Your%20password%20was%20changed%20successfully.",
      updateHistory: false,
    });
  })

  it(`should open the 'reset-password-message' page if the password change operation was unsuccessful`, async () => {
    const { wrapper, navigationActions } = TestingContainer('INVALID-TOKEN');
    render(<ResetPassword />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    expect(await screen.findByText('Your token has expired.')).toBeInTheDocument();

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/reset-password-message/Your%20token%20has%20expired.",
      updateHistory: false,
    });
  })

  it(`should display the 'Operation failed' text as any error text if the result of the reset password process is invalid`, async () => {
    const { wrapper } = TestingContainer('INVALID-RESET-PASSWORD-TOKEN-WITHOUT-JSON');
    render(<ResetPassword />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(await screen.findByText('Operation failed')).toBeInTheDocument();
  });
})