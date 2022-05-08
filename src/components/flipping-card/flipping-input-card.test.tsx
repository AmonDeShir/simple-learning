import { fireEvent, render, screen } from "@testing-library/react";
import * as AudioIcon from "../audio-icon/audio-icon";
import { mockAudio, MockAudio } from "../../utils/mocks/audio-mock";
import { mockTimeline, MockTimeline } from "../../utils/mocks/gsap-timeline-mock";
import { act } from "react-dom/test-utils";
import { FlippingInputCard } from "./flipping-input-card";

const data = {
  id: '',
  inGameId: '',
  text: 'question',
  translation: 'title',
  audio: 'audio',
  invert: false,
  mode: 'speller' as 'speller',
}

describe(`FlippingInputCard`, () => {
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

  it(`should render the card data`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);
   
    const textbox = screen.getByTestId('flipping-input-card-textbox');

    expect(screen.getByTestId('card-front')).toContainElement(textbox);
    expect(screen.getByTestId('card-front')).toContainElement(screen.getAllByText('Title')[0]);
    expect(screen.getByTestId('card-front')).toContainElement(screen.getAllByText('AudioIcon')[0]);

    expect(screen.getByTestId('card-back')).toBeInTheDocument();
    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('Title')[1]);
    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('AudioIcon')[1]);
  });

  it(`should render the inverted card data`, () => {
    render(<FlippingInputCard data={{...data, invert: true}} onAnswer={() => {}}/>);
   
    const textbox = screen.getByTestId('flipping-input-card-textbox');

    expect(screen.getByTestId('card-front')).toContainElement(textbox);
    expect(screen.getByTestId('card-front')).toContainElement(screen.getAllByText('Question')[0]);
    expect(screen.getByTestId('card-front')).toContainElement(screen.getAllByText('AudioIcon')[0]);

    expect(screen.getByTestId('card-back')).toBeInTheDocument();
    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('Question')[1]);
    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('AudioIcon')[1]);
  });

  it(`shouldn't show an audio icon on the front side of the card if the data's mode is 'writing'`, () => {
    render(<FlippingInputCard data={{...data, mode: 'writing' }} onAnswer={() => {}}/>);

    expect(screen.getAllByText('AudioIcon').length).toEqual(1);
    const icon = screen.getAllByText('AudioIcon')[0];

    expect(screen.getByTestId('card-front')).not.toContainElement(icon);
    expect(screen.getByTestId('card-back')).toContainElement(icon);
  });

  it(`shouldn't show an audio icon if the data's audio is undefined`, () => {
    render(<FlippingInputCard data={{...data, audio: undefined }} onAnswer={() => {}}/>);
    expect(screen.queryByText('AudioIcon')).not.toBeInTheDocument();
  });

  it(`should play an audio track from the data after render`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    expect(audio.play).toBeCalledTimes(1);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`shouldn't play an audio track from the data after render if it's an inverted card`, () => {
    render(<FlippingInputCard data={{...data, invert: true }} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    expect(audio.play).not.toBeCalled();
  });

  it(`shouldn't play an audio track from the data after render if it's an writing card`, () => {
    render(<FlippingInputCard data={{...data, mode: 'writing' }} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    expect(audio.play).not.toBeCalled();
  });

  it(`should play an audio track if card was flipped to the back side`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);

    expect(audio.play).toBeCalledTimes(2);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`shouldn't play an audio track if card was flipped to the back side and it's an inverted card`, () => {
    render(<FlippingInputCard data={{...data, invert: true}} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);

    expect(audio.play).toBeCalledTimes(0);
  });

  it(`should play an audio track if card was flipped to the back side and it is an writing card`, () => {
    render(<FlippingInputCard data={{...data, mode: "writing" }} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);

    expect(audio.play).toBeCalledTimes(1);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`should play an audio track if card was flipped to the front side`,  () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(audio.play).toBeCalledTimes(3);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`should play an audio track if card was flipped to the front side and it's an writing card`, () => {
    render(<FlippingInputCard data={{...data, mode: 'writing'}} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(audio.play).toBeCalledTimes(1);
    expect(audio.play).toBeCalledWith(data.audio);
  });

  it(`shouldn't play an audio track if card was flipped to the front side and it's an inverted card`, () => {
    render(<FlippingInputCard data={{...data, invert: true }} onAnswer={() => {}}/>);
    act(() => { audio.loaded() });

    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(audio.play).toBeCalledTimes(0);
  });

  it(`should compare the input value with the data's text and display the result on the card's back side`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'question' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);

    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('q'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('u'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('e'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('s'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('t'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('i'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('o'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('n'));
  });

  it(`should compare the input value with the data's translation and display the result on the card's back side if it's an inverted card`, () => {
    render(<FlippingInputCard data={{...data, invert: true}} onAnswer={() => {}}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'title' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);

    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('t')[0]);
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('i'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getAllByText('t')[1]);
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('l'));
    expect(screen.getByTestId('card-back')).toContainElement(screen.getByText('e'));
  });

  it(`should call the onAnswer function if the answer button was clicked and the input value is equal to the data's text`, () => {
    const onAnswer = jest.fn();
    render(<FlippingInputCard data={data} onAnswer={onAnswer}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'question' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(onAnswer).toBeCalledTimes(1);
    expect(onAnswer).toBeCalledWith(1);
  });

  it(`should call the onAnswer function if the answer button was clicked and the card is inverted and the input value is equal to the data's translation`, () => {
    const onAnswer = jest.fn();
    render(<FlippingInputCard data={{...data, invert: true}} onAnswer={onAnswer}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'title' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(onAnswer).toBeCalledTimes(1);
    expect(onAnswer).toBeCalledWith(1);
  });

  it(`should give the first answer as the onResult argument if the answer button was clicked and the user corrects their answer`, () => {
    const onAnswer = jest.fn();
    render(<FlippingInputCard data={data} onAnswer={onAnswer}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'wrong answer' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(screen.getByText('Copy: Question')).toBeInTheDocument();

    fireEvent.change(textbox, { target: { value: 'question' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(onAnswer).toBeCalledTimes(1);
    expect(onAnswer).toBeCalledWith(0.08333333333333333);
  });

  it(`should display an error message if the answer button was clicked and the input value is not equal to the data's text`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'wrong answer' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(screen.getByTestId('card-front')).toContainElement(screen.getByText('Copy: Question'));
  });

  it(`should display an error message if the answer button was clicked and the card is inverted and the input value is not equal to the data's translation`, () => {
    render(<FlippingInputCard data={{...data, invert: true}} onAnswer={() => {}}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'wrong answer' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(screen.getByTestId('card-front')).toContainElement(screen.getByText('Copy: Title'));
  });

  it(`should hide the error message if the wrong answer was corrected`, () => {
    render(<FlippingInputCard data={data} onAnswer={() => {}}/>);

    const textbox = screen.getByTestId('flipping-input-card-textbox');

    fireEvent.change(textbox, { target: { value: 'wrong answer' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(screen.getByText('Copy: Question')).toBeInTheDocument();

    fireEvent.change(textbox, { target: { value: 'question' } });
    fireEvent.click(screen.getAllByText('Answer')[1]);
    fireEvent.click(screen.getAllByTestId('card')[1]);

    expect(screen.queryByText('Copy: Question')).not.toBeInTheDocument();
  });
});