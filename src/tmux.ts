import { execFile as originalExecFile } from "node:child_process";
import kexec from "@jcoreio/kexec";

export class tmux {
  static async newSession(name: string, dir: string): Promise<void> {
    const result = await this.exec("tmux", ["new-session", "-d", "-s", name, "-c", dir]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to create session: ${result.stderr}`);
    }
  }

  static async hasSession(name: string): Promise<boolean> {
    const result = await this.exec("tmux", ["has-session", "-t", name]);
    return result.exitCode === 0;
  }

  static async newWindow(sessionName: string, windowName: string): Promise<void> {
    const result = await this.exec("tmux", ["new-window", "-t", sessionName, "-n", windowName]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to create window: ${result.stderr}`);
    }
  }

  static async renameWindow(sessionName: string, targetWindow: string, windowName: string): Promise<void> {
    const result = await this.exec("tmux", ["rename-window", "-t", `${sessionName}:${targetWindow}`, windowName]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to rename window: ${result.stderr}`);
    }
  }

  static async killWindow(sessionName: string, targetWindow: string): Promise<void> {
    const result = await this.exec("tmux", ["kill-window", "-t", `${sessionName}:${targetWindow}`]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to kill window: ${result.stderr}`);
    }
  }

  static async sendKeys(sessionName: string, targetWindow: string, keys: string): Promise<void> {
    const result = await this.exec("tmux", ["send-keys", "-t", `${sessionName}:${targetWindow}`, keys, "C-m"]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to send keys: ${result.stderr}`);
    }
  }

  static attachSession(name: string): void {
    kexec(`tmux attach-session -t '${name}'`);
  }

  static async exec(command: string, args: string[]): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve, reject) => {
      const process = originalExecFile(command, args, (error, stdout, stderr) => {
        const exitCode = process.exitCode;
        if (typeof exitCode !== "number") {
          reject(new Error("exitCode is not a number"));
        } else {
          resolve({
            exitCode,
            stdout: stdout.toString(),
            stderr: stderr.toString(),
          });
        }
      });
    });
  }
}
