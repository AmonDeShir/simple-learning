import { fireEvent, render, screen } from "@testing-library/react";
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
});