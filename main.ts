#!/usr/bin/env -S deno run --allow-read --allow-write

import { Command } from "@cliffy/command";
import { createCoreFeature } from "./create/create-core-structure.ts";
import { addHook } from "./add/add-hook.ts";
import { addServerAction, addClientAction } from "./add/add-action.ts";
import { addUtil } from "./add/add-util.ts";
import { addComponent } from "./add/add-component.ts";
import { getCoreFolderPath } from "./util.ts";
import { tidy } from "./mod/tidy.ts";
import chalk from "chalk";

export const modules = [
  "hook",
  "util",
  "server-action",
  "client-action",
  "component",
];

const moduleFunctionRegistry = new Map();
moduleFunctionRegistry.set("component", addComponent);
moduleFunctionRegistry.set("hook", addHook);
moduleFunctionRegistry.set("util", addUtil);
moduleFunctionRegistry.set("server-action", addServerAction);
moduleFunctionRegistry.set("client-action", addClientAction);

const vyui = new Command()
  .name("vyui")
  .version("0.1.7")
  .description(
    "A tool for scaffolding files and folders for the front-end UI framework under PravaUI"
  );

vyui
  .command(`create:feature`, `Scaffold Feature Folder in the core/ directory`)
  .arguments(`<feature_name:string>`)
  .action((_options: unknown, feature_name: string) =>
    createCoreFeature(feature_name)
  );

modules.forEach((module) => {
  // Add module
  vyui
    .command(
      `add:${module} <module_name:string> <feature_name>`,
      `add ${module} file for a core feature or for global ${module}`
    )
    .option("-g, --global", "Global Flag")
    .arguments("<module_name:string> <feature_name:string>")
    .action(
      (
        { global },
        module_name: ModuleArgs["module_name"],
        feature_name: ModuleArgs["feature_name"]
      ) => {
        const isGlobal = !!global;
        const coreDirPath = isGlobal ? "." : getCoreFolderPath(Deno.cwd());
        const featureDirPath = coreDirPath + "/" + feature_name;
        moduleFunctionRegistry.get(module)(featureDirPath, module_name);
      }
    );
});

// Tidy modules
vyui
  .command(
    `mod:tidy <feature_name> [module_name]`,
    "Housekeeping for features folder, run after you manually add modules"
  )
  .arguments("<feature_name:string>")
  .action((_options: unknown, feature_name: string) => {
    tidy(feature_name);
    console.log(chalk.blue("Tidy Directory:") + " core/" + feature_name);
  });

type ModuleArgs = {
  module_name: string;
  feature_name: string;
};

export async function main() {
  await vyui.parse(Deno.args);
}

if (import.meta.main) {
  main();
}
