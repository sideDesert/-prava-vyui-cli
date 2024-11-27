// Export types
export type CliOptions = {
  add?: string;
  name?: string;
  feature?: string;
  create?: string;
  global?: boolean;
};

export type FeatureConfig = {
  name: string;
  path: string;
  components?: string[];
  hooks?: string[];
  utils?: string[];
  actions?: {
    client?: string[];
    server?: string[];
  };
};

// Export core CLI function
export { cli } from "./main.ts";

// Export utility functions
export { getCoreFolderPath, getFeatureFilePath } from "./util.ts";

// Export creation functions
export {
  createCoreFeature,
  createCoreStructure,
} from "./create/create-core-structure.ts";

export { createCoreHook } from "./create/create-hook.ts";
export { createComponent } from "./create/create-component.ts";
export { createCoreUtil } from "./create/create-util.ts";
export {
  createClientAction,
  createServerAction,
} from "./create/create-action.ts";

// Export template types
export type ComponentTemplate = {
  name: string;
  content: string;
  props?: Record<string, unknown>;
};

export type HookTemplate = {
  name: string;
  content: string;
  args?: Record<string, unknown>;
};

export type UtilTemplate = {
  name: string;
  content: string;
};

export type ActionTemplate = {
  name: string;
  content: string;
  type: "client" | "server";
};

// Export constants
export const VERSION = "0.1.0";

// Export template generators
export const templates = {
  component: (name: string): ComponentTemplate => ({
    name,
    content: `"use client";
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
}`,
  }),

  hook: (name: string): HookTemplate => ({
    name,
    content: `import {useState, useEffect} from 'react'
export interface ${name}Args {
  // Add your options here
}

export function ${name}({ ...props }: ${name}Args) {
  useEffect(()=>{

  },[])
}`,
  }),

  util: (name: string): UtilTemplate => ({
    name,
    content: `export interface ${name}Args {
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
}`,
  }),
};

// Export helper functions
export const validateFeatureName = (name: string): boolean => {
  return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(name);
};

export const formatFileName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Export error types
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliError";
  }
}
