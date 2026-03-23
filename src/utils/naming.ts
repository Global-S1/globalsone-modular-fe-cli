/**
 * Naming utilities for code generation
 */

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export interface NamingVariants {
  pascal: string;      // UserProfile
  camel: string;       // userProfile
  kebab: string;       // user-profile
  snake: string;       // user_profile
  original: string;    // original input
}

export function getAllNamingVariants(name: string): NamingVariants {
  const kebab = toKebabCase(name);
  return {
    pascal: toPascalCase(name),
    camel: toCamelCase(name),
    kebab,
    snake: toSnakeCase(name),
    original: name,
  };
}
