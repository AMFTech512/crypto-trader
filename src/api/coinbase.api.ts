import axios, { Method } from "axios";
import {
  COINBASE_API_KEY,
  COINBASE_API_SECRET,
  COINBASE_API_VERSION,
} from "../env";
import * as crypto from "crypto";

export function coinbaseRequest(
  method: Method,
  url: string,
  body?: Record<string, any>
) {
  const data = body ? JSON.stringify(body) : "";
  const timestamp = Math.floor(Date.now() / 1000);

  // generate signed message
  const message = timestamp + method + url + data;
  const signature = crypto
    .createHmac("sha256", COINBASE_API_SECRET)
    .update(message)
    .digest("hex");

  return axios.request({
    method,
    baseURL: "https://api.coinbase.com/",
    url,
    data,
    headers: {
      "CB-ACCESS-KEY": COINBASE_API_KEY,
      "CB-ACCESS-SIGN": signature,
      "CB-ACCESS-TIMESTAMP": timestamp,
      "CB-VERSION": COINBASE_API_VERSION,
    },
  });
}
