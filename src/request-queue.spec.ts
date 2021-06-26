import { RequestQueue } from "./request-queue";

describe("RequestQueue", () => {
  it("should run a function", async () => {
    const returnOne = () => 1;
    const waitASec = async () =>
      await new Promise((res) => setTimeout(res, 1000));

    RequestQueue.queueUp(returnOne);
    RequestQueue.queueUp(waitASec);
    const val = await RequestQueue.queueUp(returnOne);

    expect(val).toBe(1);
  }, 10000);
});
