import backgroundImage from '../../assets/background.jpg';
import Navigation, { Route, useOpenPage } from 'animated-router-react';
import { Box, styled } from "@mui/material";
import { LogIn } from "./log-in/log-in";
import { AuthenticateYourEmail } from "./register/authenticate-your-email/authenticate-your-email";
import { Register } from "./register/register/register";
import { ResetPasswordMessage } from "./reset-password/reset-password-message/reset-password-message";
import { ReceiveEmail } from "./reset-password/receive-email/receive-email";
import { ResetPassword } from "./reset-password/reset-password/reset-password";
import { SendEmail } from "./reset-password/send-email/send-email";
import { UseWithoutAccount } from "./use-without-account/use-without-account";
import { enterRight, exitRight } from './animations';
import { EmailAuthentication } from './register/email-authentication/email-authentication';
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import { setPageBefore404 } from '../../redux/slices/users/user';

const Background = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

const Page404 = () => {
  const openPage = useOpenPage();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageBefore404(document.location.pathname))
    openPage('/', { updateHistory: false });
  }, [openPage, dispatch]);

  return (
    <>404</>
  )
}

export const Authentication = () => ( 
  <Background>
    <Navigation>
      <Route
        path='/404'
        component={<Page404 />}
      />

      <Route 
        path="/"
        component={<UseWithoutAccount />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/log-in"
        component={<LogIn />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />
        
      <Route 
        path="/register"
        component={<Register />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route
        path="/email-authentication"
        component={<EmailAuthentication />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/authenticate-your-email"
        component={<AuthenticateYourEmail />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/send-email"
        component={<SendEmail />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/receive-email"
        component={<ReceiveEmail />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/reset-password"
        component={<ResetPassword />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />

      <Route 
        path="/reset-password-message"
        component={<ResetPasswordMessage />}
        enterAnimation={enterRight}
        exitAnimation={exitRight}
      />
    </Navigation>
  </Background>
);