import { fireEvent, render, screen } from "@testing-library/react";
import { FlippingCard } from "./flipping-card";
import * as AudioIcon from "../audio-icon/audio-icon";
import { mockAudio, MockAudio } from "../../utils/mocks/audio-mock";
import { mockTimeline, MockTimeline } from "../../utils/mocks/gsap-timeline-mock";
import { act } from "react-dom/test-utils";

const data = {
  id: '',
  inGameId: '',
  text: 'front',
  translation: 'back',
  audio: 'audio',
  invert: false,
  mode: 'flashcard' as 'flashcard',
}

describe(`FlippingCard`, () => {
  const origin = AudioIcon.AudioIcon;
  let audio: MockAudio;
  let tl: MockTimeline

  beforeAll(() => {
    (AudioIcon as any).AudioIcon = () => <div>AudioIcon</div>;
    audio = mockAudio();
    tl = mockTimeline();
  });

  beforeEach(() => {
    audio.mockClear();
    tl.mockClear();
  });

  afterAll(() => {
    (AudioIcon as any).AudioIcon = origin;
    audio.mockRestore();
    tl.mockRestore();
  });

  it(`should render an empty card`, () => {
    render(<FlippingCard onFlip={() => {}}/>);

    expect(screen.getByTestId('card-front')).toBeInTheDocument();
    expect(screen.getByTestId('card-back')).toBeInTheDocument();

    expect(screen.queryByText('AudioIcon')).not.toBeInTheDocument();
  });

  it(`should render the card data`, () => {
    render(<FlippingCard data={data} onFlip={() => {}}/>);

    expect(screen.getByTestId('card-front')).toContainElement(screen.getByText('Front'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('Back'));

    expect(screen.getByTestId('card-front')).toContainElement(screen.getByText('AudioIcon'));
    expect(screen.getByTestId('card-back')).not.toContainElement(screen.getByText('AudioIcon'));
  });

  it(`should render the inverted card data`, () => {
    render(<FlippingCard data={{...data, invert: true }} onFlip={() => {}}/>);

    expect(screen.getByTestId('card-front')).toContainElement(screen.getByText('Back'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('Front'));

    expect(screen.getByTestId('card-front')).not.toContainElement(screen.getByText('AudioIcon'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('AudioIcon'));
  });

  it(`should call the parameter's onFlip function`, () => {
    const onFlip = jest.fn();
    render(<FlippingCard data={data} onFlip={onFlip}/>);

    fireEvent.click(screen.getByText('Front'));

    expect(onFlip).toBeCalledTimes(1);
    expect(onFlip).toBeCalledWith('back');

    fireEvent.click(screen.getByText('Back'));

    expect(onFlip).toBeCalledTimes(2);
    expect(onFlip).toBeCalledWith('front');
  });

  it(`should play an audio track from the data after render`, () => {
    render(<FlippingCard data={data} onFlip={() => {}}/>);
    act(() => { audio.loaded() });

    expect(audio.play).toBeCalledTimes(1);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`shouldn't play an audio track from the data after render if it's an inverted card`, () => {
    render(<FlippingCard data={{...data, invert: true }} onFlip={() => {}}/>);
    act(() => { audio.loaded() });

    expect(audio.play).not.toBeCalled();
  });

  it(`should play an audio track if card was flipped to the back side`, () => {
    render(<FlippingCard data={data} onFlip={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getByText('Front'));

    expect(audio.play).toBeCalledTimes(2);
    expect(audio.play).toBeCalledWith(data.audio);
  });
});