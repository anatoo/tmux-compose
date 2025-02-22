import { expect, test, describe } from "bun:test";
import { parseConfig, loadConfigFile } from "./config";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile } from "fs/promises";

describe("設定ファイルのテスト", () => {
  test("正しい設定オブジェクトをパースできる", () => {
    const validConfig = {
      name: "test-session",
      root: "./",
      windows: {
        "window1": "echo hello",
        "window2": "echo world"
      }
    };

    const result = parseConfig(validConfig);
    expect(result).toEqual(validConfig);
  });

  test("必須フィールドのnameがない場合はエラー", () => {
    const invalidConfig = {
      windows: {
        "window1": "echo hello"
      }
    };

    expect(() => parseConfig(invalidConfig)).toThrow();
  });

  test("最小限の構成", () => {
    const configWithoutWindows = {
      name: "test-session"
    };

    const result = parseConfig(configWithoutWindows);
    expect(result).toEqual({
      name: "test-session",
    });
  });

  test("YAMLファイルから設定を読み込める", async () => {
    const tempFile = join(tmpdir(), "test-config.yml");
    const yamlContent = `
name: test-session
windows:
  window1: echo hello
  window2: echo world
`;

    await writeFile(tempFile, yamlContent, "utf-8");
    const result = await loadConfigFile(tempFile);

    expect(result).toEqual({
      name: "test-session",
      windows: {
        "window1": "echo hello",
        "window2": "echo world"
      }
    });
  });

  test("不正なYAMLファイルはエラー", async () => {
    const tempFile = join(tmpdir(), "invalid-config.yml");
    const invalidYaml = `
name: test-session
windows:
  - invalid: format
`;

    await writeFile(tempFile, invalidYaml, "utf-8");
    await expect(loadConfigFile(tempFile)).rejects.toThrow();
  });
}); 