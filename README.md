# VyUI CLI Tool Name

A CLI tool for scaffolding Prava.ai ui reposity components and features.

## Installation

To install the VyUI CLI globally using Deno, run the following command:

```
deno install --allow-read --allow-write -f -n vyui https://deno.land/x/vyui/main.ts
```

- `-A`: Grants all permissions to the script.
- `-f`: Forces the installation, overwriting any existing installation.
- `-n vyui`: Names the installed executable as `vyui`.

This ensures that the CLI tool is installed globally and can be accessed from anywhere in your terminal.

## Usage

### NPM Projects Setup

For npm-based projects, add the following script to your `package.json`:

```json
{
  "scripts": {
    "vyui": "deno run -A jsr:@prava/vyui@latest"
  }
}
```

Then you can run the CLI using:

```bash
# Using npm
npm run vyui create:feature <feature-name>
npm run vyui add:<module> <module_name> <feature-name>


# Using yarn
yarn vyui create:feature <feature-name>
yarn vyui add:<module> <module_name> <feature-name>

# Using pnpm
pnpm vyui create:feature <feature-name>
pnpm vyui add:<module> <module_name> <feature-name>
```

Note: The double dash (`--`) is required when using npm to pass arguments to the script.

### Direct Usage (with global installation)

If you've installed the CLI globally, you can use it directly:

```bash
vyui create:feature <feature-name>
```

### Creating a New Feature

Create a new feature structure with all necessary folders and files:

```bash
# Using npm script
npm run vyui create:feature auth

# Using global installation
vyui create:feature auth
```

### Creating a New Module

Create a new module:

```bash
# Using npm script
npm run vyui add:hook useAuth auth
npm run vyui add:util parseEmail auth
npm run vyui add:server-action signIn auth
npm run vyui add:client-action signOut auth
npm run vyui add:component loginModal auth

# Using global installation
vyui add:hook useAuth auth
vyui add:util parseEmail auth
vyui add:server-action signIn auth
vyui add:client-action signOut auth
vyui add:component loginModal auth
```

## Folder Structure

When you create a new feature using `vyui create:feature feature-name`, it generates the following structure:

```
src/
└── core/
    └── feature-name/
        ├── components/
        │   └── index.ts
        ├── lib/
        │   ├── hooks/
        │   │   └── index.ts
        │   └── utils/
        │       └── index.ts
        ├── actions/
        │   ├── client/
        │   │   └── index.ts
        │   └── server/
        │       └── index.ts
        └── store/
```

### Example Structure with Files

After adding components, hooks, and actions, your feature might look like this:

```
src/
└── core/
    └── auth/
        ├── components/
        │   ├── login-form.tsx
        │   ├── signup-form.tsx
        │   └── index.ts
        ├── lib/
        │   ├── hooks/
        │   │   ├── use-auth.ts
        │   │   ├── use-session.ts
        │   │   └── index.ts
        │   └── utils/
        │       ├── validate-password.ts
        │       ├── format-user-data.ts
        │       └── index.ts
        ├── actions/
        │   ├── client/
        │   │   ├── handle-login.ts
        │   │   ├── handle-signup.ts
        │   │   └── index.ts
        │   └── server/
        │       ├── authenticate-user.ts
        │       ├── create-user.ts
        │       └── index.ts
        └── store/
            └── auth-store.ts
```

### File Types and Their Purpose

- **components/**: React components with `.tsx` extension
- **lib/hooks/**: Custom React hooks starting with 'use'
- **lib/utils/**: Utility functions and helpers
- **actions/client/**: Client-side actions (marked with "use client")
- **actions/server/**: Server-side actions (marked with "use server")
- **store/**: State management related files
