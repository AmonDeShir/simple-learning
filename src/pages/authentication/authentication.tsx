import backgroundImage from '../../assets/background.jpg';
import Navigation, { Route } from 'animated-router-react';
import { Box, makeStyles } from "@material-ui/core";
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

const useStyles = makeStyles({
  BackgroundBox: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
});

export const Authentication = () => {
  const classes = useStyles();

  return ( 
    <Box
      className={classes.BackgroundBox}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Navigation>
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
    </Box>
  )
} 