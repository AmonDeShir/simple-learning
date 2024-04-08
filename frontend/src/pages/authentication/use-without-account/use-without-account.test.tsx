import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../../utils/test-utils/testing-container";
import { UseWithoutAccount } from "./use-without-account";

describe('UseWithoutAccount', () => {
  it(`should open the 'log-in' page if the user clicks 'Log in' button`, async () => {
    const { wrapper } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Log in'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('log-in')).toBeInTheDocument();
  });

  it(`should open the 'register' page if the user clicks 'Register' button`, async () => {
    const { wrapper } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Register'));

    expect(await screen.findByText('Auth page')).toBeInTheDocument();
    expect(screen.getByText('register')).toBeInTheDocument();
  });

  it(`should open app if the user clicks 'Use without account' button`, async () => {
    const { wrapper, reduxActions } = TestingContainer();
    render(<UseWithoutAccount />, { wrapper });

    fireEvent.click(screen.getByText('Use without account'));

    expect(await screen.findByText('Main Page')).toBeInTheDocument();

    expect(reduxActions['user/setUserData'].payload).toEqual({
      name: "Anonymous",
      sync: false,
    });
  });

  describe(`automatic log in`, () => {
    it(`should automatically log in the user if there is a cookie with a valid refresh token in the user's browser`, async () => {
      const { wrapper, reduxActions } = TestingContainer();
      await fetch('/api/v1/auth/create-refresh-token', { method: 'POST' });
      
      render(<UseWithoutAccount />, { wrapper });

      expect(await screen.findByText('Main Page')).toBeInTheDocument();

      expect(reduxActions['user/setUserData'].payload).toEqual({
        name: "TestUser",
        sync: true,
      });
    });

    it(`should automatically log in the user if there is a cookie with a valid locally token in the user's browser`, async () => {
      const { wrapper, reduxActions } = TestingContainer();
      await fetch('/api/v1/auth/create-locally-token', { method: 'POST' });
      
      render(<UseWithoutAccount />, { wrapper });

      expect(await screen.findByText('Main Page')).toBeInTheDocument();

      expect(reduxActions['user/setUserData'].payload).toEqual({
        name: "Anonymous",
        sync: false,
      });
    })

    it(`shouldn't automatically log in the user if there isn't a cookie with a valid locally or refresh token in the user's browser`, async () => {
      const { wrapper, reduxActions } = TestingContainer();
      await fetch('/api/v1/auth/log-out', { method: 'POST' });

      render(<UseWithoutAccount />, { wrapper });
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(reduxActions['user/setUserData']).toBeUndefined();
    });
  });
})