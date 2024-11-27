import chalk from "chalk";
import { ensureFileSync } from "jsr:@std/fs/ensure-file";
import { toKebabCase, toCamelCase } from "jsr:@std/text";

const clientActionTemplate = (name: string) => `"use client";

export interface ${name}Args {
  // Add your options here
}

export async function ${name}({ ...props }: ${name}Args) {
  try {
    // Add your client action logic here
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

const serverActionTemplate = (name: string) => `"use server";

export interface ${name}Args {
  // Add your options here
}

export async function ${name}({ ...props }: ${name}Args) {
  try {
    // Add your server action logic here
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

export function createClientAction(
  featureFilePath: string,
  actionName: string
) {
  const fileName = toKebabCase(actionName);
  const parsedName = toCamelCase(actionName);

  const filePath = `${featureFilePath}/actions/client/${fileName}.ts`;
  const indexFilePath = `${featureFilePath}/actions/client/index.ts`;

  console.log(
    chalk.blue(`Creating Client Action File: ${parsedName}`),
    `\nat:` + chalk.underline(`${filePath}`)
  );
  ensureFileSync(filePath);
  ensureFileSync(indexFilePath);

  try {
    Deno.writeTextFileSync(filePath, `${clientActionTemplate(parsedName)}\n`);
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

export function createServerAction(
  featureFilePath: string,
  actionName: string
) {
  const fileName = toKebabCase(actionName);
  const parsedName = toCamelCase(actionName);

  const filePath = `${featureFilePath}/actions/server/${fileName}.ts`;
  const indexFilePath = `${featureFilePath}/actions/server/index.ts`;

  console.log(
    chalk.blue(`Creating Server Action File: ${parsedName}`),
    `\nat:` + chalk.underline(`${filePath}`)
  );
  ensureFileSync(filePath);
  ensureFileSync(indexFilePath);

  try {
    Deno.writeTextFileSync(filePath, `${serverActionTemplate(parsedName)}\n`);
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
