import { ensureDirSync, walk, walkSync } from "@std/fs";

export function getCoreFolderPath(cwd: string): string {
  let hasSrc = false;
  let srcPath = ".";
  for (const d of walkSync(cwd, {
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

export function getFeatureFilePath(name: string, cwd: string): string {
  const coreFolderPath = getCoreFolderPath(cwd);
  const path = coreFolderPath + "/" + name;
  ensureDirSync(coreFolderPath + "/" + name);
  return path;
}
