import { Command } from "@cliffy/command";
import { createCoreFeature } from "./create/create-core-structure.ts";
import { addHook } from "./add/add-hook.ts";
import { addServerAction, addClientAction } from "./add/add-action.ts";
import { addUtil } from "./add/add-util.ts";
import { addComponent } from "./add/add-component.ts";
import { getCoreFolderPath } from "./util.ts";

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
  .version("0.1.5")
  .description(
    "A tool for scaffolding files and folders for the front-end UI framework under PravaUI"
  );

vyui
  .command(`create:feature`, `Scaffold Feature Folder in the core/ directory`)
  .arguments(`<feature_name:string>`)
  .action((_options: undefined, feature_name: string) =>
    createCoreFeature(feature_name)
  );

modules.forEach((module) => {
  vyui
    .command(
      `add:${module} <module_name:string> <feature_name>`,
      `add ${module} file for a core feature or for global ${module}`
    )
    .option("-g, --global", "Global Flag")
    .arguments("<module_name:string> <feature_name:string>")
    .action(
      async (
        { global }: { global: boolean | undefined },
        module_name: ModuleArgs["module_name"],
        feature_name: ModuleArgs["feature_name"]
      ) => {
        const isGlobal = !!global;
        const coreDirPath = isGlobal
          ? "."
          : await getCoreFolderPath(Deno.cwd());
        const featureFilePath = coreDirPath + "/" + feature_name;
        moduleFunctionRegistry.get(module)(featureFilePath, module_name);
      }
    );
});
type ModuleArgs = {
  module_name: string;
  feature_name: string;
};
await vyui.parse(Deno.args);
