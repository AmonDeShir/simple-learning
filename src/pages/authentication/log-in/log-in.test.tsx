import { render, screen, fireEvent } from "@testing-library/react";
import { TestingContainer } from "../testing-container";
import { LogIn } from "./log-in";

describe(`log-in`, () => {
  describe(`routing`, () => {
    it(`should open the registration page if the user clicks the 'Click here to register' link`, () => {
      const { navigationActions, wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      fireEvent.click(screen.getAllByText('Click here')[0]);

      expect(navigationActions['SELECT'].payload).toEqual({
        path: "/register",
        updateHistory: true,
      });
    });

    it(`should open the password reset page if the user clicks the 'Click here to reset it' link`, () => {
      const { navigationActions, wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      fireEvent.click(screen.getAllByText('Click here')[1]);

      expect(navigationActions['SELECT'].payload).toEqual({
        path: "/send-email",
        updateHistory: true,
      });
    })
  })

  describe(`automatic login`, () => {
    it(`should automatically log in the user if there is a cookie with a valid refresh token in the user's browser`, async () => {
      const { wrapper, navigationActions, reduxActions } = TestingContainer();
      await fetch('/api/v1/auth/create-refresh-token', { method: 'POST' });
      
      render(<LogIn />, { wrapper });
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(navigationActions['SELECT'].payload).toEqual({
        path: "/",
        updateHistory: true,
      });

      expect(reduxActions['user/setUserData'].payload).toEqual({
        email: "test@example.com",
        name: "TestUser",
        synchronize: true,
      });

      expect(reduxActions['user/hideLoginPage']).toEqual({
        type: 'user/hideLoginPage',
      });
    })

    it(`shouldn't automatically log in the user if there isn't a cookie with a valid refresh token in the user's browser`, async () => {
      const { wrapper, navigationActions, reduxActions } = TestingContainer();
      await fetch('/api/v1/auth/log-out', { method: 'POST' });

      render(<LogIn />, { wrapper });
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(navigationActions['SELECT']).toBeUndefined();
      expect(reduxActions['user/setUserData']).toBeUndefined();
      expect(reduxActions['user/hideLoginPage']).toBeUndefined();
    });
  });
  
  describe('log-in', () => {
    it(`should display an error if the email textfield is empty`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: '' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      
      fireEvent.click(screen.getByText('Log in'));
      
      expect(await screen.findByText('Please enter email and password')).toBeInTheDocument();
    });

    it(`should display an error if the password textfield is empty`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'email' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: '' }});

      fireEvent.click(screen.getByText('Log in'));

      expect(await screen.findByText('Please enter email and password')).toBeInTheDocument();
    });

    it(`should display an error if the login operation was unsuccessful`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'email' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Log in'));

      expect(await screen.findByText('Wrong login or password')).toBeInTheDocument();
    });

    it(`should display the 'Logging in failed' text as any error text if the result of the login operation is invalid`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'invalidWithoutJson@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Log in'));

      expect(await screen.findByText('Logging in failed')).toBeInTheDocument();
    });

    it(`should open the app page after successful login`, async () => {
      const { wrapper, navigationActions, reduxActions } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'success@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Log in'));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(navigationActions['SELECT'].payload).toEqual({
        path: "/",
        updateHistory: true,
      });

      expect(reduxActions['user/setUserData'].payload).toEqual({
        email: "test@example.com",
        name: "TestUser",
        synchronize: true,
      });

      expect(reduxActions['user/hideLoginPage']).toEqual({
        type: 'user/hideLoginPage',
      });
    })
  })
})