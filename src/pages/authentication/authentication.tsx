import backgroundImage from '../../assets/background.jpg';
import { Box, styled } from "@mui/material";
import { LogIn } from "./log-in/log-in";
import { Register } from "./register/register/register";
import { ResetPasswordMessage } from "./reset-password/reset-password-message/reset-password-message";
import { ReceiveEmail } from "./reset-password/receive-email/receive-email";
import { ResetPassword } from "./reset-password/reset-password/reset-password";
import { SendEmail } from "./reset-password/send-email/send-email";
import { UseWithoutAccount } from "./use-without-account/use-without-account";
import { EmailAuthentication } from './register/email-authentication/email-authentication';
import { SlideUpdate } from '../../components/slide-update/slide-update';
import { useParams } from 'react-router-dom';


const Background = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

export const Authentication = () => {
  const { page = "/use-without-account", argument = "" } = useParams();
  
  const selectPage = () => {
    switch (page) {
      case "use-without-account":
        return <UseWithoutAccount />;

      case "log-in":
        return <LogIn />;

      case "register":
        return <Register />;

      case "reset-password":
        return <ResetPassword token={argument} />;

      case "receive-email":
        return <ReceiveEmail />;

      case "send-email":
        return <SendEmail />;

      case "reset-password-message":
        return <ResetPasswordMessage message={argument} />;

      case "email-authentication":
        return <EmailAuthentication token={argument} />;

      default: 
        return <UseWithoutAccount />;
    }
  }

  return (
    <Background>
      <SlideUpdate id={`${page}-${argument}`}>
        { selectPage() }
      </SlideUpdate>
    </Background>
  );
}