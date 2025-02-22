import * as v from "valibot";
import { load as loadYaml } from "js-yaml";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import {relative} from 'path';
// windowごとの設定値
const windowConfigSchema = v.union([v.string()]); // コマンド

// 設定ファイルのスキーマ
const configSchema = v.object({
  // セッション名
  name: v.string(),
  // セッションのルートディレクトリ
  root: v.optional(v.string()),
  // どういう画面にどういうコマンドを実行するか
  windows: v.optional(v.record(v.string(), windowConfigSchema)),
});

// 設定ファイルの型
export type Config = v.InferOutput<typeof configSchema>;

// 設定ファイルをパースする
export const parseConfig = (config: unknown) => {
  return v.parse(configSchema, config);
};

// 設定ファイルを読み込む
export const loadConfigFile = async (path: string) => {
  if (!existsSync(path)) {
    const relativePath = relative(process.cwd(), path);
    console.error(`Config file not found: ${relativePath}`);
    process.exit(1);
  }

  const config = loadYaml(await readFile(path, "utf-8"));
  return parseConfig(config);
};
