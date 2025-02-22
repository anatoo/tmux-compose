import { type Config } from "./config";
import { resolve } from "path";

// 設定ファイルをもとにtmuxのコマンドを実行するbashスクリプトを生成する
export const build = (config: Config, configDirPath: string = process.cwd()) => {
  const { name, windows } = config;

  const commands: string[] = [];

  // セッションのルートディレクトリに移動する
  const root = config.root?.startsWith("/") ? config.root : resolve(configDirPath, config.root ?? "./");
  commands.push(`cd '${root}';`);

  // セッションが存在しない場合にはセッションを作成する
  // セッションが存在する場合にはwindowに関する操作はしない
  commands.push(`if ! tmux has-session -t '${name}' 2>/dev/null; then`);
  commands.push(`  tmux new-session -d -s '${name}';`);

  if (windows) {
    Object.entries(windows).forEach(([windowName, command], index) => {
      if (index === 0) {
        commands.push(`  tmux rename-window -t '${name}:0' '${windowName}';`);
      } else {
        commands.push(`  tmux new-window -t '${name}' -n '${windowName}';`);
      }

      // コマンドが空の場合にはコマンドを実行しない
      if (command.trim() !== "") {
        commands.push(`  tmux send-keys -t '${name}:${windowName}' '${command}' C-m;`);
      }
    });
  }

  commands.push('else');
  commands.push(`  echo "Session '${name}' already exists";`);
  commands.push(`fi`);

  // セッションをアタッチする
  commands.push(`tmux attach -t '${name}';`);

  return commands.join("\n");
};
