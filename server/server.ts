import express, { Router, Express } from "express";
import { Config, loadConfig } from "./config";
import { Kysely } from "kysely";
import { DB } from "./database-types";
import { Repository } from "./repository";
import {
  ExampleMessage,
  Hangout,
  NewFriend,
  NewHangout,
  Friend,
  CreateFriendResponse,
} from "shared";
import * as path from "path";
import morgan from "morgan";
import { createAPIRoutes } from "./routes";

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
  const repo = new Repository();

  app.use(morgan("dev"));
  app.use(express.json());
  configureCORSHeaders(app);

  app.use("/api", createAPIRoutes(config, repo));

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

function configureCORSHeaders(app: Express) {
  // todo Maybe remove these now that I'm using proxying in local dev
  const config = loadConfig();
  const { allowAnyOrigin, allowAnyHeaders, allowAnyMethods } = config;

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
}

main();
