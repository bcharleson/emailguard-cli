import { z } from 'zod';

export interface CliMapping {
  args?: Array<{
    field: string;
    name: string;
    required?: boolean;
  }>;
  options?: Array<{
    field: string;
    flags: string;
    description?: string;
  }>;
}

export interface CommandDefinition<TInput extends z.ZodTypeAny = z.ZodTypeAny> {
  /** Unique identifier — used as MCP tool name. e.g., "domains_list" */
  name: string;

  /** CLI group. e.g., "domains" */
  group: string;

  /** CLI subcommand name. e.g., "list" */
  subcommand: string;

  /** Human-readable description (used in --help AND MCP tool description) */
  description: string;

  /** Detailed examples for --help output */
  examples?: string[];

  /** Zod schema defining all inputs */
  inputSchema: TInput;

  /** Maps Zod fields to CLI constructs (args and options) */
  cliMappings: CliMapping;

  /** The handler function — calls client directly */
  handler: (input: z.infer<TInput>, client: EmailGuardClient) => Promise<unknown>;
}

export interface EmailGuardClient {
  request<T>(options: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
  }): Promise<T>;

  get<T>(path: string, query?: Record<string, any>): Promise<T>;
  post<T>(path: string, body?: unknown, query?: Record<string, any>): Promise<T>;
  postFormData<T>(path: string, formData: FormData): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
}

export interface EmailGuardConfig {
  api_key: string;
  email?: string;
}

export interface GlobalOptions {
  apiKey?: string;
  baseUrl?: string;
  output?: 'json' | 'pretty';
  quiet?: boolean;
  fields?: string;
  pretty?: boolean;
}
