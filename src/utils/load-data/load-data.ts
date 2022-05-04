import { RegisterLoading } from "../../components/loading/loading";

type Response<T> = {
  status: number;
  data: T[] | undefined;
  message: string;
}

export function loadData<T>(
  res: Response<T>,
  setData: (data: T[]) => void, 
  setProgress: (progress: RegisterLoading) => void,
  processData?: (data: T[]) => T[],
  cannotBeEmpty = false,
  emptyMessage = "Wow such empty :(",
) {
  if (!res.data) {
    throw Error(res.message);
  }

  if (processData) {
    res.data = processData(res.data);
  }

  if (res.data.length === 0) {
    if (cannotBeEmpty) {
      throw Error('The response array cannot be empty');
    }

    setData([]);
    setProgress({ state: 'empty', message: emptyMessage });
    return;
  }


  setData(res.data);
  setProgress({ state: 'success', message: '' });

  return res.data;
}

export function handleLoadingErrors(
  error: string,
  setProgress: (progress: RegisterLoading) => void,
  errorMessage = 'There was an error. Please try again',
) {
  if (error === 'canceled' || error === 'Error: canceled') {
    return;
  }

  setProgress({ state: 'error', message: errorMessage });
}
