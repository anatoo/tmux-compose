import type { Config } from "./config";
import { tmux } from "./tmux";
import { createInterface } from "node:readline/promises";

export async function start(config: Config, dir: string) {
  if (await tmux.hasSession(config.name)) {
    console.log(`Session '${config.name}' already exists.`);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await rl.question("Do you want to attach to the session? (y/n) >");
    rl.close();

    if (typeof answer === "string" && ['y', 'yes'].includes(answer.toLowerCase())) {
      tmux.attachSession(config.name);
    } else {
      process.exit(1);
    }
  }

  await tmux.newSession(config.name, dir);

  const windows = Object.entries(config.windows ?? {});
  for (const [windowName, command] of windows) {
    await tmux.newWindow(config.name, windowName);
    await tmux.sendKeys(config.name, windowName, command);
  }

  if (config.windows) {
    // new sessionで作成されたwindowをkillする
    await tmux.killWindow(config.name, "0");
  }

  tmux.attachSession(config.name);
}
