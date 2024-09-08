export interface Config {
  port: string;
  allowAnyOrigin: boolean;
  allowAnyHeaders: boolean;
  allowAnyMethods: boolean;
  staticFilesPath: string | undefined;
  databaseUrl: string;
  useSSLForDatabaseConnection: boolean;
  fakeNetworkDelay: number | undefined; // In milliseconds
}

export const devConfig: Config = {
  port: "8000",
  allowAnyOrigin: true,
  allowAnyHeaders: true,
  allowAnyMethods: true,
  staticFilesPath: undefined,
  databaseUrl: "postgres://localhost:5432/friendlog",
  useSSLForDatabaseConnection: false,
  fakeNetworkDelay: 100,
};

const loadProductionConfig: () => Config = () => ({
  port: getEnvironmentVariable("PORT"),
  allowAnyOrigin: false,
  allowAnyHeaders: false,
  allowAnyMethods: false,
  staticFilesPath: "../client/dist/",
  databaseUrl: getEnvironmentVariable("DATABASE_URL"),
  useSSLForDatabaseConnection: true,
  fakeNetworkDelay: undefined,
});

export function loadConfig(): Config {
  const isDev = process.env.DEV === "true";
  if (isDev) {
    return devConfig;
  } else {
    return loadProductionConfig();
  }
}

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error("Missing environment variable: " + name);
  }
  return value;
}
