import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { ResetPasswordMessage } from "./reset-password-message";

describe(`ResetPasswordMessage`, () => {
  it(`should open the log-in page if the user clicks the 'Ok' button`, async () => {
    const { wrapper } = TestingContainer();
    render(<ResetPasswordMessage message="message" />, { wrapper });

    fireEvent.click(screen.getAllByText('Ok')[0]);

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(await screen.findByText('log-in')).toBeInTheDocument();
  })
})