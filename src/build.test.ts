import { expect, test, describe } from "bun:test";
import { build } from "./build";
import { type Config } from "./config";

const configDirPath = '/my-project';

describe("build", () => {
  test("基本的なセッション作成のコマンドを生成する", () => {
    const config: Config = {
      name: "test-session",
      windows: {},
    };

    expect(build(config, configDirPath)).toMatchInlineSnapshot(`
      "cd '/my-project';
      if ! tmux has-session -t 'test-session' 2>/dev/null; then
        tmux new-session -d -s 'test-session';
      else
        echo "Session 'test-session' already exists";
      fi
      tmux attach -t 'test-session';"
    `);
  });

  test("ウィンドウとコマンドを含むセッションのコマンドを生成する", () => {
    const config: Config = {
      name: "dev",
      windows: {
        editor: "vim",
        server: "npm run dev",
      },
    };

    expect(build(config, configDirPath)).toMatchInlineSnapshot(`
      "cd '/my-project';
      if ! tmux has-session -t 'dev' 2>/dev/null; then
        tmux new-session -d -s 'dev';
        tmux rename-window -t 'dev:0' 'editor';
        tmux send-keys -t 'dev:editor' 'vim' C-m;
        tmux new-window -t 'dev' -n 'server';
        tmux send-keys -t 'dev:server' 'npm run dev' C-m;
      else
        echo "Session 'dev' already exists";
      fi
      tmux attach -t 'dev';"
    `);
  });

  test("空のコマンドを持つウィンドウの場合、send-keysを実行しない", () => {
    const config: Config = {
      name: "test",
      windows: {
        empty: "  ",
        normal: "echo hello",
      },
    };

    expect(build(config, configDirPath)).toMatchInlineSnapshot(`
      "cd '/my-project';
      if ! tmux has-session -t 'test' 2>/dev/null; then
        tmux new-session -d -s 'test';
        tmux rename-window -t 'test:0' 'empty';
        tmux new-window -t 'test' -n 'normal';
        tmux send-keys -t 'test:normal' 'echo hello' C-m;
      else
        echo "Session 'test' already exists";
      fi
      tmux attach -t 'test';"
    `);
  });
}); 