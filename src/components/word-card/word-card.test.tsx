import { render, screen } from "@testing-library/react";
import { WordCard } from "./word-card";
import * as AudioIcon from "../audio-icon/audio-icon";

const data = {
  word: 'word',
  meaning: 'meaning',
  audio: 'audio',
  firstExample: {
    example: 'example 1',
    translation: 'translation 1',
    audio: 'audio 1',
  },
  secondExample: {
    example: 'example 2',
    translation: 'translation 2',
    audio: 'audio 2',
  },
}

describe('WordCard', () => {
  const origin = AudioIcon.AudioIcon;

  beforeAll(() => {
    (AudioIcon as any).AudioIcon = (props: any) => <div {...props}>{props.src}</div>;
  });

  afterAll(() => {
    (AudioIcon as any).AudioIcon = origin;
  });

  it(`should render the card's title and the translation from the data`, () => {
    render(<WordCard data={data} />);

    expect(screen.getByText(data.word)).toBeInTheDocument();
    expect(screen.getByText(data.meaning)).toBeInTheDocument();
  });

  it(`should render the audio icon if the data has audio`, () => {
    render(<WordCard data={data} />);

    expect(screen.getByText('audio')).toBeInTheDocument();
  });

  it(`shouldn't render the audio icon if the data doesn't have audio`, () => {
    render(<WordCard data={{...data, audio: undefined }} />);

    expect(screen.queryByText('audio')).not.toBeInTheDocument();
  });

  it(`should render examples if the data has examples`, () => {
    render(<WordCard data={data} />);

    expect(screen.getByText('example 1')).toBeInTheDocument();
    expect(screen.getByText('translation 1')).toBeInTheDocument();
    expect(screen.getByText('audio 1')).toBeInTheDocument();

    expect(screen.getByText('example 2')).toBeInTheDocument();
    expect(screen.getByText('translation 2')).toBeInTheDocument();
    expect(screen.getByText('audio 2')).toBeInTheDocument();
  });

  it(`shouldn't render examples if the data hasn't examples`, () => {
    render(<WordCard data={{...data, firstExample: undefined, secondExample: undefined }} />);

    expect(screen.queryByText('example 1')).not.toBeInTheDocument();
    expect(screen.queryByText('translation 1')).not.toBeInTheDocument();
    expect(screen.queryByText('audio 1')).not.toBeInTheDocument();

    expect(screen.queryByText('example 2')).not.toBeInTheDocument();
    expect(screen.queryByText('translation 2')).not.toBeInTheDocument();
    expect(screen.queryByText('audio 2')).not.toBeInTheDocument();
  });

  it(`shouldn't render the first example if it is undefined`, () => {
    render(<WordCard data={{...data, firstExample: undefined }} />);

    expect(screen.queryByText('example 1')).not.toBeInTheDocument();
    expect(screen.queryByText('translation 1')).not.toBeInTheDocument();
    expect(screen.queryByText('audio 1')).not.toBeInTheDocument();

    expect(screen.getByText('example 2')).toBeInTheDocument();
    expect(screen.getByText('translation 2')).toBeInTheDocument();
    expect(screen.getByText('audio 2')).toBeInTheDocument();
  });

  it(`shouldn't render the second example if it is undefined`, () => {
    render(<WordCard data={{...data, secondExample: undefined }} />);

    expect(screen.getByText('example 1')).toBeInTheDocument();
    expect(screen.getByText('translation 1')).toBeInTheDocument();
    expect(screen.getByText('audio 1')).toBeInTheDocument();

    expect(screen.queryByText('example 2')).not.toBeInTheDocument();
    expect(screen.queryByText('translation 2')).not.toBeInTheDocument();
    expect(screen.queryByText('audio 2')).not.toBeInTheDocument();
  });

  it(`shouldn't render the example audio icon if the example doesn't have audio`, () => {
    render(<WordCard data={{
      ...data, 
      firstExample: {...data.firstExample, audio: undefined },
      secondExample: {...data.secondExample, audio: undefined }
    }} />);

    expect(screen.queryByText('audio 1')).not.toBeInTheDocument();
    expect(screen.queryByText('audio 2')).not.toBeInTheDocument();
  });

  it(`should render icons from the icons property`, () => {
    render(<WordCard data={data} icons={[
      <div key="a1">icon 1</div>,
      <div key="a2">icon 2</div>,
    ]} />);

    expect(screen.getByText('icon 1')).toBeInTheDocument();
    expect(screen.getByText('icon 2')).toBeInTheDocument();
  })
});