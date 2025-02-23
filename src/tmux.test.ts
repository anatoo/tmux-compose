import { expect, test, describe, beforeEach, spyOn, afterEach } from "bun:test";
import { tmux } from "./tmux";

let mockExec: ReturnType<typeof spyOn>;
beforeEach(async () => {
  mockExec = spyOn(tmux, 'exec').mockReturnValue(Promise.resolve({
    exitCode: 0,
    stdout: '',
    stderr: '',
  }));
});

afterEach(() => {
  mockExec.mockRestore();
});

// smoke testを書く
describe("tmux", () => {
  test("newSession()", async () => {
    await tmux.newSession("test-session");
  });

  test('hasSession()', async () => {
    expect(await tmux.hasSession("test-session")).toBe(true);
  });
});
