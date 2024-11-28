import chalk from "chalk";
import { ensureFileSync } from "@std/fs/ensure-file";
import { toPascalCase, toKebabCase, toCamelCase } from "@std/text";

const hookTemplate = (
  name: string
) => `import {useState, useEffect} from 'react'
export interface ${name}Args {
  // Add your options here
}

export function ${name}({ ...props }: ${name}Args) {
  useEffect(()=>{

  },[])
}`;

const indexTemplate = (name: string, fileName: string) =>
  `export { ${name} } from './${fileName}'`;

export function addHook(featureFilePath: string, hookName: string) {
  const fileName = toKebabCase(hookName);
  let parsedName = toCamelCase(hookName);
  parsedName = parsedName.startsWith("use")
    ? parsedName
    : "use" + toPascalCase(parsedName);

  const filePath = `${featureFilePath}/lib/hooks/${fileName}.ts`;
  const indexFilePath = `${featureFilePath}/lib/hooks/index.ts`;

  console.log(
    chalk.blue(`Creating Hook File: ${parsedName}`),
    `\nat:` + chalk.underline(`${filePath}`)
  );
  ensureFileSync(filePath);
  ensureFileSync(indexFilePath);

  try {
    Deno.writeTextFileSync(filePath, `${hookTemplate(parsedName)}\n`);
  } catch (error) {
    console.log(chalk.red("error writing to file: ", parsedName));
    throw error;
  }

  try {
    Deno.writeTextFileSync(
      indexFilePath,
      `${indexTemplate(parsedName, fileName)}\n`,
      { append: true }
    );
    console.log(chalk.green(`Updated index file: `) + `${indexFilePath}`);
  } catch (error) {
    console.error(chalk.red(`Error updating index: ${error}`));
    throw error;
  }
}
