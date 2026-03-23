import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { generateModule } from "../generators/module.generator.js";
import {
  generateComponent,
  ComponentType,
} from "../generators/component.generator.js";
import { logger } from "../utils/logger.js";

export function createGenerateCommand(): Command {
  const generate = new Command("generate")
    .alias("g")
    .description("Genera código para el proyecto");

  // Generate module
  generate
    .command("module <name>")
    .alias("m")
    .description("Genera un nuevo módulo completo")
    .option("--no-service", "No crear service")
    .option("--no-store", "No crear store")
    .option("--no-hook", "No crear hook")
    .option("--no-tests", "No crear tests")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      const spinner = ora("Generando módulo...").start();
      try {
        await generateModule({
          name,
          withService: options.service,
          withStore: options.store,
          withHook: options.hook,
          withTests: options.tests,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar módulo");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  // Generate service
  generate
    .command("service <name>")
    .alias("s")
    .description("Genera un nuevo service en un módulo")
    .option("-m, --module <module>", "Módulo donde crear el service")
    .option("--no-tests", "No crear tests")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      let moduleName = options.module;

      if (!moduleName) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "module",
            message: "¿En qué módulo quieres crear el service?",
            validate: (input) => (input ? true : "El módulo es requerido"),
          },
        ]);
        moduleName = answers.module;
      }

      const spinner = ora("Generando service...").start();
      try {
        await generateComponent({
          type: "service",
          name,
          module: moduleName,
          withTests: options.tests,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar service");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  // Generate store
  generate
    .command("store <name>")
    .alias("st")
    .description("Genera un nuevo store en un módulo")
    .option("-m, --module <module>", "Módulo donde crear el store")
    .option("--no-tests", "No crear tests")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      let moduleName = options.module;

      if (!moduleName) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "module",
            message: "¿En qué módulo quieres crear el store?",
            validate: (input) => (input ? true : "El módulo es requerido"),
          },
        ]);
        moduleName = answers.module;
      }

      const spinner = ora("Generando store...").start();
      try {
        await generateComponent({
          type: "store",
          name,
          module: moduleName,
          withTests: options.tests,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar store");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  // Generate hook
  generate
    .command("hook <name>")
    .alias("h")
    .description("Genera un nuevo hook en un módulo")
    .option("-m, --module <module>", "Módulo donde crear el hook")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      let moduleName = options.module;

      if (!moduleName) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "module",
            message: "¿En qué módulo quieres crear el hook?",
            validate: (input) => (input ? true : "El módulo es requerido"),
          },
        ]);
        moduleName = answers.module;
      }

      const spinner = ora("Generando hook...").start();
      try {
        await generateComponent({
          type: "hook",
          name,
          module: moduleName,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar hook");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  // Generate page
  generate
    .command("page <name>")
    .alias("p")
    .description("Genera una nueva página en un módulo")
    .option("-m, --module <module>", "Módulo donde crear la página")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      let moduleName = options.module;

      if (!moduleName) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "module",
            message: "¿En qué módulo quieres crear la página?",
            validate: (input) => (input ? true : "El módulo es requerido"),
          },
        ]);
        moduleName = answers.module;
      }

      const spinner = ora("Generando página...").start();
      try {
        await generateComponent({
          type: "page",
          name,
          module: moduleName,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar página");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  // Generate component
  generate
    .command("component <name>")
    .alias("c")
    .description("Genera un nuevo componente en un módulo")
    .option("-m, --module <module>", "Módulo donde crear el componente")
    .option("--dry-run", "Mostrar qué se crearía sin crear archivos")
    .action(async (name: string, options) => {
      let moduleName = options.module;

      if (!moduleName) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "module",
            message: "¿En qué módulo quieres crear el componente?",
            validate: (input) => (input ? true : "El módulo es requerido"),
          },
        ]);
        moduleName = answers.module;
      }

      const spinner = ora("Generando componente...").start();
      try {
        await generateComponent({
          type: "component",
          name,
          module: moduleName,
          dryRun: options.dryRun,
        });
        spinner.stop();
      } catch (error) {
        spinner.fail("Error al generar componente");
        logger.error((error as Error).message);
        process.exit(1);
      }
    });

  return generate;
}
