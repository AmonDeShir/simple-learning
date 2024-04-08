import { act, renderHook } from "@testing-library/react-hooks";
import { useYesNoDialog } from "./use-yes-no-dialog";

describe(`useYesNoDialog`, () => {
  it(`should return function that returns the YesNoDialog's properties`, () => {
    const { result } = renderHook(() => useYesNoDialog(() => {}))
    const register = result.current[0];

    expect(register()).toEqual({
      open: false,
      onAnswer: expect.any(Function),
    });
  });

  it(`should set the open parameter to true if the second function is called`, () => {
    const { result, rerender } = renderHook(() => useYesNoDialog(() => {}))
    const open = result.current[1];

    act(() => {open()});
    rerender();
  
    const register = result.current[0];

    expect(register()).toEqual({
      open: true,
      onAnswer: expect.any(Function),
    });
  });

  it(`should set the open parameter to false if the dialog's onAnswer function is called`, () => {
    const { result, rerender } = renderHook(() => useYesNoDialog(() => {}))
    const open = result.current[1];

    act(() => {open()});
    rerender();
  
    let register = result.current[0];

    expect(register()).toEqual({
      open: true,
      onAnswer: expect.any(Function),
    });

    
    act(() => {register().onAnswer(`yes`)});
    rerender();

    register = result.current[0];

    expect(register()).toEqual({
      open: false,
      onAnswer: expect.any(Function),
    });
  });

  it(`should call the onAnswer function from the function parameter with the answer and args if the Dialog's onAnswer function is called`, () => {
    const onAnswer = jest.fn();
    const { result, rerender } = renderHook(() => useYesNoDialog(onAnswer))
    const open = result.current[1];

    act(() => {open('hello word')});
    rerender();
  
    let register = result.current[0];

    expect(register()).toEqual({
      open: true,
      onAnswer: expect.any(Function),
    });

    act(() => {register().onAnswer(`no`)});

    expect(onAnswer).toBeCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(`no`, 'hello word');
  });
})