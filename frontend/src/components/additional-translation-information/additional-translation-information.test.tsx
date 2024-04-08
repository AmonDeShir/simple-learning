import { act, fireEvent, render, screen } from "@testing-library/react";
import { AdditionalTranslationInformationIcon, LanguageTable } from "./additional-translation-information";
import { MockIcon, mockIcon } from "../../utils/mocks/icon-mock";
import * as InfoIcon from '@mui/icons-material/Info';
import userEvent from "@testing-library/user-event";

const info = {
  addition: "addition",
  partOfSpeech: "part of speech",
  lang: {
    en: "en",
    ru: "ru",
    be: "be",
    uk: "uk",
    pl: "pl",
    cs: "cs",
    sk: "sk",
    bg: "bg",
    mk: "mk",
    sr: "sr",
    hr: "hr",
    sl: "sl",
  }
}

describe(`LanguageTable`, () => {
  it(`should render langauge table`, () => {
    render(<LanguageTable info={info} />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();

    expect(screen.getByText('Russian')).toBeInTheDocument();
    expect(screen.getByText('ru')).toBeInTheDocument();

    expect(screen.getByText('Belarusian')).toBeInTheDocument();
    expect(screen.getByText('be')).toBeInTheDocument();

    expect(screen.getByText('Ukrainian')).toBeInTheDocument();
    expect(screen.getByText('uk')).toBeInTheDocument();

    expect(screen.getByText('Polish')).toBeInTheDocument();
    expect(screen.getByText('pl')).toBeInTheDocument();

    expect(screen.getByText('Czech')).toBeInTheDocument();
    expect(screen.getByText('cs')).toBeInTheDocument();

    expect(screen.getByText('Slovak')).toBeInTheDocument();
    expect(screen.getByText('sk')).toBeInTheDocument();

    expect(screen.getByText('Slovene')).toBeInTheDocument();
    expect(screen.getByText('sl')).toBeInTheDocument();

    expect(screen.getByText('Croatian')).toBeInTheDocument();
    expect(screen.getByText('hr')).toBeInTheDocument();

    expect(screen.getByText('Serbian')).toBeInTheDocument();
    expect(screen.getByText('sr')).toBeInTheDocument();

    expect(screen.getByText('Macedonian')).toBeInTheDocument();
    expect(screen.getByText('mk')).toBeInTheDocument();

    expect(screen.getByText('Bulgarian')).toBeInTheDocument();
    expect(screen.getByText('bg')).toBeInTheDocument();
  });
});

describe(`AdditionalTranslationInformationIcon`, () => {
  let icon: MockIcon;

  beforeAll(() => {
    icon = mockIcon(InfoIcon, 'icon');
  });

  afterAll(() => {
    icon.mockRestore();
  });
  
  it(`shouldn't render table until icon click`, () => {
    render(<AdditionalTranslationInformationIcon info={info} />);

    expect(screen.queryByText('English')).not.toBeInTheDocument();
    expect(screen.queryByText('sk')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('icon'));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('sk')).toBeInTheDocument();
  });

  it(`should show language table when icon is clicked`, () => {
    render(<AdditionalTranslationInformationIcon info={info} />);

    fireEvent.click(screen.getByText('icon'));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();

    expect(screen.getByText('Slovak')).toBeInTheDocument();
    expect(screen.getByText('sk')).toBeInTheDocument();

    expect(screen.getByText('Bulgarian')).toBeInTheDocument();
    expect(screen.getByText('bg')).toBeInTheDocument();
  });

  it(`should hide language table when table is double clicked`, async () => {
    render(<AdditionalTranslationInformationIcon info={info} />);

    fireEvent.click(screen.getByText('icon'));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();

    expect(screen.getByText('Slovak')).toBeInTheDocument();
    expect(screen.getByText('sk')).toBeInTheDocument();

    expect(screen.getByText('Bulgarian')).toBeInTheDocument();
    expect(screen.getByText('bg')).toBeInTheDocument();

    userEvent.dblClick(screen.getByText('Bulgarian'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 500));
    });

    expect(screen.queryByText('English')).not.toBeInTheDocument();
    expect(screen.queryByText('en')).not.toBeInTheDocument();

    expect(screen.queryByText('Slovak')).not.toBeInTheDocument();
    expect(screen.queryByText('sk')).not.toBeInTheDocument();

    expect(screen.queryByText('Bulgarian')).not.toBeInTheDocument();
    expect(screen.queryByText('bg')).not.toBeInTheDocument();
  });
});