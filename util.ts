import { ensureDirSync, walk } from "@std/fs";

export async function getCoreFolderPath(cwd: string) {
  let hasSrc = false;
  let srcPath = ".";
  for await (const d of walk(cwd, {
    maxDepth: 5,
    skip: [/node_modules/],
  })) {
    if (d.isDirectory && d.name === "core") {
      ensureDirSync(d.path + "/" + name);
      return d.path;
    }
    if (d.isDirectory && d.name === "src") {
      hasSrc = true;
      srcPath = d.path;
    }
  }
  if (hasSrc) {
    const dir = cwd + "/" + srcPath + "/core";
    ensureDirSync(dir);
    return dir;
  }
  ensureDirSync(cwd + "/core");
  return cwd + "/core";
}

export async function getFeatureFilePath(name: string, cwd: string) {
  const coreFolderPath = await getCoreFolderPath(cwd);
  const path = coreFolderPath + "/" + name;
  ensureDirSync(coreFolderPath + "/" + name);
  return path;
}
