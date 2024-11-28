import { existsSync } from "@std/fs/exists";
import { relative } from "@std/path";
import { walkSync, ensureFileSync } from "@std/fs";
import { getCoreFolderPath } from "../util.ts";
import chalk from "chalk";

const log = console.log;

export function extractExportableLiterals(filePath: string): string[] {
  const regex =
    /export\s+(?:default\s+)?(?:async\s+)?(?:(?:const|let|var|function|async function|class|type|interface)?\s+)?(\w+)/gm;
  if (!existsSync(filePath)) {
    log(chalk.red(`File at ${filePath} doesn't exist`));
  }
  const content = Deno.readTextFileSync(filePath);
  const matches = content.match(regex);
  if (!matches) {
    return [];
  }
  let literals: string[] = [];
  const spl = /[\s\t\n,]+/;
  for (const str of matches!) {
    let parsedStr: string[] = [];
    if (str.includes("{")) {
      parsedStr = str
        .slice(str.indexOf("{") + 1, str.indexOf("}"))
        .trim()
        .split(spl);
    } else {
      const splitStr = str.split(spl);
      parsedStr.push(splitStr[splitStr.length - 1]);
    }
    literals = literals.concat(parsedStr);
  }
  return literals;
}

export function tidy(feature_name: string) {
  const coreDirPath = getCoreFolderPath(Deno.cwd());
  const featureDirPath = coreDirPath + "/" + feature_name;
  const utilDir = featureDirPath + "/" + "lib/utils";
  const hookDir = featureDirPath + "/" + "lib/hooks";
  const componentDir = featureDirPath + "/" + "components";
  const serverActionDir = featureDirPath + "/" + "actions/server";
  const clientActionDir = featureDirPath + "/" + "actions/client";
  const dirs = [
    utilDir,
    hookDir,
    componentDir,
    serverActionDir,
    clientActionDir,
  ];
  let indexFileContent = "";
  for (const dir of dirs) {
    let indexContent: string = "\n";
    for (const d of walkSync(dir)) {
      let literals: string[] = [];
      if (d.isFile && d.name !== "index.ts") {
        literals = literals.concat(extractExportableLiterals(d.path));
        const relPath = relative(dir, d.path);
        indexContent = `export { ${literals.join(
          ", "
        )} } from './${relPath}'\n`;
        indexFileContent += indexContent;
      }
    }
    ensureFileSync(dir + "/index.ts");
    Deno.writeTextFileSync(dir + "/index.ts", indexFileContent);
  }
}
