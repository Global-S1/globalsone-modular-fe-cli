#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { createGenerateCommand } from "./commands/generate.js";

const program = new Command();

program
  .name("modular-fe")
  .description(
    chalk.cyan("CLI para generar código frontend modular con Clean Architecture")
  )
  .version("1.0.0");

// Add commands
program.addCommand(createGenerateCommand());

// Default action - show help
program.action(() => {
  console.log();
  console.log(chalk.bold.magenta("🚀 GlobalS1 Modular Frontend CLI"));
  console.log();
  console.log(chalk.gray("Comandos disponibles:"));
  console.log();
  console.log(
    chalk.cyan("  mfe generate module <name>") +
      chalk.gray("  - Genera un módulo completo")
  );
  console.log(
    chalk.cyan("  mfe generate service <name>") +
      chalk.gray(" - Genera un service")
  );
  console.log(
    chalk.cyan("  mfe generate store <name>") +
      chalk.gray("   - Genera un store")
  );
  console.log(
    chalk.cyan("  mfe generate hook <name>") +
      chalk.gray("    - Genera un hook")
  );
  console.log(
    chalk.cyan("  mfe generate page <name>") +
      chalk.gray("    - Genera una página")
  );
  console.log(
    chalk.cyan("  mfe generate component <name>") +
      chalk.gray(" - Genera un componente")
  );
  console.log();
  console.log(chalk.gray("Aliases:"));
  console.log(chalk.gray("  g = generate, m = module, s = service"));
  console.log(chalk.gray("  st = store, h = hook, p = page, c = component"));
  console.log();
  console.log(chalk.gray("Ejemplos:"));
  console.log(chalk.white("  mfe g m user-profile"));
  console.log(chalk.white("  mfe g s payment -m checkout"));
  console.log(chalk.white("  mfe generate module products --no-tests"));
  console.log();
  console.log(chalk.gray("Para más información:"));
  console.log(chalk.white("  mfe --help"));
  console.log(chalk.white("  mfe generate --help"));
  console.log();
});

program.parse();
