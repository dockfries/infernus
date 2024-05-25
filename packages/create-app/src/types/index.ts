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
  dependencies?: Record<string, string>;
}

export interface GlobalConfig {
  gh_token?: string;
  [key: string]: any;
}

export interface LockFileContent {
  lockfileVersion?: number;
  dependencies?: Record<string, { version: string }>;
}

export interface AddDepsOptions {
  dependencies?: string[];
  production?: boolean;
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
