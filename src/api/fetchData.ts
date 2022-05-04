import { Dispatch } from "@reduxjs/toolkit";
import { ExtractDispatchExtensions } from "@reduxjs/toolkit/dist/tsHelpers";
import axios, { AxiosPromise } from "axios";
import { openLoginPage } from "../redux/slices/users/user";

type DispatchType = ExtractDispatchExtensions<any> & Dispatch<any>;

export async function fetchData<T = any>(request: () => AxiosPromise<{ status: number, data: T }>, dispatch: DispatchType){
  const { status, data, message } = await tryDoRequest<T>(request);

  if (status === 401) {
    const refresh = await refreshToken();

    if (refresh) {
      return await tryDoRequest<T>(request);
    }
    else {
      dispatch(openLoginPage());
    }
  }

  return {
    status,
    data,
    message
  }
}

async function tryDoRequest<T>(request: () => AxiosPromise) {  
  try {
    const { data, status } = await request();

    return {
      data: data?.data as T ?? data as T,
      status,
      message: ''
    };
  }
  catch(error: any) {
    return {
      data: undefined,
      status: (error.response?.status ?? 400) as number,
      message: (error.message ?? error) as string
    };
  }
}

async function refreshToken() {
  try {
    await axios.post('/api/v1/auth/refresh');
    return true;
  }
  catch {
    return false;
  }
}