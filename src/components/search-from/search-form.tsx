import { FormEvent, useState } from "react";
import { Button, TextField } from "../styles/styles";
import { Container, SecondContainer, Title } from "./search-form.styles";

export type Props = {
  title?: string;
  label?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
}

export const SearchFrom = ({ 
  title,
  label,
  defaultValue = '',
  onSubmit
}: Props) => {
  const [search, setSearch] = useState(defaultValue);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (search.length > 0) {
      onSubmit(search);
    }
  }

  return (
    <Container>
      { title && <Title align="center" variant="h6">{title}</Title> }

      <form onSubmit={submitHandler}>
        <SecondContainer>
          <TextField
            style={{ width: 'calc(100% - 130px)' }}
            type="text"
            label={label}
            variant="outlined"
            color="primary"
            fullWidth
            inputProps={{ "data-testid": "search-text-field" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            type="submit"
            color="primary"
            variant="contained"
          >Search</Button>
        </SecondContainer>
      </form>
    </Container>
  );
}