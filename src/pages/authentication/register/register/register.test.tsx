import axios from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TestingContainer } from "../../testing-container";
import { Register } from "./register";

describe(`register`, () => {
  describe(`routing`, () => {
    it(`should open the 'log in' page if the user clicks the 'Click here to log in' link`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      fireEvent.click(screen.getAllByText('Click here')[0]);
      
      expect(await screen.findByText('Log in page')).toBeInTheDocument();
    });
  })

  describe('register', () => {
    it(`should display an error if the name textfield is empty`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: '' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'email' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Register'));
      
      expect(await screen.findByText('Please enter username, email and password')).toBeInTheDocument();
    });

    it(`should display an error if the email textfield is empty`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'name' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: '' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Register'));
      
      expect(await screen.findByText('Please enter username, email and password')).toBeInTheDocument();
    });

    it(`should display an error if the password textfield is empty`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'name' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'email' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: '' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: '' }});

      fireEvent.click(screen.getByText('Register'));

      expect(await screen.findByText('Please enter username, email and password')).toBeInTheDocument();
    });

    it(`should display an error if the repeat-password and the password are not equal`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'name' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'email' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'other password' }});

      fireEvent.click(screen.getByText('Register'));

      expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    });

    it(`should open the 'authenticate-your-email' page after successful registration`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'user' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'success@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Register'));
      await screen.findByText('Authenticate your email page');

      expect(screen.getByText('Authenticate your email page')).toBeInTheDocument();
    })

    it(`should display an error if the registration process was unsuccessful`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'user' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'user@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Register'));

      expect(await screen.findByText('User with that email already exist')).toBeInTheDocument();
    })

    it(`should display the 'Logging in failed' text as any error text if the result of the registration process is invalid`, async () => {
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'user' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'invalidWithoutJson@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'password' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'password' }});

      fireEvent.click(screen.getByText('Register'));

      expect(await screen.findByText('Registration failed')).toBeInTheDocument();
    })
  });

  describe('Import local data message box', () => {
    let axiosPostSpy: jest.SpyInstance;

    beforeAll(() => {
      axiosPostSpy = jest.spyOn(axios, 'post');
    });

    beforeEach(() => {
      axiosPostSpy.mockClear();
    });

    afterAll(() => {
      axiosPostSpy.mockRestore();
    });

    it(`should show a message box if the sync field of the refresh request data is false`, async () => {
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: false }});
      
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      await screen.findByText('Yes');
      expect(screen.getByText('Do you want to import local data into your new account?')).toBeInTheDocument();
    })

    it(`shouldn't show a message box if the sync field of the refresh request data is true`, async () => {
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: true }});
      
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(screen.queryByText('Do you want to import local data into your new account?')).not.toBeInTheDocument();
    });

    it(`shouldn't show a message box if the refresh request throw an error`, async () => {
      axiosPostSpy.mockRejectedValueOnce({
        status: 400,
        message: 'error'
      });
      
      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(screen.queryByText('Do you want to import local data into your new account?')).not.toBeInTheDocument();
    });

    it(`should send the register request with the importData field set to true if the user clicks on the 'Yes' button`, async () => {
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: false }});
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: false }});

      axiosPostSpy.mockResolvedValueOnce({
        status: 201,
        message: 'created'
      });

      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      await screen.findByText('Do you want to import local data into your new account?');
      fireEvent.click(screen.getByText('Yes'));

      await waitFor(() => expect(screen.queryByText( 'Do you want to import local data into your new account?')).not.toBeInTheDocument());
      
      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'user' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'user@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'Password01' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'Password01' }});

      fireEvent.click(screen.getByText('Register'));

      await screen.findByText('Authenticate your email page')

      expect(axiosPostSpy).toHaveBeenCalledTimes(3);
      expect(axiosPostSpy).toHaveBeenNthCalledWith(3, '/api/v1/auth/register', {
        name: 'user',
        email: 'user@example.com',
        password: 'Password01',
        importData: true
      }, expect.any(Object));
    });

    it(`should send the register request with the importData field set to false if the user clicks on other button than the 'Yes' button`, async () => {
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: false }});
      axiosPostSpy.mockResolvedValueOnce({ data: { sync: false }});

      axiosPostSpy.mockResolvedValueOnce({
        status: 201,
        message: 'created'
      });

      const { wrapper } = TestingContainer();
      render(<Register />, { wrapper });

      await screen.findByText('Do you want to import local data into your new account?');
      fireEvent.click(screen.getByText('No'));

      await waitFor(() => expect(screen.queryByText( 'Do you want to import local data into your new account?')).not.toBeInTheDocument());
      
      const name = screen.getByTestId("name-text-field");
      fireEvent.focus(name);
      fireEvent.change(name, { target: { value: 'user' }});

      const email = screen.getByTestId("email-text-field");
      fireEvent.focus(email);
      fireEvent.change(email, { target: { value: 'user@example.com' }});
      
      const password = screen.getByTestId("password-text-field");
      fireEvent.focus(password);
      fireEvent.change(password, { target: { value: 'Password01' }});

      const repeatPassword = screen.getByTestId("repeat-password-text-field");
      fireEvent.focus(repeatPassword);
      fireEvent.change(repeatPassword, { target: { value: 'Password01' }});

      fireEvent.click(screen.getByText('Register'));

      await screen.findByText('Authenticate your email page')

      expect(axiosPostSpy).toHaveBeenCalledTimes(3);
      expect(axiosPostSpy).toHaveBeenNthCalledWith(3, '/api/v1/auth/register', {
        name: 'user',
        email: 'user@example.com',
        password: 'Password01',
        importData: false
      }, expect.any(Object));
    });
  });
});