import * as fs from "fs";

type GetSecretFunction = (secretKey: string) => string;

const localSecretsPath = "./local-secrets.json";

export interface Config {
  port: string;
  allowAnyOrigin: boolean;
  allowAnyHeaders: boolean;
  allowAnyMethods: boolean;
  staticFilesPath: string | undefined;
  databaseUrl: string;
  useSSLForDatabaseConnection: boolean;
  fakeNetworkDelay: number | undefined; // In milliseconds
  googleClientID: string;
  googleClientSecret: string;
}

const loadDevConfig = (getSecret: GetSecretFunction) =>
  ({
    port: "2201",
    allowAnyOrigin: true,
    allowAnyHeaders: true,
    allowAnyMethods: true,
    staticFilesPath: undefined,
    databaseUrl: "postgres://localhost:5432/friendlog",
    useSSLForDatabaseConnection: false,
    fakeNetworkDelay: 100,
    googleClientID: getSecret("GOOGLE_CLIENT_ID"),
    googleClientSecret: getSecret("GOOGLE_CLIENT_SECRET"),
  }) satisfies Config;

const loadProductionConfig: () => Config = () =>
  ({
    port: getEnvironmentVariable("PORT"),
    allowAnyOrigin: false,
    allowAnyHeaders: false,
    allowAnyMethods: false,
    staticFilesPath: "../client/dist/",
    databaseUrl: getEnvironmentVariable("DATABASE_URL"),
    useSSLForDatabaseConnection: true,
    fakeNetworkDelay: undefined,
    googleClientID: getEnvironmentVariable("GOOGLE_CLIENT_ID"),
    googleClientSecret: getEnvironmentVariable("GOOGLE_CLIENT_SECRET"),
  }) satisfies Config;

export function loadConfig(): Config {
  const isDev = process.env.DEV === "true";
  if (isDev) {
    const getSecret = getLocalSecrets();
    return loadDevConfig(getSecret);
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

function getLocalSecrets() {
  if (!fs.existsSync(localSecretsPath)) {
    throw new Error("Missing secrets file (required for local development)");
  }
  const secrets: Partial<Record<string, string>> = JSON.parse(
    fs.readFileSync("./local-secrets.json", "utf8"),
  );

  return (secretKey: string): string => {
    const value = secrets[secretKey];
    if (value === undefined) {
      throw new Error("Missing secret: " + secretKey);
    }
    return value;
  };
}
