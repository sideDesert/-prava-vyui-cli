import chalk from "chalk";
import { ensureDirSync } from "@std/fs";

import { walk } from "@std/fs/walk";
import { ensureFileSync } from "@std/fs/ensure-file";

export function createCoreStructure(startPath: string = ".") {
  console.log(`Creating new core feature`);
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
  startPath: string = ".",
  ignoreList = ["node_modules"]
) {
  let path = startPath;
  let srcPath = ".";
  let foundCoreDir = false;
  let foundSrcDir = false;
  // Find core directory in root
  for await (const d of walk(startPath, {
    skip: [/node_modules/],
    maxDepth: 5,
  })) {
    if (d.isDirectory && ignoreList.includes(d.name)) {
      continue;
    }
    if (d.isDirectory && d.name === "core") {
      path = d.path;
      foundCoreDir = true;
      break;
    }
    if (d.isDirectory && d.name === "src") {
      srcPath = d.path;
      foundSrcDir = true;
      break;
    }
  }
  if (!foundCoreDir && foundSrcDir) {
    path = srcPath + "/core";
  }

  console.log(chalk.blue("Creating Core Feature: ") + featureName);
  ensureDirSync(`${path}/${featureName}`);
  createCoreStructure(`${path}/${featureName}`);
  console.log(chalk.green("Created Core Feature: ") + featureName);
}
