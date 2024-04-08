import { Autocomplete, CardContent } from "@mui/material";
import { StandardTextField } from "../styles/styles";

export type LanguageOption = "Polish" | "English" | "Interslavic";
const options: readonly LanguageOption[] = ["Polish", "English", "Interslavic"];

export type Props = {
  from?: LanguageOption,
  to?: LanguageOption,
  onChange?: (from?: LanguageOption, to?: LanguageOption) => void;
}

export const SearchMenu = ({
  from = undefined,
  to = undefined,
  onChange
}: Props) => {
  return (
    <CardContent>
      <Autocomplete
        autoHighlight
        options={options}
        value={from}
        onChange={(_, value) => onChange!(value ?? undefined, to)}
        renderInput={(params => (
          <StandardTextField 
            {...params}
            label="Translate from: "
            variant="standard"
            color="primary"
            sx={{ marginBottom: "10px" }}
            inputProps={{
              ...params.inputProps,
              autoComplete: "off",
              "data-testid": "search-menu-from"
            }}
          />
        ))}
      />

      <Autocomplete 
        autoHighlight
        options={options}
        value={to}
        onChange={(_, value) => onChange!(from, value ?? undefined)}
        renderInput={(params => (
          <StandardTextField
            {...params}
            variant="standard"
            color="primary"
            label="Translate to: "
            inputProps={{
              ...params.inputProps,
              autoComplete: "off",
              "data-testid": "search-menu-to"
            }}
          />
        ))}
      />
    </CardContent>
  );
} 