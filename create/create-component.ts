import chalk from "chalk";
import { ensureFileSync } from "@std/fs";
import { toKebabCase, toPascalCase } from "@std/text";

const componentTemplate = (name: string) => `"use client";
import { cn } from "@/lib/utils";

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string
}

export function ${name}({ className, children, ...props }: ${name}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}`;

const indexTemplate = (name: string, fileName: string) =>
  `export { ${name} } from './${fileName}'`;

export function createComponent(
  featureFilePath: string,
  componentName: string
) {
  const fileName = toKebabCase(componentName);
  const parsedName = toPascalCase(componentName);

  const filePath = `${featureFilePath}/components/${fileName}.tsx`;
  const indexFilePath = `${featureFilePath}/components/index.ts`;

  console.log(
    chalk.blue(`Creating Component File: ${parsedName}`),
    `\nat:` + chalk.underline(`${filePath}`)
  );

  ensureFileSync(filePath);
  ensureFileSync(indexFilePath);

  Deno.writeTextFileSync(filePath, componentTemplate(parsedName));
  console.log(chalk.green(`Created Component: `) + `${filePath}`);

  try {
    Deno.writeTextFileSync(filePath, `${componentTemplate(parsedName)}\n`);
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
  console.log(chalk.green(`Updated index file: `) + `${indexFilePath}`);
}
