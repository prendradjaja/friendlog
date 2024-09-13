import { Express, Router } from "express";

import { Repository } from "./repository";
import { Config } from "./config";
import {
  LoginStatus,
  ExampleMessage,
  Hangout,
  NewFriend,
  NewHangout,
  Friend,
  CreateFriendResponse,
} from "shared";
import { ensureLoggedIn, getUserId } from "./authentication";
import { unflattenHangouts } from "./routes.helpers";

export function createAPIRoutes(config: Config, repo: Repository) {
  const router = Router();
  const { fakeNetworkDelay } = config;

  router.use((req, res, next) => {
    if (!fakeNetworkDelay) {
      next();
    } else {
      setTimeout(next, fakeNetworkDelay);
    }
  });

  router.get("/me", async (req, res) => {
    let result: LoginStatus;
    if (req.isAuthenticated === undefined || !req.isAuthenticated()) {
      result = {
        isLoggedIn: false,
      };
    } else {
      result = {
        isLoggedIn: true,
        user: {
          name: (req.user as any)?.name,
        },
      };
    }
    res.json(result);
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

  router.use(ensureLoggedIn);

  router.get("/me/friends", async (req, res) => {
    const userId = getUserId(req);
    const friends = await repo.getMyFriends(userId);
    res.json(friends);
  });

  // todo Maybe change this to /me/hangouts?friendId=
  router.get("/me/friends/:friendId/hangouts", async (req, res) => {
    const userId = getUserId(req);
    const friendId = +req.params.friendId;
    const rows = await repo.getHangouts(userId, friendId);
    const results: Hangout[] = unflattenHangouts(rows);
    res.json(results);
  });

  router.post("/me/friends", async (req, res) => {
    const userId = getUserId(req);
    const newFriend: NewFriend = req.body;
    const rows = await repo.createMyFriend(userId, newFriend);
    const result: CreateFriendResponse = {
      id: rows[0].id,
    };
    res.json(result);
  });

  router.get("/me/hangouts", async (req, res) => {
    const userId = getUserId(req);
    const rows = await repo.getHangouts(userId);
    const results: Hangout[] = unflattenHangouts(rows);
    res.json(results);
  });

  router.post("/me/hangouts", async (req, res) => {
    const userId = getUserId(req);
    const newHangout: NewHangout = req.body;
    await repo.createMyHangout(userId, newHangout);
    res.json({});
  });

  router.delete("/me/hangouts/:hangoutId", async (req, res) => {
    const userId = getUserId(req);
    const hangoutId = +req.params.hangoutId;
    await repo.deleteHangout(userId, hangoutId);
    res.json({});
  });

  return router;
}
