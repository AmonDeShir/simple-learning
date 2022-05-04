import axios from 'axios';
import { render, screen, fireEvent } from "@testing-library/react";
import { TestingContainer } from "../testing-container";
import { LogIn } from "./log-in";

describe(`log-in`, () => {
  const axiosGetOrigin = axios.get;
  let axiosGetSpy: jest.SpyInstance;
  
  beforeAll(() => {
    axiosGetSpy = jest.spyOn(axios, 'get');
  })

  beforeEach(() => {
    axiosGetSpy.mockReset();
    axiosGetSpy.mockImplementation(axiosGetOrigin);
  });

  afterAll(() => {
    axiosGetSpy.mockRestore();
  });

  describe(`routing`, () => {
    it(`should open the registration page if the user clicks the 'Click here to register' link`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      fireEvent.click(screen.getAllByText('Click here')[0]);

      expect(await screen.findByText('Register page')).toBeInTheDocument();
    });

    it(`should open the password reset page if the user clicks the 'Click here to reset it' link`, async () => {
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      fireEvent.click(screen.getAllByText('Click here')[1]);

      expect(await screen.findByText('Send email page')).toBeInTheDocument();
    })
  })
  
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

    it(`should display the 'Logging in failed' text if the request is canceled by the abortController`, () => {
      axiosGetSpy.mockRejectedValueOnce({
        message: 'canceled'
      });
      
      const { wrapper } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'invalidWithoutJson@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Log in'));

      expect(screen.queryByText('Logging in failed')).not.toBeInTheDocument();
    });


    it(`should open the app page after successful login`, async () => {
      const { wrapper, reduxActions } = TestingContainer();
      render(<LogIn />, { wrapper });

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'success@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Log in'));
      await screen.findByText('Main Page');

      expect(screen.getByText('Main Page')).toBeInTheDocument();

      expect(reduxActions['user/setUserData'].payload).toEqual({
        name: "TestUser",
        sync: true,
      });

      expect(reduxActions['user/hideLoginPage']).toEqual({
        type: 'user/hideLoginPage',
      });
    })
  })
})