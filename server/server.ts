import express, { Router } from "express";
import { Config, loadConfig } from "./config";
import { Kysely } from "kysely";
import { DB } from "./database-types";
import { databaseConfig } from "./database";
import { Repository } from "./repository";
import { ExampleMessage } from "shared";
import * as path from "path";

const db = new Kysely<DB>(databaseConfig);
const repo = new Repository(db);

function main() {
  const config = loadConfig();
  const {
    port,
    allowAnyOrigin,
    allowAnyHeaders,
    allowAnyMethods,
    staticFilesPath,
  } = config;

  const app = express();

  app.use(express.json());

  if (allowAnyOrigin) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });
  }

  if (allowAnyHeaders) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });
  }

  if (allowAnyMethods) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });
  }

  app.use("/api", createAPIRouter(config));

  if (staticFilesPath) {
    app.use(express.static(staticFilesPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(staticFilesPath, "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

function createAPIRouter(config: Config) {
  const router = express.Router();
  const { fakeNetworkDelay } = config;

  router.use((req, res, next) => {
    if (!fakeNetworkDelay) {
      next();
    } else {
      setTimeout(next, fakeNetworkDelay);
    }
  });

  router.get("/example-messages/:messageId", async (req, res) => {
    const messageId = +req.params.messageId;
    if (messageId === 0) {
      const response: ExampleMessage = { value: "Example message" };
      res.json(response);
    } else {
      res.status(404).json({});
    }
  });

  return router;
}

main();
