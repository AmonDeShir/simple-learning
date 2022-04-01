import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../testing-container";
import { UseWithoutAccount } from "./use-without-account";

describe('UseWithoutAccount', () => {
  it(`should open the 'log-in' page if the user clicks 'Log in' button`, async () => {
    const { wrapper, navigationActions } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Log in'));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/log-in",
      updateHistory: true,
    });
  });

  it(`should open the 'register' page if the user clicks 'Register' button`, async () => {
    const { wrapper, navigationActions } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Register'));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/register",
      updateHistory: true,
    });
  });

  it(`should open app if the user clicks 'Use without account' button`, async () => {
    const { wrapper, reduxActions } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Use without account'));

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(reduxActions['user/hideLoginPage']).toEqual({
      type: "user/hideLoginPage",
    });
  });
})