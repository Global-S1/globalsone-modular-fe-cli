import path from "path";
import { getAllNamingVariants } from "../utils/naming.js";
import {
  writeFile,
  ensureModulesDirectory,
  fileExists,
  directoryExists,
} from "../utils/files.js";
import { logger } from "../utils/logger.js";
import {
  serviceTemplate,
  storeTemplate,
  hookTemplate,
  pageTemplate,
  componentTemplate,
  serviceTestTemplate,
  storeTestTemplate,
} from "../templates/index.js";

export type ComponentType = "service" | "store" | "hook" | "page" | "component";

export interface ComponentGeneratorOptions {
  type: ComponentType;
  name: string;
  module: string;
  withTests?: boolean;
  dryRun?: boolean;
}

const typeConfig: Record<
  ComponentType,
  {
    dir: string;
    suffix: string;
    template: (ctx: any) => string;
    testTemplate?: (ctx: any) => string;
  }
> = {
  service: {
    dir: "services",
    suffix: ".service.ts",
    template: serviceTemplate,
    testTemplate: serviceTestTemplate,
  },
  store: {
    dir: "stores",
    suffix: ".store.ts",
    template: storeTemplate,
    testTemplate: storeTestTemplate,
  },
  hook: {
    dir: "hooks",
    suffix: ".ts",
    template: hookTemplate,
  },
  page: {
    dir: "pages",
    suffix: ".page.tsx",
    template: pageTemplate,
  },
  component: {
    dir: "components",
    suffix: ".tsx",
    template: componentTemplate,
  },
};

export async function generateComponent(
  options: ComponentGeneratorOptions
): Promise<void> {
  const { type, name, module, withTests = true, dryRun = false } = options;

  const naming = getAllNamingVariants(name);
  const moduleNaming = getAllNamingVariants(module);
  const modulesDir = await ensureModulesDirectory();
  const moduleDir = path.join(modulesDir, moduleNaming.kebab);

  // Check if module exists
  if (!(await directoryExists(moduleDir))) {
    throw new Error(
      `El módulo '${moduleNaming.kebab}' no existe. Créalo primero con: mfe generate module ${module}`
    );
  }

  const config = typeConfig[type];
  const fileName =
    type === "hook" ? `use-${naming.kebab}${config.suffix}` : `${naming.kebab}${config.suffix}`;
  const filePath = path.join(moduleDir, config.dir, fileName);

  // Check if file already exists
  if (await fileExists(filePath)) {
    throw new Error(`El archivo '${fileName}' ya existe en ${config.dir}/`);
  }

  logger.title(`Generando ${type}: ${naming.pascal}`);

  const ctx = { name: naming, moduleName: moduleNaming };
  const files: { path: string; content: string }[] = [];

  files.push({
    path: filePath,
    content: config.template(ctx),
  });

  // Add test file if applicable
  if (withTests && config.testTemplate) {
    const testFileName = fileName.replace(/\.ts$/, ".test.ts");
    files.push({
      path: path.join(moduleDir, config.dir, testFileName),
      content: config.testTemplate(ctx),
    });
  }

  // Generate files
  if (dryRun) {
    logger.info("Modo dry-run: No se crearán archivos");
    logger.divider();
    for (const file of files) {
      logger.file("crearía", path.relative(process.cwd(), file.path));
    }
  } else {
    for (const file of files) {
      await writeFile(file.path, file.content);
      logger.file("creado", path.relative(process.cwd(), file.path));
    }
  }

  logger.divider();
  logger.success(`${type} '${naming.pascal}' generado exitosamente`);
}
