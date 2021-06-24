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
): Promise<[AxiosResponse<T>, ReadableAxiosError]> {
  try {
    return [await req, null];
  } catch (error) {
    const { status, headers, data, statusText, config } =
      error.response as AxiosResponse;
    return [
      null,
      status ? { status, headers, data, statusText, config } : error,
    ];
  }
}
