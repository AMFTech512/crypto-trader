import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface ReadableAxiosError {
  status: number;
  statusText: string;
  headers: any;
  data: any;
  config: AxiosRequestConfig;
}

export async function axiosRequest<T>(
  req: Promise<AxiosResponse<T>>
): Promise<[AxiosResponse<T>, any]> {
  try {
    return [await req, null];
  } catch (error) {
    if (!error.response)
      try {
        return [null, JSON.stringify(error) as any];
      } catch (jsonerr) {
        return [null, error];
      }

    const { status, headers, data, statusText, config } =
      error.response as AxiosResponse;
    return [null, { status, headers, data, statusText, config }];
  }
}
