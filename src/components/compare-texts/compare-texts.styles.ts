import { styled } from "@mui/material";

export const RemoveMark = styled('mark')`
  color: black;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
  text-decoration-color: white;
  font-weight: bold;
  background: none;
`;

export const AddMark = styled('mark')`
  color: black;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-decoration-color: white;
  font-weight: bold;
  background: none;
`;

export const ReplaceMark = styled('mark')`
  color: black;
  font-weight: bold;
  background: none;
`;

export const NoneMark = styled('mark')`
  color: white;
  background: none;
`;