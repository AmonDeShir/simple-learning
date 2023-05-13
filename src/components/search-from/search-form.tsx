import { FormEvent, useState } from "react";
import { InputWithMenu } from "../input-with-menu/input-with-menu";
import { LanguageOption, SearchMenu } from "../search-menu/serach-menu";
import { Button, TextField } from "../styles/styles";
import { Container, SecondContainer, Title } from "./search-form.styles";

export type Props = {
  title?: string;
  label?: string;
  defaultValue?: string;
  onSubmit: (value: string, from?: LanguageOption, to?: LanguageOption) => void;
}

export const SearchFrom = ({ 
  title,
  label,
  defaultValue = '',
  onSubmit
}: Props) => {
  const [search, setSearch] = useState(defaultValue);
  const [from, setFrom] = useState<LanguageOption | undefined>(window.localStorage.getItem('search-from-from') as LanguageOption ?? undefined);
  const [to, setTo] = useState<LanguageOption | undefined>(window.localStorage.getItem('search-from-to') as LanguageOption ?? undefined);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (search.length > 0) {
      onSubmit(search, from, to);
    }
  }

  const updateSavedSetting = (item: string, value?: LanguageOption) => {
    if(value) {
      window.localStorage.setItem(item, value);
    }
    else {
      window.localStorage.removeItem(item);
    }
  }

  const handleSearchMenuChange = (newFrom?: LanguageOption, newTo?: LanguageOption) => {
    if (newFrom != from) {
      setFrom(newFrom);
      updateSavedSetting('search-from-from', newFrom);
    }

    if (newTo != to) {
      setTo(newTo);
      updateSavedSetting('search-from-to', newTo);
    }
  } 

  return (
    <Container>
      { title && <Title align="center" variant="h6">{title}</Title> }

      <form onSubmit={submitHandler}>
        <SecondContainer>
          <InputWithMenu width="calc(100% - 130px)" menu={<SearchMenu from={from} to={to} onChange={handleSearchMenuChange} />}>
            <TextField
              style={{ width: '100%' }}
              type="text"
              label={label}
              variant="outlined"
              color="primary"
              fullWidth
              inputProps={{ "data-testid": "search-text-field" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputWithMenu>

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