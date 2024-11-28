import chalk from "chalk";
import { ensureDirSync } from "@std/fs";
import { getCoreFolderPath } from "../util.ts";

import { walk } from "@std/fs/walk";
import { ensureFileSync } from "@std/fs/ensure-file";

export function createCoreStructure(startPath: string = ".") {
  console.log(`Scaffolding new core feature directories...`);
  const dirs = [
    "components",
    "lib",
    "lib/utils",
    "lib/hooks",
    "store",
    "actions",
    "actions/server",
    "actions/client",
  ];

  const files = [
    "components/index.ts",
    "lib/utils/index.ts",
    "lib/hooks/index.ts",
    "actions/server/index.ts",
    "actions/client/index.ts",
  ];

  for (const dir of dirs) {
    ensureDirSync(`${startPath}/${dir}`);
  }
  for (const file of files) {
    ensureFileSync(`${startPath}/${file}`);
  }
}

export async function createCoreFeature(
  featureName: string,
  startPath: string = "."
) {
  const path = await getCoreFolderPath(startPath);
  console.log(chalk.blue("Creating Core Feature: ") + featureName);
  ensureDirSync(`${path}/${featureName}`);
  createCoreStructure(`${path}/${featureName}`);
  console.log(chalk.green("Created Core Feature: ") + featureName);
}
