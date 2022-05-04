import { Box, styled } from "@mui/material";

export const Container = styled(Box)`
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
padding: 0 10%;
max-width: 800px;
width: 90%;

${({ theme }) => theme.breakpoints.up('md')} {
  padding: 0 100px;
}
`;