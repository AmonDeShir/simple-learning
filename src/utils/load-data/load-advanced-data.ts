import { RegisterLoading } from "../../components/loading/loading";
import { loadData } from "./load-data";

type AdvanceResponse<T> = {
  status: number;
  data: T | undefined;
  message: string;
}

export function loadAdvancedData<T, Data>(
  res: AdvanceResponse<T>,
  unpack: (data: T) => Data[],
  pack: (items: Data[], data: T) => T,
  setData: (data: T) => void,
  setProgress: (progress: RegisterLoading) => void,
  processData?: (data: Data[]) => Data[],
  cannotBeEmpty?: boolean,
  emptyMessage?: string,
) {
  if (!res.data) {
    throw Error(res.message);
  }

  const { data } = res;

  loadData<Data>(
    {...res, data: unpack(data) },
    (items) => setData(pack(items, data)),
    setProgress,
    processData,
    cannotBeEmpty,
    emptyMessage,
  );
}