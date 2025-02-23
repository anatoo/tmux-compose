import { loadConfigFile } from "./config";
import { Command } from "commander";
import { resolve, dirname } from "path";
import { start } from './start';

const program = new Command();

program
  .name('tmux-compose')
  .description('CLI to compose tmux windows from a config file')
  .version("0.0.0");

program
  .command("start")
  .description("Start a tmux session from a config file")
  .option('-c, --config <string>', 'path to the config file', "tmux-compose.yaml")
  .action(async (options) => {
    const resolvePath = resolve(options.config);
    const config = await loadConfigFile(resolvePath);
    const dir = dirname(resolvePath);
    return start(config, dir);
  });

program.parse();
