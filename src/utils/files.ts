import fs from "fs/promises";
import path from "path";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function createDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  const dir = path.dirname(filePath);
  await createDirectory(dir);
  await fs.writeFile(filePath, content, "utf-8");
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

export function resolvePath(...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths);
}

export async function findProjectRoot(): Promise<string | null> {
  let currentDir = process.cwd();

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (await fileExists(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

export async function ensureModulesDirectory(): Promise<string> {
  const projectRoot = await findProjectRoot();
  if (!projectRoot) {
    throw new Error(
      "No se encontró package.json. Asegúrate de estar en un proyecto válido."
    );
  }

  const modulesDir = path.join(projectRoot, "src", "modules");
  if (!(await directoryExists(modulesDir))) {
    throw new Error(
      `No se encontró el directorio src/modules. Asegúrate de estar usando el template globalsone-modular-fe-template.`
    );
  }

  return modulesDir;
}
