import { Box, styled } from "@mui/material";

export const Container = styled(Box)<{ noBackground?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px 10px 20px 10px;
  background-color: ${({ noBackground }) => noBackground ? "transparent" : "#F6F7FB"};
  box-shadow: ${({ noBackground }) => noBackground ? "none" : "inset 0px 4px 8px 4px rgba(0, 0, 0, 0.05)"};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }

  @media(min-width: 1024px) {
    padding: 10px calc(50% - 500px);
  }
`;
