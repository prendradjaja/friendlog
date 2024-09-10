import express, { Router } from "express";
import { Config, loadConfig } from "./config";
import { Kysely } from "kysely";
import { DB } from "./database-types";
import { databaseConfig } from "./database";
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

  // todo Error handling for all the endpoints

  router.get("/me/friends", async (req, res) => {
    const friends = await repo.getMyFriends();
    res.json(friends);
  });

  router.get("/me/friends/:friendId/hangouts", async (req, res) => {
    // todo DRY with /me/hangouts, also maybe grab fixes from its todos (n+1 queries problem, join)
    const friendId = +req.params.friendId;
    const rawHangouts = await repo.getMyHangouts();
    const hangouts: Hangout[] = [];
    for (const hangout of rawHangouts) {
      const friendIds = (await repo.getHangoutFriends(hangout.id)).map(
        (row) => row.friend_id,
      );
      const friends: Friend[] = [];
      for (const id of friendIds) {
        friends.push(await repo.getFriend(id));
      }
      hangouts.push({
        ...hangout,
        friends,
      });
    }
    const results: Hangout[] = hangouts.filter((hangout) =>
      hangout.friends.map((friend) => friend.id).includes(friendId),
    );
    res.json(results);
  });

  router.post("/me/friends", async (req, res) => {
    const newFriend: NewFriend = req.body;
    const rows = await repo.createMyFriend(newFriend);
    const result: CreateFriendResponse = {
      id: rows[0].id,
    };
    res.json(result);
  });

  router.get("/me/hangouts", async (req, res) => {
    // todo This is the n+1 queries problem -- fix
    // todo Getting friends also doesn't need to be separate from getting friend ids probably (join?)
    const rawHangouts = await repo.getMyHangouts();
    const hangouts: Hangout[] = [];
    for (const hangout of rawHangouts) {
      const friendIds = (await repo.getHangoutFriends(hangout.id)).map(
        (row) => row.friend_id,
      );
      const friends: Friend[] = [];
      for (const id of friendIds) {
        friends.push(await repo.getFriend(id));
      }
      hangouts.push({
        ...hangout,
        friends,
      });
    }
    const results: Hangout[] = hangouts;
    res.json(hangouts);
  });

  router.post("/me/hangouts", async (req, res) => {
    const newHangout: NewHangout = req.body;
    await repo.createMyHangout(newHangout);
    res.json({});
  });

  return router;
}

main();
