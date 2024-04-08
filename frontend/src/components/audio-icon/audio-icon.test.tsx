import * as AudiotrackIcon from '@mui/icons-material/AudiotrackOutlined';
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAudio, MockAudio } from '../../utils/mocks/audio-mock';
import { mockIcon, MockIcon } from '../../utils/mocks/icon-mock';
import { AudioIcon } from "./audio-icon";

describe('AudioIcon', () => {
  let audio: MockAudio;
  let audiotrackIcon: MockIcon;

  beforeAll(() => {
    audio = mockAudio();
    audiotrackIcon = mockIcon(AudiotrackIcon, 'icon');
  });

  beforeEach(() => {
    audio.mockClear();
  });

  afterAll(() => {
    audio.mockRestore();
    audiotrackIcon.mockRestore();
  });
  
  it(`should play the audio track from the component's src parameter`, () => {
    render(<AudioIcon src="/test-audio" />);
    act(() => audio.loaded());

    fireEvent.click(screen.getByText('icon'));

    expect(audio.play).toBeCalledWith('/test-audio');
    expect(audio.play).toBeCalledTimes(1);
  });

  it(`shouldn't play the audio if it wasn't loaded`, async () => {
    render(<AudioIcon src="/test-audio" />);

    fireEvent.click(screen.getByText('icon'));
    expect(audio.play).toBeCalledTimes(0);

    act(() => audio.loaded());
    fireEvent.click(screen.getByText('icon'));
    expect(audio.play).toBeCalledTimes(1);
  });

  it(`should pause the audio if it's playing and the component is unmounted`, async () => {
    const { unmount } = render(<AudioIcon src="/test-audio" />);
    act(() => audio.loaded());

    fireEvent.click(screen.getByText('icon'));

    await waitFor(() => expect(audio.play).toBeCalledTimes(1))

    unmount();
    expect(audio.pause).toBeCalledTimes(1);
  });
});