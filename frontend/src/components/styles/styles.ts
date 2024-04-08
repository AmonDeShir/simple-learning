import backgroundImage from '../../assets/background.jpg';
import { styled } from '@mui/material/styles';
import { TextField as MaterialTextField, Typography, Box, Button as MaterialButton } from "@mui/material";

export const TextField = styled(MaterialTextField)`
  box-sizing: border-box;
  height: 40px;
  font-size: 0.875rem;

  & input {
    height: 40px;
    box-sizing: border-box;
  }

  & label:not(.MuiFormLabel-filled):not(.Mui-focused) {
    transform: translate(14px, 7px) scale(1);
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
      border-width: 0.2em;
    }

    &:hover fieldset {
      border-color: ${({ theme }) => theme.palette.primary.light};
    }

    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
      border-width: 0.2em;
    }
  }
`;

export const StandardTextField = styled(MaterialTextField)`
    & .MuiFormLabel-root {
      color: ${({ theme, error }) => error ? 'red' : theme.palette.primary.main};
    }

    & .MuiInput-underline {
      &:hover {
        &::before {
          border-width: 0.2em;
          border-color: ${({ theme, error }) => error ? 'red' : theme.palette.primary.main};
        }
      }

      &::before {
        border-color: ${({ theme, error }) => error ? 'red' : theme.palette.primary.main};
        border-width: 0.15em;
      }

      &::after {
        border-width: 0.2em;
      }
    }
`;

export const Link = styled(Typography)`
  cursor: pointer;
`;

export const BackgroundBox = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

export const Button = styled(MaterialButton)`
  min-width: 120px;
  padding-top: 10px;
  height: 40px;
  line-height: 40px;
`;

export const SquareButton = styled(MaterialButton)<{ items: number }>`
  --size: ${({ items }) => 90 / items}vw;

  width: calc(var(--size) - 10px);
  height: calc(var(--size) - 10px);
  max-width: 125px;
  max-height: 125px;
  margin: 5px;
  padding: 2px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;

  & span {
    max-width: calc(var(--size) - 10px);
    max-height: calc(var(--size) - 10px);
  }
`;