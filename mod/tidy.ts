import { existsSync } from "@std/fs/exists";
import { relative } from "@std/path";
import { walkSync, ensureFileSync } from "@std/fs";
import { getCoreFolderPath } from "../util.ts";
import chalk from "chalk";

const log = console.log;

interface ExportedLiterals {
  types: string[];
  values: string[];
}

export function extractExportableLiterals(filePath: string): ExportedLiterals {
  // Regex to match various export patterns
  const regex =
    /export\s+(?:default\s+)?(?:async\s+)?(?:(?:const|let|var|function|class|type|interface)?\s+)?(\w+|\{[^}]+\})/gm;

  // Check if file exists
  if (!existsSync(filePath)) {
    log(chalk.red(`File at ${filePath} doesn't exist`));
    return { types: [], values: [] };
  }

  // Read file content
  const content = Deno.readTextFileSync(filePath);
  const matches = content.match(regex);

  if (!matches) {
    return { types: [], values: [] };
  }

  const types: string[] = [];
  const values: string[] = [];

  // Delimiter for splitting
  const spl = /[\s\t\n,{}]+/;

  for (const str of matches) {
    // Handle grouped exports like export { a, b, c }
    if (str.includes("{")) {
      const extractedLiterals = str
        .slice(str.indexOf("{") + 1, str.indexOf("}"))
        .trim()
        .split(spl)
        .filter((lit) => lit.trim() !== "");

      extractedLiterals.forEach((lit) => {
        // Determine if it's a type or a value
        if (lit.startsWith("type") || lit.includes("Interface")) {
          types.push(lit.replace("type", "").trim());
        } else {
          values.push(lit);
        }
      });
    } else {
      // Handle individual exports
      const splitStr = str.split(spl).filter((lit) => lit.trim() !== "");
      const literal = splitStr[splitStr.length - 1];

      // Categorize based on keywords
      if (str.includes("type") || str.includes("interface")) {
        types.push(literal);
      } else {
        values.push(literal);
      }
    }
  }

  return {
    types: [...new Set(types)], // Remove duplicates
    values: [...new Set(values)], // Remove duplicates
  };
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

  for (const dir of dirs) {
    let indexFileContent = "";
    for (const d of walkSync(dir)) {
      if (d.isFile && d.name !== "index.ts") {
        // Get both types and values
        const { types, values } = extractExportableLiterals(d.path);

        // Create relative path, removing .tsx or .ts extension
        let relPath = relative(dir, d.path);
        relPath = relPath.replace(/\.(tsx?|ts)$/, "");

        // Separate export for types and values
        let indexContent = "";

        // Export types
        if (types.length > 0) {
          indexContent += `export { ${types
            .map((t) => `type ${t}`)
            .join(", ")} } from './${relPath}';\n`;
        }

        // Export values
        if (values.length > 0) {
          indexContent += `export { ${values.join(
            ", "
          )} } from './${relPath}';\n`;
        }

        indexFileContent += indexContent;
      }
    }

    // Ensure index.ts exists and write content
    if (indexFileContent.trim()) {
      ensureFileSync(dir + "/index.ts");
      Deno.writeTextFileSync(dir + "/index.ts", indexFileContent);
    }
  }
}
