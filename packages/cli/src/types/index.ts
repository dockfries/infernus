export interface PawnJsonResources {
  name: string;
  platform: "windows" | "linux";
  version: "0.3.7" | "0.3DL";
  archive: boolean;
  includes: string[];
  plugins: string[];
  files: Record<string, string>;
}
export interface PawnJson {
  [key: string]: any;
  resources: PawnJsonResources[];
}

export interface LocalConfig {
  /** written by the CLI so editors can validate and complete the file */
  $schema?: string;
  dependencies?: Record<string, string>;
}

export interface GlobalConfig {
  gh_token?: string;
  [key: string]: any;
}

export interface LockFileDep {
  version?: string;
  component?: boolean;
}

export interface LockFileContent {
  lockfileVersion?: number;
  dependencies?: Record<string, LockFileDep>;
}

export interface AddDepsOptions {
  dependencies?: string[];
  production?: boolean;
  component?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

export interface ListVersionsOptions {
  dependencies?: string[];
  all?: boolean;
  limit?: number;
  json?: boolean;
  verbose?: boolean;
}

export interface RemoveDepsOptions {
  dependencies?: string[];
}

export interface CleanCacheOptions {
  dependencies?: string[];
  all?: boolean;
}

export interface SetGetConfigOptions {
  key?: string;
  value?: string;
  list?: boolean;
}
