import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { EmailAuthentication } from "./email-authentication";

describe(`EmailAuthentication`, () => {
  it(`should hide the 'Ok' button, and show 'Please wait, your email address is now being authenticated...' message`, async () => {
    const { wrapper } = TestingContainer();
    render(<EmailAuthentication token="VALID-CONFIRMATION-TOKEN" />, { wrapper });

    await screen.findByText('Please wait, your email address is now being authenticated...');
  });

  it(`should display an error if the authentication operation was unsuccessful`, async () => {
    const { wrapper } = TestingContainer();
    render(<EmailAuthentication token="INVALID-CONFIRMATION-TOKEN" />, { wrapper });

    await screen.findByText('Ok');

    expect(screen.getByText('Your token has expired. A new one has been generated and sent, check your email.')).not.toBeNull();
    fireEvent.click(screen.getByText('Ok'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('log-in')).toBeInTheDocument();
  });

  it(`should display the 'Authentication failed.' text as an error message if the authentication operation result is invalid`, async () => {
    const { wrapper } = TestingContainer();
    render(<EmailAuthentication token="INVALID-CONFIRMATION-TOKEN-WITHOUT-JSON" />, { wrapper });

    await screen.findByText('Ok');

    expect(screen.getByText('Authentication failed.')).not.toBeNull();
    fireEvent.click(screen.getByText('Ok'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('log-in')).toBeInTheDocument();
  });

  it(`should display an success message if the authentication operation was successful`, async () => {
    const { wrapper } = TestingContainer();
    render(<EmailAuthentication token="VALID-CONFIRMATION-TOKEN" />, { wrapper });

    await screen.findByText('Ok');

    expect(screen.getByText('Your account has been confirmed. You can now log in.')).not.toBeNull();
    fireEvent.click(screen.getByText('Ok'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('log-in')).toBeInTheDocument();
  });
})