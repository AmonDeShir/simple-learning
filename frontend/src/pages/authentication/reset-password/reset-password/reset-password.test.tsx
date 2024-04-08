import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { ResetPassword } from "./reset-password";

describe('ResetPassword', () => {
  it(`should display an error if the password textfield is empty`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword token="" />, { wrapper });

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
    render(<ResetPassword token="" />, { wrapper });

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
    const { wrapper } = TestingContainer();
    render(<ResetPassword token="VALID-RESET-PASSWORD-TOKEN" />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await screen.findByText('Auth page');
    expect(screen.getByText('reset-password-message - Your password was changed successfully.')).toBeInTheDocument();
  })

  it(`should open the 'reset-password-message' page if the password change operation was unsuccessful`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword token="INVALID-TOKEN" />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await screen.findByText('Auth page');
    expect(screen.getByText('reset-password-message - Your token has expired.')).toBeInTheDocument();
  })

  it(`should display the 'Operation failed' text as any error text if the result of the reset password process is invalid`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword token="INVALID-RESET-PASSWORD-TOKEN-WITHOUT-JSON" />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await screen.findByText('Auth page');
    expect(await screen.findByText('reset-password-message - Operation failed')).toBeInTheDocument();
  });

  it(`should display the an error message but shouldn't open the 'reset-password-message' page if the reset password operation isn't successful and the operation status is other than 403`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPassword token="INVALID-RESET-TOKEN-USER-NOT-FOUND" />, { wrapper });

    const password = screen.getByTestId("password-text-field");
    fireEvent.focus(password);
    fireEvent.change(password, { target: { value: 'password' }});

    const repeatPassword = screen.getByTestId("repeat-password-text-field");
    fireEvent.focus(repeatPassword);
    fireEvent.change(repeatPassword, { target: { value: 'password' }});

    fireEvent.click(screen.getByText('Done'));

    await screen.findByText('User not found');
    expect(screen.queryByText('Auth page')).not.toBeInTheDocument();
  });
})