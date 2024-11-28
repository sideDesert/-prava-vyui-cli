import chalk from "chalk";
import { ensureFileSync } from "@std/fs/ensure-file";
import { toKebabCase, toCamelCase } from "@std/text";

const utilTemplate = (name: string) => `export interface ${name}Args {
  // Add your options here
}

export function ${name}({ ...props }: ${name}Args) {
  try {
    // Add your utility logic here
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}`;

const indexTemplate = (name: string, fileName: string) =>
  `export { ${name} } from './${fileName}'`;

export function addUtil(featureFilePath: string, utilName: string) {
  const fileName = toKebabCase(utilName);
  const parsedName = toCamelCase(utilName);

  const filePath = `${featureFilePath}/lib/utils/${fileName}.ts`;
  const indexFilePath = `${featureFilePath}/lib/utils/index.ts`;

  console.log(
    chalk.blue(`Creating Util File: ${parsedName}`),
    `\nat:` + chalk.underline(`${filePath}`)
  );
  ensureFileSync(filePath);
  ensureFileSync(indexFilePath);

  try {
    Deno.writeTextFileSync(filePath, `${utilTemplate(parsedName)}\n`);
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
