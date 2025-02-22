import { build } from "./build";
import kexec from "@jcoreio/kexec";
import { loadConfigFile } from "./config";
import { Command } from "commander";
import { resolve, dirname } from "path";

/**
 * 設定ファイルを読み込んでtmuxのコマンドを生成する
 * @param path 設定ファイルのパス
 */
export async function start(path: string) {
  const commands = await composeFromConfigFile(path);
  kexec(commands);
}

/**
 * 設定ファイルを読み込んでtmuxのコマンドを生成する
 * @param path 設定ファイルのパス
 */
export async function composeFromConfigFile(path: string) {
  const resolvePath = resolve(path);
  const config = await loadConfigFile(resolvePath);
  const dir = dirname(resolvePath);
  return build(config, dir);
}

const program = new Command();

program
  .name('tmux-compose')
  .description('CLI to compose tmux windows from a config file')
  .version("0.0.0");

program
  .command("start")
  .description("Start a tmux session from a config file")
  .option('-c, --config <string>', 'path to the config file', "tmux-compose.yaml")
  .action((options) => {
    start(options.config);
  });

program
  .command("debug")
  .description("Display generated tmux commands from a config file")
  .option('-c, --config <string>', 'path to the config file', "tmux-compose.yaml")
  .action(async (options) => {
    const commands = await composeFromConfigFile(options.config);
    console.log(commands);
  });

program.parse();
