#!/usr/bin/env -S deno run --allow-read --allow-write

import { parseArgs } from "jsr:@std/cli";
import { createCoreFeature } from "./create/create-core-structure.ts";
import { createCoreHook } from "./create/create-hook.ts";
import { createCoreUtil } from "./create/create-util.ts";
import { createComponent } from "./create/create-component.ts";
import { createClientAction } from "./create/create-action.ts";
import { createServerAction } from "./create/create-action.ts";
import { getCoreFolderPath } from "./util.ts";
import chalk from "npm:chalk";

const add = ["component", "util", "hook", "server-action", "client-action"];
export async function main(args: string[] = Deno.args) {
  const parsedArgs = parseArgs(args, {
    string: ["add", "name", "feature", "create"],
    default: { global: false },
    boolean: ["global"],
  });
  console.log(parsedArgs);

  if (parsedArgs.create) {
    createCoreFeature(parsedArgs.create);
  }

  if (parsedArgs.add) {
    if (!add.includes(parsedArgs.add)) {
      console.error(chalk.red("Add has to be of the type"), add);
      return;
    }
    if (!parsedArgs?.name) {
      console.error(
        chalk.red(`Please give a ${parsedArgs.add} name using --name`)
      );
      return;
    }
    if (!parsedArgs?.feature && !parsedArgs?.global) {
      console.log(chalk.red("Please specify a feature name using --name"));
      return;
    }
    let coreDir = ".";

    if (parsedArgs?.global) {
      coreDir = ".";
    } else {
      coreDir = await getCoreFolderPath(Deno.cwd());
    }
    const featureFilePath = coreDir + "/" + parsedArgs.feature;
    switch (parsedArgs.add) {
      case "hook":
        createCoreHook(featureFilePath, parsedArgs.name);
        return;
      case "util":
        createCoreUtil(featureFilePath, parsedArgs.name);
        return;
      case "component":
        createComponent(featureFilePath, parsedArgs.name);
        return;
      case "client-action":
        createClientAction(featureFilePath, parsedArgs.name);
        return;
      case "server-action":
        createServerAction(featureFilePath, parsedArgs.name);
        return;
      default:
        console.error(chalk.red("Invalid add type. Must be one of:"), add);
        return;
    }
  }
}

if (import.meta.main) {
  await main();
}
