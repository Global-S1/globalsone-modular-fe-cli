import { NamingVariants } from "../utils/naming.js";

export interface TemplateContext {
  name: NamingVariants;
  moduleName?: NamingVariants;
}

// ============== PAGE TEMPLATE ==============
export function pageTemplate(ctx: TemplateContext): string {
  return `/**
 * @file ${ctx.name.kebab}.page.tsx
 * @description Page component for ${ctx.name.pascal} module
 */

interface ${ctx.name.pascal}PageProps {
  // Add props here
}

export default function ${ctx.name.pascal}Page({}: ${ctx.name.pascal}PageProps) {
  return (
    <div className="${ctx.name.kebab}-page">
      <h1>${ctx.name.pascal}</h1>
      {/* Add your content here */}
    </div>
  );
}
`;
}

// ============== SERVICE TEMPLATE ==============
export function serviceTemplate(ctx: TemplateContext): string {
  return `/**
 * @file ${ctx.name.kebab}.service.ts
 * @responsibility Encapsulates all API calls related to ${ctx.name.pascal}.
 */

import httpClient from "@infrastructure/api/http-client";

export interface ${ctx.name.pascal}DTO {
  id: string;
  // Add DTO fields here
}

export interface Create${ctx.name.pascal}DTO {
  // Add create DTO fields here
}

export const ${ctx.name.pascal}Service = {
  async getAll(): Promise<${ctx.name.pascal}DTO[]> {
    const response = await httpClient.get<${ctx.name.pascal}DTO[]>("/${ctx.name.kebab}");
    return response.data;
  },

  async getById(id: string): Promise<${ctx.name.pascal}DTO> {
    const response = await httpClient.get<${ctx.name.pascal}DTO>(\`/${ctx.name.kebab}/\${id}\`);
    return response.data;
  },

  async create(data: Create${ctx.name.pascal}DTO): Promise<${ctx.name.pascal}DTO> {
    const response = await httpClient.post<${ctx.name.pascal}DTO>("/${ctx.name.kebab}", data);
    return response.data;
  },

  async update(id: string, data: Partial<Create${ctx.name.pascal}DTO>): Promise<${ctx.name.pascal}DTO> {
    const response = await httpClient.put<${ctx.name.pascal}DTO>(\`/${ctx.name.kebab}/\${id}\`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(\`/${ctx.name.kebab}/\${id}\`);
  },
};
`;
}

// ============== STORE TEMPLATE ==============
export function storeTemplate(ctx: TemplateContext): string {
  return `/**
 * @file ${ctx.name.kebab}.store.ts
 * @responsibility Manages local state for ${ctx.name.pascal} using Zustand.
 */

import { create } from "zustand";

interface ${ctx.name.pascal}State {
  isLoading: boolean;
  error: string | null;
  // Add state fields here

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
};

export const use${ctx.name.pascal}Store = create<${ctx.name.pascal}State>((set) => ({
  ...initialState,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
`;
}

// ============== HOOK TEMPLATE ==============
export function hookTemplate(ctx: TemplateContext): string {
  const serviceName = ctx.moduleName?.pascal || ctx.name.pascal;
  return `/**
 * @file use-${ctx.name.kebab}.ts
 * @responsibility Custom hook for ${ctx.name.pascal} data and logic.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ${serviceName}Service } from "../services/${ctx.moduleName?.kebab || ctx.name.kebab}.service";

const QUERY_KEY = "${ctx.name.kebab}";

export function use${ctx.name.pascal}() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => ${serviceName}Service.getAll(),
  });
}

export function use${ctx.name.pascal}ById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => ${serviceName}Service.getById(id),
    enabled: !!id,
  });
}

export function useCreate${ctx.name.pascal}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ${serviceName}Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdate${ctx.name.pascal}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof ${serviceName}Service.update>[1] }) =>
      ${serviceName}Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDelete${ctx.name.pascal}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ${serviceName}Service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
`;
}

// ============== COMPONENT TEMPLATE ==============
export function componentTemplate(ctx: TemplateContext): string {
  return `/**
 * @file ${ctx.name.pascal}.tsx
 * @description ${ctx.name.pascal} component
 */

interface ${ctx.name.pascal}Props {
  // Add props here
}

export function ${ctx.name.pascal}({}: ${ctx.name.pascal}Props) {
  return (
    <div className="${ctx.name.kebab}">
      {/* Add your content here */}
    </div>
  );
}
`;
}

// ============== TEST TEMPLATES ==============
export function serviceTestTemplate(ctx: TemplateContext): string {
  return `import { describe, it, expect, vi, beforeEach } from "vitest";
import { ${ctx.name.pascal}Service } from "./${ctx.name.kebab}.service";
import httpClient from "@infrastructure/api/http-client";

vi.mock("@infrastructure/api/http-client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("${ctx.name.pascal}Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all items", async () => {
      const mockData = [{ id: "1" }];
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockData });

      const result = await ${ctx.name.pascal}Service.getAll();

      expect(httpClient.get).toHaveBeenCalledWith("/${ctx.name.kebab}");
      expect(result).toEqual(mockData);
    });
  });

  describe("getById", () => {
    it("should fetch item by id", async () => {
      const mockData = { id: "1" };
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockData });

      const result = await ${ctx.name.pascal}Service.getById("1");

      expect(httpClient.get).toHaveBeenCalledWith("/${ctx.name.kebab}/1");
      expect(result).toEqual(mockData);
    });
  });
});
`;
}

export function storeTestTemplate(ctx: TemplateContext): string {
  return `import { describe, it, expect, beforeEach } from "vitest";
import { use${ctx.name.pascal}Store } from "./${ctx.name.kebab}.store";

describe("use${ctx.name.pascal}Store", () => {
  beforeEach(() => {
    use${ctx.name.pascal}Store.getState().reset();
  });

  it("should have correct initial state", () => {
    const state = use${ctx.name.pascal}Store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set loading state", () => {
    const { setLoading } = use${ctx.name.pascal}Store.getState();

    setLoading(true);

    expect(use${ctx.name.pascal}Store.getState().isLoading).toBe(true);
  });

  it("should set error state", () => {
    const { setError } = use${ctx.name.pascal}Store.getState();

    setError("Test error");

    expect(use${ctx.name.pascal}Store.getState().error).toBe("Test error");
  });

  it("should reset state", () => {
    const store = use${ctx.name.pascal}Store.getState();
    store.setLoading(true);
    store.setError("Error");

    store.reset();

    const state = use${ctx.name.pascal}Store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
`;
}

// ============== INDEX TEMPLATE ==============
export function moduleIndexTemplate(ctx: TemplateContext): string {
  return `/**
 * @file index.ts
 * @description Public API for ${ctx.name.pascal} module
 */

// Pages
export { default as ${ctx.name.pascal}Page } from "./pages/${ctx.name.kebab}.page";

// Hooks
export * from "./hooks/use-${ctx.name.kebab}";

// Services
export { ${ctx.name.pascal}Service } from "./services/${ctx.name.kebab}.service";

// Store
export { use${ctx.name.pascal}Store } from "./stores/${ctx.name.kebab}.store";
`;
}
