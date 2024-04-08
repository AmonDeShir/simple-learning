import gsap from 'gsap';

type NotFunction<T> = T extends Function ? never : T;

type AnimationCallback<T> = (tl: gsap.core.Timeline, item: T ) => void;
type AnimationCallbackWithArgument<Args extends NotFunction<any>, T> = (tl: gsap.core.Timeline, item: T, args: Args) => void;

type AnimationFunction<T> = (item: T, onDone?: () => void) => () => void;
type AnimationFunctionWithArgument<Args extends NotFunction<any>, T> = (item: T | null, args: Args, onDone?: () => void) => () => void;

export function animation<T = (HTMLElement | null)>(animate: AnimationCallback<T>): AnimationFunction<T>;
export function animation<Args, T = (HTMLElement | null)>(animate: AnimationCallbackWithArgument<Args, T>): AnimationFunctionWithArgument<Args, T>;
export function animation<Args, T = (HTMLElement | null)>(animate: AnimationCallback<T> | AnimationCallbackWithArgument<Args, T>) {
  return (item: (T | null) | (T | null)[], onDoneOrArgs: (() => void) | Args, argsOrOnDone: Args | (() => void)) => {
    const tl = gsap.timeline();
    let onDone: (() => void) | undefined;
    let args: Args;

    if (typeof onDoneOrArgs === 'function') {
      onDone = onDoneOrArgs as () => void;
      args = argsOrOnDone as Args;
    }
    else if (typeof argsOrOnDone === 'function')  {
      onDone = argsOrOnDone as () => void;
      args = onDoneOrArgs as Args;
    }
    else {
      onDone = undefined;
      args = argsOrOnDone as Args;
    }

    animate(tl, item as any, args);
    
    if (onDone) {
      tl.call(onDone as () => void);
    }

    return () => { tl.kill() };
  }
}