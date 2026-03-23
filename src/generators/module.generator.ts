import path from "path";
import { getAllNamingVariants, NamingVariants } from "../utils/naming.js";
import { writeFile, ensureModulesDirectory, fileExists } from "../utils/files.js";
import { logger } from "../utils/logger.js";
import {
  pageTemplate,
  serviceTemplate,
  storeTemplate,
  hookTemplate,
  moduleIndexTemplate,
  serviceTestTemplate,
  storeTestTemplate,
} from "../templates/index.js";

export interface ModuleGeneratorOptions {
  name: string;
  withService?: boolean;
  withStore?: boolean;
  withHook?: boolean;
  withTests?: boolean;
  dryRun?: boolean;
}

interface GeneratedFile {
  path: string;
  content: string;
}

export async function generateModule(
  options: ModuleGeneratorOptions
): Promise<void> {
  const {
    name,
    withService = true,
    withStore = true,
    withHook = true,
    withTests = true,
    dryRun = false,
  } = options;

  const naming = getAllNamingVariants(name);
  const modulesDir = await ensureModulesDirectory();
  const moduleDir = path.join(modulesDir, naming.kebab);

  // Check if module already exists
  if (await fileExists(moduleDir)) {
    throw new Error(`El módulo '${naming.kebab}' ya existe en ${moduleDir}`);
  }

  logger.title(`Generando módulo: ${naming.pascal}`);

  const files: GeneratedFile[] = [];
  const ctx = { name: naming };

  // Always create page
  files.push({
    path: path.join(moduleDir, "pages", `${naming.kebab}.page.tsx`),
    content: pageTemplate(ctx),
  });

  // Create components directory with .gitkeep
  files.push({
    path: path.join(moduleDir, "components", ".gitkeep"),
    content: "",
  });

  // Service
  if (withService) {
    files.push({
      path: path.join(moduleDir, "services", `${naming.kebab}.service.ts`),
      content: serviceTemplate(ctx),
    });

    if (withTests) {
      files.push({
        path: path.join(moduleDir, "services", `${naming.kebab}.service.test.ts`),
        content: serviceTestTemplate(ctx),
      });
    }
  }

  // Store
  if (withStore) {
    files.push({
      path: path.join(moduleDir, "stores", `${naming.kebab}.store.ts`),
      content: storeTemplate(ctx),
    });

    if (withTests) {
      files.push({
        path: path.join(moduleDir, "stores", `${naming.kebab}.store.test.ts`),
        content: storeTestTemplate(ctx),
      });
    }
  }

  // Hook
  if (withHook && withService) {
    files.push({
      path: path.join(moduleDir, "hooks", `use-${naming.kebab}.ts`),
      content: hookTemplate({ name: naming, moduleName: naming }),
    });
  }

  // Index file
  files.push({
    path: path.join(moduleDir, "index.ts"),
    content: moduleIndexTemplate(ctx),
  });

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
  logger.success(`Módulo '${naming.pascal}' generado exitosamente`);

  // Show usage hint
  console.log();
  logger.info("Para usar el módulo:");
  console.log(`  import { ${naming.pascal}Page } from "@modules/${naming.kebab}";`);
}
