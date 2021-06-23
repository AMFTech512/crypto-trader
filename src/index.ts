import axios from "axios";
import { coinbaseRequest } from "./coinbase.api";
import { COINBASE_API_KEY, COINBASE_API_VERSION } from "./env";

console.log("Starting Crypto trader...");
console.log("Using Coinbase API version", COINBASE_API_VERSION);

(async () => {
  try {
    const res = await coinbaseRequest("GET", "/v2/accounts");
    console.log(res.data);
  } catch (error) {
    console.error(error.response.data);
  }
})();
