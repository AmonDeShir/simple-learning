import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../testing-container";
import { ResetPasswordMessage } from "./reset-password-message";

describe(`ResetPasswordMessage`, () => {
  it(`should open the log-in page if the user clicks the 'Ok' button`, () => {
    const { navigationActions, wrapper } = TestingContainer();
    render(<ResetPasswordMessage />, { wrapper });

    fireEvent.click(screen.getAllByText('Ok')[0]);

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/log-in",
      updateHistory: true,
    });
  })
})