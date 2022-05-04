import { PropsWithChildren } from 'react';
import { Error } from './error/error';
import { Loader } from './loader/loader';
import { Empty } from './empty/empty';
import { Timeout } from './timeout/timeout';

export type LoadingState = 'loading' | 'error' | 'empty' | 'success';

export type RegisterLoading = { state: LoadingState, message: string }

type Props = PropsWithChildren<{
  state: LoadingState;
  message: string;
  timeout: number;
  noBackground?: boolean;
}>;

export const Loading = ({ state, message, timeout, noBackground, children }: Props) => {
  switch (state) {
    case 'loading':
      return (
        <>
          <Loader noBackground={noBackground} />
          <Timeout time={timeout}  />
        </>
      );

    case 'empty':
      return <Empty noBackground={noBackground} message={message} />;

    case 'error':
      return <Error noBackground={noBackground} message={message} />;

    default:
      return <>{children}</>
  }
};